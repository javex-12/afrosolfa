FROM python:3.9-slim

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8000

# Start the application using uvicorn
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}