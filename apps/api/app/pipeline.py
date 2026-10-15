import re

_ALLOWED_STYLES = {"natural", "email", "concise"}

def format_transcript(transcript: str, style: str = "natural") -> dict[str, object]:
    # Conservative deterministic formatting; this is not an LLM rewrite.
    if style not in _ALLOWED_STYLES:
        raise ValueError("unsupported style")
    text = re.sub(r"\s+", " ", transcript.strip())
    if not text:
        raise ValueError("transcript must not be blank")
    transformations: list[str] = []
    replacements = [
        (r"\s+comma\s*", ", "),
        (r"\s+question mark\s*", "? "),
        (r"\s+exclamation mark\s*", "! "),
        (r"\s+period\s*", ". "),
        (r"\s+colon\s*", ": "),
        (r"\s+semicolon\s*", "; "),
    ]
    for pattern, replacement in replacements:
        changed = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        if changed != text:
            transformations.append("spoken-punctuation")
            text = changed
    text = re.sub(r"\s+([,.!?;:])", r"\1", text)
    text = re.sub(r"([,.!?;]|(?<!\d):)(?=\S)", r"\1 ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if style == "natural" and text and text[-1] not in ".!?":
        text += "."
        transformations.append("terminal-punctuation")
    return {"text": text, "transformations": sorted(set(transformations))}
