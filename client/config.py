"""Client application configuration."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    # Flask settings
    HOST = os.getenv('CLIENT_HOST', '0.0.0.0')
    PORT = int(os.getenv('CLIENT_PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

    # Remote servers
    SERVER_A_URL = os.getenv('SERVER_A_URL', 'http://localhost:8000')
    SERVER_B_URL = os.getenv('SERVER_B_URL', 'http://localhost:8001')
    SERVER_TIMEOUT = int(os.getenv('SERVER_TIMEOUT', 300))

    # Caching
    CACHE_DIR = Path(__file__).parent / 'cache'
    CACHE_DIR.mkdir(exist_ok=True)
    CACHE_TTL = int(os.getenv('CACHE_TTL', 86400))  # 24 hours

    # Upload settings
    UPLOAD_DIR = Path(__file__).parent / 'uploads'
    UPLOAD_DIR.mkdir(exist_ok=True)
    MAX_UPLOAD_SIZE = int(os.getenv('MAX_UPLOAD_SIZE', 10485760))  # 10MB

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    ENABLE_HTTPS = os.getenv('ENABLE_HTTPS', 'False').lower() == 'true'

    # API settings
    API_VERSION = 'v1'
    API_TIMEOUT = int(os.getenv('API_TIMEOUT', 30))

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    ENABLE_HTTPS = True

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    SERVER_A_URL = 'http://localhost:8000'
    SERVER_B_URL = 'http://localhost:8001'
