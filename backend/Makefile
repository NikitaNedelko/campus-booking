.PHONY: install run lint test

install:
	poetry install

run:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

lint:
	poetry run ruff check app tests

test:
	poetry run pytest
