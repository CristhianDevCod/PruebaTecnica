FROM python:3.11-slim

WORKDIR /app

# Instala dependencias del sistema si se requieren
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY ai-model/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-model ./

EXPOSE 8000

# healthcheck endpoint:
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
