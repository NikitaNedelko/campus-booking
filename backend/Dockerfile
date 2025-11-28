FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_ROOT_USER_ACTION=ignore \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PATH="/root/.local/bin:${PATH}"

WORKDIR /app

# System dependencies for building database drivers (asyncpg needs Python headers)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential python3-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to leverage Docker layer caching
COPY pyproject.toml poetry.lock* ./
RUN pip install --no-cache-dir "poetry==1.8.3" \
    && poetry lock --no-interaction \
    && poetry install --without dev --no-root --no-ansi

# Copy application code
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips=*"]
