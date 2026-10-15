from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200 and response.json()["status"] == "ok"

def test_format_endpoint():
    response = client.post("/v1/format", json={"transcript":"hello world","style":"natural"})
    assert response.status_code == 200 and response.json()["text"] == "hello world."
    assert response.json()["review_required"] is True

def test_transcription_not_fake_success():
    assert client.post("/v1/transcriptions").status_code == 501
