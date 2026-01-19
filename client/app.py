"""Flask application for AI-assisted fiber network planning."""
import os
import logging
from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        """Health check endpoint."""
        return jsonify({
            'status': 'healthy',
            'service': 'fiber-planning-client',
            'version': '1.0.0'
        }), 200

    # API endpoints
    @app.route('/api/status', methods=['GET'])
    def api_status():
        """Get API status."""
        return jsonify({
            'status': 'operational',
            'timestamp': __import__('datetime').datetime.utcnow().isoformat()
        }), 200

    # Serve static frontend files in production
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve React frontend files."""
        static_dir = Path(__file__).parent / 'static'

        if path and (static_dir / path).exists():
            return send_from_directory(static_dir, path)

        index_file = static_dir / 'index.html'
        if index_file.exists():
            return send_from_directory(static_dir, 'index.html')

        return jsonify({'error': 'Frontend not built. Run: cd frontend && npm run build'}), 404

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors."""
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors."""
        logger.error(f'Internal error: {error}')
        return jsonify({'error': 'Internal server error'}), 500

    logger.info('Flask application created successfully')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
