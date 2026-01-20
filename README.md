# AI-Assisted Fiber Network Planning (AI-OSP)

A comprehensive Python-based web application for AI-assisted fiber network planning supporting both FTTH (Fiber-To-The-Home) and non-FTTH architectures with advanced visualization, analysis, and export capabilities.

## Overview

AI-OSP combines a modern web interface with powerful AI planning algorithms to optimize fiber network design. The application features:

- **Dual-Server Architecture**: Server A (fast, simple plans) and Server B (complex, multi-site plans)
- **Advanced GIS Integration**: Leaflet.js-based map with GeoJSON layer management
- **AI Planning Algorithms**: FTTH and P2P network planning with ML optimization
- **SPOF Analysis**: Single Point of Failure identification and visualization
- **Multi-Format Export**: GeoJSON, KMZ, PDF, Excel, and image exports
- **Mandatory Feedback**: Built-in feedback system for continuous model improvement
- **BOM/BOQ Generation**: Automated bill of materials and bill of quantities

## Technology Stack

### Backend
- **Client Application**: Flask (Python 3.10+)
- **Remote Servers**: FastAPI (Python 3.10+)

### Frontend (Zero Build Step!)
- **Framework**: Alpine.js 3.x + Vanilla JavaScript
- **Mapping**: Leaflet.js 1.9.4 (direct vanilla JS integration)
- **Drawing Tools**: Leaflet.Draw 1.0.4
- **State Management**: Alpine.js Stores
- **HTTP Client**: Axios
- **Build Tool**: None required! (direct static file serving)
- **Package Manager**: None needed! (CDN or vendored libraries)

### Key Feature: Zero npm Dependency
- **No Node.js required** on client machines (Python 3.10+ only)
- **Git pull + restart deployment** - no npm rebuild
- **165KB total frontend** vs 450KB+ for React
- **Direct static file serving** from Flask

### Data & Export
- **GeoJSON Processing**: geojson, shapely
- **Export Formats**: KMZ (simplekml), PDF (reportlab), Excel (openpyxl)
- **Image Processing**: Pillow

## Project Structure

```
ai-osp/
├── client/                      # Flask application
│   ├── app.py                  # Flask entry point
│   ├── config.py               # Configuration
│   ├── api/                    # API endpoints
│   ├── models/                 # Data models
│   ├── services/               # Business logic
│   ├── exporters/              # Export implementations
│   └── static/                 # Alpine.js frontend (NO BUILD STEP!)
│       ├── index.html          # Application shell
│       ├── css/app.css         # Responsive styling
│       └── js/
│           ├── main.js         # Application entry
│           ├── stores/         # Alpine.js stores
│           ├── services/       # API client
│           └── components/     # Leaflet map component
│
├── server/                     # FastAPI remote servers
│   ├── main.py                # FastAPI entry point
│   ├── config.py              # Server configuration
│   ├── api/                   # API endpoints
│   └── services/              # Planning algorithms
│
├── tests/                     # Test suites
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
├── PLAN.md                    # Implementation plan
├── README.md                  # This file
└── .env.example              # Configuration template
```

## Installation

### Prerequisites
- **Python 3.10+** (that's it!)
- No Node.js needed
- No npm needed

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/dominggo/ai-osp.git
cd ai-osp

# 1. Set up client
cd client
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 2. Set up server
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 3. Configure environment
cp .env.example .env
# Edit .env with appropriate values
```

### That's it!
No npm install, no build step, no Node.js required. Frontend served directly from Flask.

## Development

### Run All Services

```bash
# Terminal 1: Flask client (serves Alpine.js frontend directly)
cd client
source venv/bin/activate
python app.py
# Runs on http://localhost:5000
# Frontend served from static/ - NO BUILD STEP!

# Terminal 2: FastAPI Server A
cd server
SERVER_ID=A source venv/bin/activate
python main.py
# Runs on http://localhost:8000

# Terminal 3: FastAPI Server B (optional, for complex plans)
cd server
SERVER_ID=B source venv/bin/activate
python main.py
# Runs on http://localhost:8001
```

### Development Workflow

```bash
# Edit Alpine.js files in client/static/
# - index.html
# - css/app.css
# - js/main.js
# - js/stores/*.js
# - js/components/*.js

# No build required! Just refresh browser to see changes
# Flask serves files directly from static/

# Push changes to GitHub
git add .
git commit -m "feat: your changes"
git push origin main

# Deploy to production (Proxmox LXC)
ssh root@claude.aku
cd /opt/ai-osp
git pull origin main
systemctl restart fiber-client
# Done! Updates live in seconds, no npm rebuild
```

### Or Use Development Script

```bash
bash scripts/dev.sh
```

## Testing

```bash
# Python tests (client)
cd client
pytest tests/ -v

# Python tests (server)
cd server
pytest tests/ -v

# All tests
bash scripts/test_all.sh
```

## Deployment

### Production Setup

```bash
# Frontend already in client/static/ - no build needed!

# Start Flask production server
cd client
python app.py
# Runs on http://localhost:5000

# Or via systemd service
systemctl restart fiber-client
```

### Docker Deployment (Optional)

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY client/ .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Flask Client
CLIENT_HOST=0.0.0.0
CLIENT_PORT=5000
DEBUG=False

# Remote Servers
SERVER_A_URL=http://localhost:8000
SERVER_B_URL=http://localhost:8001
SERVER_TIMEOUT=300

# Cache settings
CACHE_TTL=86400  # 24 hours

# Security
SECRET_KEY=your-secret-key-here
ENABLE_HTTPS=False
```

## API Endpoints

### Client (Flask)
- `GET /health` - Health check
- `GET /api/status` - API status
- `POST /api/layers` - Upload GeoJSON layer
- `GET /api/layers` - List layers
- `DELETE /api/layers/:id` - Delete layer

### Server (FastAPI)
- `GET /health` - Health check
- `GET /v1/status` - Server status
- `POST /v1/plan/sync` - Create network plan
- `POST /v1/feedback` - Submit feedback

See [API Documentation](docs/API.md) for detailed specifications.

## Documentation

- [PLAN.md](PLAN.md) - Complete implementation plan
- [docs/API.md](docs/API.md) - API specifications
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) - End-user documentation

## Implementation Phases

See [PLAN.md](PLAN.md) for detailed implementation roadmap:

1. **Phase 1** - Project Setup & Core Infrastructure
2. **Phase 2** - GeoJSON Management & Map Editing
3. **Phase 3** - OSM Data Caching
4. **Phase 4** - Remote Server Planning Integration
5. **Phase 5** - AI Planning Implementation
6. **Phase 6** - SPOF Analysis & Tagging
7. **Phase 7** - Feedback System & BOM/BOQ Generation
8. **Phase 8** - Multi-Format Export
9. **Phase 9** - Security & Authentication
10. **Phase 10** - Testing, Documentation & Deployment

## Architecture

### Dual-Server Design
- **Server A**: Fast, always-on server for simple network plans (<20 sites)
- **Server B**: High-capacity server for complex network plans (up to 1000 sites)

### Client-Server Communication
- Flask client orchestrates requests to remote servers
- Automatic server selection based on plan complexity
- Fallback mechanisms for server unavailability
- Local caching to reduce external dependencies

### Frontend Features
- Real-time map visualization with Leaflet.js
- GeoJSON layer management with styling
- Interactive drawing tools with snapping
- Live server status indicators
- Progress indicators for long-running operations

## Performance Targets

- **Setup time**: < 5 minutes on fresh Python installation
- **Planning latency**: Server A <5s, Server B <10min
- **Export success rate**: >99% for all formats
- **Code coverage**: >80% for critical services
- **Frontend bundle**: <2MB gzipped
- **Map performance**: 60 FPS with 100+ GeoJSON features

## Security

- TLS/HTTPS support
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Data minimization principle
- No credentials stored in frontend

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for security setup.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Development Standards

- **Python**: PEP 8, type hints, pytest coverage
- **JavaScript**: Clean code, ES6+, comments for complex logic
- **Frontend**: Alpine.js conventions, vanilla JS best practices
- **Commits**: Clear messages, atomic commits
- **Documentation**: Docstrings (Python), JSDoc (JS), API docs, user guides

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
lsof -ti:5000 | xargs kill -9  # Flask
lsof -ti:8000 | xargs kill -9  # FastAPI Server A
lsof -ti:8001 | xargs kill -9  # FastAPI Server B
```

### Virtual Environment Issues
```bash
# Recreate venv
rm -rf client/venv server/venv
python -m venv client/venv
python -m venv server/venv
source client/venv/bin/activate
pip install -r client/requirements.txt
```

### Frontend Not Displaying
```bash
# Check Flask is serving static files
# Verify client/static/index.html exists
ls -la client/static/

# Check browser console for errors
# Verify Alpine.js and Leaflet.js load from CDN
```

### Map Not Rendering
```bash
# Check browser console for Leaflet errors
# Verify CDN URLs are accessible
# Check Leaflet CSS is loaded: client/static/css/app.css
```

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- Check [docs/](docs/) directory
- Review [PLAN.md](PLAN.md) for implementation details
- Create an issue on GitHub

## Maintainers

- Claude AI
- Development Team

## Changelog

### v1.0.0 (Initial Release)
- Phase 1-10 implementation complete
- Full FTTH and P2P planning support
- Multi-format export capabilities
- Feedback system integration
- Comprehensive documentation
