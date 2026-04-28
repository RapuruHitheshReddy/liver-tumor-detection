from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =========================
# CONFIG
# =========================
MODEL_PATH = "model/unet_vgg16_lits_final.keras"
IMG_SIZE = 256
PIXEL_SPACING_MM = 0.7   # approx (can improve later)

# =========================
# LOAD MODEL
# =========================
model = load_model(MODEL_PATH, compile=False)

# =========================
# PREPROCESS
# =========================
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=(0, -1))
    return image

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
    mask_colored[:, :, 2] = mask * 255  # red channel

    overlay = cv2.addWeighted(original, 0.7, mask_colored, 0.3, 0)
    return overlay

# =========================
# POSTPROCESS (remove noise)
# =========================
def clean_mask(mask):
    mask = cv2.medianBlur(mask.astype(np.uint8), 5)
    return mask

# =========================
# AREA
# =========================
def compute_area(mask):
    tumor_pixels = np.sum(mask)

    pixel_area_mm2 = PIXEL_SPACING_MM ** 2
    area_mm2 = tumor_pixels * pixel_area_mm2
    area_cm2 = area_mm2 / 100.0

    return tumor_pixels, area_cm2

# =========================
# MAIN API
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    contents = await file.read()

    # preprocess
    img = preprocess_image(contents)

    # predict
    pred = model.predict(img)[0, ..., 0]

    # binary mask
    mask = (pred > 0.5).astype(np.uint8)

    # clean mask (important)
    mask = clean_mask(mask)

    # ===== FIXED PROBABILITY =====
    if np.sum(mask) > 0:
        probability = float(np.mean(pred[mask == 1]))
    else:
        probability = float(np.mean(pred))

    # classification + area
    tumor_pixels, area_cm2 = compute_area(mask)
    total_pixels = mask.size
    coverage = tumor_pixels / total_pixels

    # improved classification logic
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
        "tumor_pixels": int(tumor_pixels),
        "tumor_area_cm2": round(area_cm2, 4),
        "mask": to_base64(mask_img),
        "overlay": to_base64(overlay)
    }