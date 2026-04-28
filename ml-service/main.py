from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
import cv2
from PIL import Image
import io
import base64
import os

# =========================
# OPTIONAL: Reduce TF logs
# =========================
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# =========================
# GOOGLE DRIVE DOWNLOAD
# =========================
import gdown

MODEL_PATH = "model/unet_vgg16_lits_final.keras"
FILE_ID = "1RIKgp7B27QG7Uxn1cJzVGswlZDfBTiWl"

if not os.path.exists(MODEL_PATH):
    print("📥 Downloading model from Google Drive...")
    os.makedirs("model", exist_ok=True)
    url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(url, MODEL_PATH, quiet=False)

# =========================
# LOAD MODEL (CPU SAFE)
# =========================
from tensorflow.keras.models import load_model

print("🧠 Loading model...")
model = load_model(MODEL_PATH, compile=False)
print("✅ Model loaded successfully")

# =========================
# FASTAPI SETUP
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to Vercel domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# CONFIG
# =========================
IMG_SIZE = 256
PIXEL_SPACING_MM = 0.7

# =========================
# PREPROCESS
# =========================
def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("L")
        image = image.resize((IMG_SIZE, IMG_SIZE))
        image = np.array(image, dtype=np.float32) / 255.0
        image = np.expand_dims(image, axis=(0, -1))
        return image
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {e}")

# =========================
# BASE64
# =========================
def to_base64(img):
    _, buffer = cv2.imencode(".png", img)
    return base64.b64encode(buffer).decode("utf-8")

# =========================
# OVERLAY
# =========================
def create_overlay(original, mask):
    original = cv2.resize(original, (IMG_SIZE, IMG_SIZE))
    original = cv2.cvtColor(original, cv2.COLOR_GRAY2BGR)

    mask_colored = np.zeros_like(original)
    mask_colored[:, :, 2] = mask * 255  # red

    overlay = cv2.addWeighted(original, 0.7, mask_colored, 0.3, 0)
    return overlay

# =========================
# CLEAN MASK
# =========================
def clean_mask(mask):
    mask = cv2.medianBlur(mask.astype(np.uint8), 5)
    return mask

# =========================
# AREA
# =========================
def compute_area(mask):
    tumor_pixels = int(np.sum(mask))

    pixel_area_mm2 = PIXEL_SPACING_MM ** 2
    area_mm2 = tumor_pixels * pixel_area_mm2
    area_cm2 = area_mm2 / 100.0

    return tumor_pixels, area_cm2

# =========================
# HEALTH CHECK (IMPORTANT)
# =========================
@app.get("/")
def health():
    return {"status": "ok", "model_loaded": True}

# =========================
# MAIN API
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # preprocess
        img = preprocess_image(contents)

        # predict
        pred = model.predict(img, verbose=0)[0, ..., 0]

        # mask
        mask = (pred > 0.5).astype(np.uint8)
        mask = clean_mask(mask)

        # probability (better logic)
        if np.sum(mask) > 0:
            probability = float(np.mean(pred[mask == 1]))
        else:
            probability = float(np.mean(pred))

        # area + coverage
        tumor_pixels, area_cm2 = compute_area(mask)
        total_pixels = mask.size
        coverage = tumor_pixels / total_pixels

        # classification logic
        has_tumor = True if (tumor_pixels > 300 and probability > 0.5) else False

        # original image
        original = Image.open(io.BytesIO(contents)).convert("L")
        original = np.array(original)

        # overlay
        overlay = create_overlay(original, mask)

        # mask image
        mask_img = (mask * 255).astype(np.uint8)

        return {
            "has_tumor": has_tumor,
            "probability": round(probability, 4),
            "coverage": round(coverage, 4),
            "tumor_pixels": tumor_pixels,
            "tumor_area_cm2": round(area_cm2, 4),
            "mask": to_base64(mask_img),
            "overlay": to_base64(overlay)
        }

    except Exception as e:
        return {"error": str(e)}