# app/services/scoring.py
import unicodedata
import re
from difflib import SequenceMatcher

def normalize_text(text: str):
    """Normalize text for comparison"""
    if not text:
        return ""
        
    text = text.lower().strip()
    text = unicodedata.normalize('NFD', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

def similarity_ratio(a: str, b: str) -> float:
    """Return similarity ratio between two words (0-100)"""
    return SequenceMatcher(None, a, b).ratio() * 100
# scoring.py
def score_attempt(target: str, transcript: str, confidence: float, language: str):
    target_norm = normalize_text(target)
    transcript_norm = normalize_text(transcript)
    
    # Language-specific normalization
    if language == "english":
        # Handle English-specific cases like contractions
        target_norm = target_norm.replace("'", "").replace("’", "")
        transcript_norm = transcript_norm.replace("'", "").replace("’", "")
    
    target_words = target_norm.split()
    transcript_words = transcript_norm.split()
    
    word_feedback = []
    word_scores = []
    
    # Compare each word
    for i, target_word in enumerate(target_words):
        if i >= len(transcript_words):
            # No matching word in transcript
            word_feedback.append({
                "word": target_word,
                "status": "wrong",
                "suggestion": "Missing word"
            })
            word_scores.append(0)
            continue
        
        transcript_word = transcript_words[i]
        similarity = fuzz.ratio(target_word, transcript_word) / 100
        
        # Adjust thresholds based on language if needed
        if language == "english":
            # English might have different thresholds
            if similarity >= 0.95:
                status = "correct"
                suggestion = ""
            elif similarity >= 0.7:
                status = "close"
                suggestion = f"Try pronouncing '{target_word}' more clearly"
            else:
                status = "wrong"
                suggestion = f"Expected '{target_word}' but heard '{transcript_word}'"
        else:
            # Use original thresholds for other languages
            if similarity >= 0.9:
                status = "correct"
                suggestion = ""
            elif similarity >= 0.6:
                status = "close"
                suggestion = f"Try pronouncing '{target_word}' more clearly"
            else:
                status = "wrong"
                suggestion = f"Expected '{target_word}' but heard '{transcript_word}'"
        
        word_feedback.append({
            "word": target_word,
            "status": status,
            "suggestion": suggestion
        })
        word_scores.append(similarity)
    
    # Calculate overall score
    overall_score = sum(word_scores) / len(word_scores) * 100 if word_scores else 0
    overall_score = min(overall_score * (0.7 + 0.3 * confidence), 100)
    
    return {
        "score": round(overall_score, 1),
        "word_feedback": word_feedback,
        "suggestions": generate_suggestions(word_feedback, language)
    }

def generate_suggestions(word_feedback, language):
    wrong_words = [fb for fb in word_feedback if fb["status"] == "wrong"]
    if wrong_words:
        return f"Focus on: {', '.join([w['word'] for w in wrong_words])}"
    
    # Language-specific encouragement
    if language == "english":
        return "Great job! Your English pronunciation is improving!"
    else:
        return "Great job! Keep practicing!"