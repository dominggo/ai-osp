"""Server configuration."""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Server identification
SERVER_ID = os.getenv('SERVER_ID', 'A')  # 'A' or 'B'

# Server settings
HOST = os.getenv('SERVER_HOST', '0.0.0.0')
PORT = int(os.getenv('SERVER_PORT', 8000 if SERVER_ID == 'A' else 8001))
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Server roles and capabilities
SERVER_ROLES = {
    'A': {
        'name': 'Planning Server A',
        'description': 'Fast, always-on planning server for simple networks',
        'max_sites': 20,
        'timeout_seconds': 5,
        'enabled': True
    },
    'B': {
        'name': 'Planning Server B',
        'description': 'High-capacity planning server for complex networks',
        'max_sites': 1000,
        'timeout_seconds': 600,
        'enabled': True
    }
}

SERVER_CONFIG = SERVER_ROLES.get(SERVER_ID, SERVER_ROLES['A'])

# API settings
API_VERSION = 'v1'
API_TIMEOUT = int(os.getenv('API_TIMEOUT', 30))

# Security
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
ENABLE_HTTPS = os.getenv('ENABLE_HTTPS', 'False').lower() == 'true'

# Feedback storage
FEEDBACK_DIR = os.getenv('FEEDBACK_DIR', '/tmp/fiber_feedback')
os.makedirs(FEEDBACK_DIR, exist_ok=True)
