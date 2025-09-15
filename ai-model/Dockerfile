# ai-model/Dockerfile
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl libsndfile1 ffmpeg wget gcc g++ \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements from the Repo ai-model folder
COPY ./ai-model/requirements.txt ./requirements.txt

# Install Torch from the official index
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu/ torch==2.2.0

# Install the rest of the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy service code
COPY ./ai-model /app

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
