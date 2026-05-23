from groq import Groq
import os
from app.core.config import settings

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class AIService:
    @staticmethod
    def identify_song_from_text(text: str):
        """
        Use Groq to identify a song, its key, and cultural context from lyrics/OCR.
        """
        prompt = f"Analyze these lyrics or hymn text from a Nigerian/African context: '{text}'. Identify the song title, probable key, and Yoruba/English meaning if applicable. Return JSON."
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert in African Music, Yoruba Hymns, and Nigerian Gospel. You provide structured data about songs."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
            response_format={"type": "json_object"}
        )
    @staticmethod
    def chat_response(message: str, context: str = ""):
        """
        General music assistant chat.
        """
        prompt = f"User Message: {message}\nContext: {context}"
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are AfroSolfa AI, a specialized assistant for African/Yoruba Gospel music and Piano learning. You help users with tonic solfa, hymn history, and Yoruba music theory. Keep responses concise, helpful, and culturally aware."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
