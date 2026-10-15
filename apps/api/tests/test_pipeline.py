from app.pipeline import format_transcript

def test_spoken_punctuation():
    assert format_transcript("hey team comma can we meet friday question mark")["text"] == "hey team, can we meet friday?"

def test_terminal_punctuation():
    assert format_transcript("hello world")["text"] == "hello world."

def test_time_colon_preserved():
    assert format_transcript("meet me at 9:30") ["text"] == "meet me at 9:30."

def test_empty_rejected():
    try:
        format_transcript("  ")
    except ValueError:
        return
    assert False, "blank transcript should be rejected"
