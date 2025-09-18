import random
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from datetime import datetime, timedelta

# Import your models
from app.db.models import User, Lesson, LessonItem, Attempt, Flashcard, UserPreferences
from app.db.database import Base, get_db

# Sample data - added English to languages
languages = ["Yoruba", "Igbo", "Hausa", "English"]
levels = ["beginner", "intermediate", "advanced"]

# Sample phrases for each language - added English phrases
yoruba_phrases = [
    ("Ẹ káàárọ̀", "Good morning"),
    ("Ẹ káàsán", "Good afternoon"),
    ("Ẹ káalẹ́", "Good evening"),
    ("Báwo ni?", "How are you?"),
    ("Dáadáa ni", "I'm fine"),
    ("Ẹ ṣé", "Thank you"),
    ("Jọ̀wọ́", "Please"),
    ("Ẹ jẹ́ kí n lo", "Excuse me"),
    ("Ó dàbọ", "Goodbye"),
    ("Mo nífẹ̀ẹ́ rẹ", "I love you")
]

igbo_phrases = [
    ("Ụtụtụ ọma", "Good morning"),
    ("Ehihie ọma", "Good afternoon"),
    ("Mgbede ọma", "Good evening"),
    ("Kedu ka ị mere?", "How are you?"),
    ("Adị m mma", "I'm fine"),
    ("Daalụ", "Thank you"),
    ("Biko", "Please"),
    ("Hapụ m", "Excuse me"),
    ("Ka ọ dị", "Goodbye"),
    ("A hụrụ m gị n'anya", "I love you")
]

hausa_phrases = [
    ("Barka da safiya", "Good morning"),
    ("Barka da rana", "Good afternoon"),
    ("Barka da yamma", "Good evening"),
    ("Yaya lafiya?", "How are you?"),
    ("Lafiya lau", "I'm fine"),
    ("Na gode", "Thank you"),
    ("Don Allah", "Please"),
    ("Ku yi hakuri", "Excuse me"),
    ("Sai an jima", "Goodbye"),
    ("Ina son ku", "I love you")
]

# Added English phrases
english_phrases = [
    ("Hello, how are you?", "Basic greeting"),
    ("My name is...", "Introducing yourself"),
    ("Nice to meet you", "Polite response to introduction"),
    ("Where is the bathroom?", "Asking for directions"),
    ("How much does this cost?", "Asking about price"),
    ("I don't understand", "Expressing confusion"),
    ("Could you speak more slowly?", "Asking for clarification"),
    ("What time is it?", "Asking for the time"),
    ("I would like to order...", "Ordering food"),
    ("Thank you for your help", "Expressing gratitude")
]

def seed_database(db: Session):
    """Seed the database with mock data"""
    
    # Create demo users
    demo_users = [
        User(
            firebase_uid="demo_user_1",
            email="demo1@example.com",
            name="Demo User 1",
            xp=random.randint(100, 1000),
            streak=random.randint(1, 30)
        ),
        User(
            firebase_uid="demo_user_2",
            email="demo2@example.com",
            name="Demo User 2",
            xp=random.randint(100, 1000),
            streak=random.randint(1, 30)
        ),
        User(
            firebase_uid="demo_user_3",
            email="demo3@example.com",
            name="Demo User 3",
            xp=random.randint(100, 1000),
            streak=random.randint(1, 30)
        )
    ]
    
    for user in demo_users:
        if not db.query(User).filter(User.email == user.email).first():
            db.add(user)
    
    db.commit()
    
    # Create user preferences for each user
    users = db.query(User).all()
    for user in users:
        preferences = UserPreferences(
            user_id=user.id,
            target_language=random.choice(languages).lower()
        )
        db.add(preferences)
    
    db.commit()
    
    # Create lessons for each language and level
    lessons = []
    for language in languages:
        for level in levels:
            lesson = Lesson(
                language=language.lower(),
                title=f"{language} {level.capitalize()} Lessons",
                level=level
            )
            lessons.append(lesson)
            db.add(lesson)
    
    db.commit()
    
    # Create lesson items for each lesson
    for lesson in lessons:
        if lesson.language == "yoruba":
            phrases = yoruba_phrases
        elif lesson.language == "igbo":
            phrases = igbo_phrases
        elif lesson.language == "hausa":
            phrases = hausa_phrases
        else:  # english
            phrases = english_phrases
        
        # Adjust difficulty based on level
        if lesson.level == "beginner":
            selected_phrases = phrases[:4]
        elif lesson.level == "intermediate":
            selected_phrases = phrases[3:7]
        else:
            selected_phrases = phrases[6:]
        
        for i, (text, hint) in enumerate(selected_phrases):
            lesson_item = LessonItem(
                lesson_id=lesson.id,
                text=text,
                audio_url=f"{lesson.language}_{lesson.level}_{i}.mp3",
                hint=hint
            )
            db.add(lesson_item)
    
    db.commit()
    
    # Create some attempts for demo users
    users = db.query(User).all()
    lesson_items = db.query(LessonItem).all()
    
    for user in users:
        for _ in range(10):  # 10 attempts per user
            lesson_item = random.choice(lesson_items)
            transcript = lesson_item.text  # Perfect attempt
            if random.random() < 0.3:  # 30% chance of imperfect attempt
                # Modify the transcript slightly to simulate errors
                words = transcript.split()
                if words:
                    error_index = random.randint(0, len(words)-1)
                    words[error_index] = words[error_index][:-1] if len(words[error_index]) > 1 else words[error_index]
                    transcript = " ".join(words)
            
            # Calculate a score based on similarity to target
            score = calculate_similarity_score(lesson_item.text, transcript)
            
            # Create word feedback
            word_feedback = generate_word_feedback(lesson_item.text, transcript)
            
            attempt = Attempt(
                user_id=user.id,
                lesson_item_id=lesson_item.id,
                transcript=transcript,
                score=score,
                word_feedback=word_feedback,
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
            db.add(attempt)
    
    db.commit()
    
    # Create flashcards for users
    for user in users:
        # Get words the user has struggled with (score < 70)
        struggling_attempts = db.query(Attempt).filter(
            Attempt.user_id == user.id,
            Attempt.score < 70
        ).all()
        
        for attempt in struggling_attempts[:5]:  # Top 5 struggling words
            flashcard = Flashcard(
                user_id=user.id,
                text=attempt.lesson_item.text,
                times_wrong=random.randint(1, 5),
                last_seen=datetime.now() - timedelta(days=random.randint(1, 7))
            )
            db.add(flashcard)
    
    db.commit()
    
    print("Database seeded successfully!")

def calculate_similarity_score(target: str, transcript: str) -> float:
    """Calculate a similarity score between target and transcript"""
    # Simple implementation - in a real app, you'd use a more sophisticated algorithm
    target_words = target.split()
    transcript_words = transcript.split()
    
    if not target_words:
        return 100.0 if not transcript_words else 0.0
    
    matches = 0
    for tw, cw in zip(target_words, transcript_words):
        if tw == cw:
            matches += 1
        elif tw in cw or cw in tw:
            matches += 0.5
    
    score = (matches / len(target_words)) * 100
    return min(max(score, 0), 100)

def generate_word_feedback(target: str, transcript: str) -> dict:
    """Generate word-level feedback for an attempt"""
    target_words = target.split()
    transcript_words = transcript.split()
    
    feedback = {}
    for i, (tw, cw) in enumerate(zip(target_words, transcript_words)):
        if i >= len(transcript_words):
            status = "wrong"
            suggestion = f"Missing word: {tw}"
        elif tw == cw:
            status = "correct"
            suggestion = ""
        elif tw in cw or cw in tw:
            status = "close"
            suggestion = f"Almost correct. Expected: {tw}, Heard: {cw}"
        else:
            status = "wrong"
            suggestion = f"Expected: {tw}, Heard: {cw}"
        
        feedback[f"word_{i}"] = {
            "target": tw,
            "transcript": cw if i < len(transcript_words) else "",
            "status": status,
            "suggestion": suggestion
        }
    
    return feedback

if __name__ == "__main__":
    # Create database engine and session
    from app.core.config import settings
    from app.db.database import SessionLocal
    
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal() 
    try:
        seed_database(db)
    finally:
        db.close()