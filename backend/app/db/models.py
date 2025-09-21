# models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import  Base,engine


Base.metadata.create_all(bind=engine)
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("Attempt", back_populates="user")
    flashcards = relationship("Flashcard", back_populates="user")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    language = Column(String)  # yoruba, igbo, hausa, english
    title = Column(String)
    level = Column(String)  # beginner, intermediate, advanced
    created_at = Column(DateTime, default=datetime.utcnow)
    
    items = relationship("LessonItem", back_populates="lesson")

class UserPreferences(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_language = Column(String, default="yoruba")  # Default language
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", backref="preferences")

class LessonItem(Base):
    __tablename__ = "lesson_items"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    text = Column(String)  # target phrase
    expected_answer = Column(String)  # NEW: expected pronunciation/response
    audio_url = Column(String)
    hint = Column(String)
    
    lesson = relationship("Lesson", back_populates="items")
    attempts = relationship("Attempt", back_populates="lesson_item")

class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_item_id = Column(Integer, ForeignKey("lesson_items.id"))
    transcript = Column(String)
    score = Column(Float)
    word_feedback = Column(JSON)  # {word: {status: "correct|close|wrong", suggestion: string}}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="attempts")
    lesson_item = relationship("LessonItem", back_populates="attempts")

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    times_wrong = Column(Integer, default=0)
    last_seen = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="flashcards")
