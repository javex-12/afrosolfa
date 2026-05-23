from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AfroSolfa AI"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/afrosolfa"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_FOR_JWT"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
