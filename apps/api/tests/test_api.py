from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_identifies_unconfigured_asr():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["asr"] == "not-configured"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_format_endpoint():
    response = client.post(
        "/v1/format",
        json={"transcript": "hello world", "style": "natural"},
    )
    assert response.status_code == 200
    assert response.json()["text"] == "hello world."
    assert response.json()["review_required"] is True


def test_transcription_not_fake_success():
    response = client.post("/v1/transcriptions")
    assert response.status_code == 501
    assert "not configured" in response.json()["detail"].lower()


def test_blank_transcript_rejected():
    response = client.post("/v1/format", json={"transcript": "  ", "style": "natural"})
    assert response.status_code == 422
