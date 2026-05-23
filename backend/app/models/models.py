from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Song(Base):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    lyrics = Column(Text, nullable=True)
    language = Column(String, default="Yoruba")
    denomination = Column(String, nullable=True)
    
    # AI Results Storage
    detected_key = Column(String)
    detected_scale = Column(String)
    tempo = Column(Float)
    tonic_solfa = Column(JSON)  # List of solfa steps
    note_mappings = Column(JSON)  # Frequencies or MIDI notes
    confidence_score = Column(Float)
    
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    corrections = relationship("Correction", back_populates="song")

class Correction(Base):
    __tablename__ = "corrections"
    id = Column(Integer, primary_key=True, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    previous_solfa = Column(JSON)
    corrected_solfa = Column(JSON)
    comment = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    song = relationship("Song", back_populates="corrections")

class HymnVariant(Base):
    __tablename__ = "hymn_variants"
    id = Column(Integer, primary_key=True, index=True)
    hymn_number = Column(Integer, index=True)
    book_name = Column(String) # e.g., "Yoruba Baptist Hymnal"
    title = Column(String)
    solfa_notation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
