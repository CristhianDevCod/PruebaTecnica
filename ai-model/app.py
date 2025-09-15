# ai-model/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from sentence_transformers import SentenceTransformer
import uvicorn
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-model")

MODEL_NAME = os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
MODEL_PORT = int(os.environ.get("MODEL_PORT", "8000"))

app = FastAPI(title="AI Embedding Service", version="0.1")

# load model once on startup
model: Optional[SentenceTransformer] = None

@app.on_event("startup")
async def load_model():
    global model
    if model is None:
        logger.info(f"Cargando modelo de embeddings: {MODEL_NAME} ... (esto puede tardar)")
        model = SentenceTransformer(MODEL_NAME)
        logger.info("Modelo cargado correctamente.")


class EmbeddingRequest(BaseModel):
    # input can be a single string or list of strings
    input: Any  # str | List[str]
    # optional: return normalized embeddings (unit vectors)
    normalize: Optional[bool] = False
    # optional: batch size for encode
    batch_size: Optional[int] = 32


class EmbeddingResponse(BaseModel):
    embedding: Optional[List[List[float]]]  # returns list-of-embeddings (even for single input)
    input_count: int


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None, "model": MODEL_NAME}


@app.post("/embeddings", response_model=EmbeddingResponse)
async def embeddings(req: EmbeddingRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Normalize input: accept string or list
    raw = req.input
    if raw is None:
        raise HTTPException(status_code=400, detail="Missing input")

    if isinstance(raw, str):
        texts = [raw]
    elif isinstance(raw, list):
        # ensure all elements are strings
        texts = [str(x) for x in raw]
    else:
        # try single conversion
        texts = [str(raw)]

    try:
        # encode returns numpy array; convert to list of floats
        emb_matrix = model.encode(texts, normalize_embeddings=bool(req.normalize), batch_size=req.batch_size or 32)
        # If single input, emb_matrix might be 1-D; ensure 2-D
        # sentence-transformers already returns 2D for list input
        embeddings_list = []
        # Cast to python floats with limited decimals for smaller payload (optional)
        for row in emb_matrix.tolist():
            # optionally round to reduce size, e.g., 6 decimals
            embeddings_list.append([float(f) for f in row])

        return EmbeddingResponse(embedding=embeddings_list, input_count=len(texts))
    except Exception as e:
        logger.exception("Error generating embeddings")
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {e}")


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=MODEL_PORT, log_level="info")
