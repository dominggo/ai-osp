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
- **State Management**: Zustand (React)
- **HTTP Client**: Axios

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Mapping**: Leaflet.js with React-Leaflet
- **Package Manager**: npm

### Data & Export
- **GeoJSON Processing**: geojson, shapely
- **Export Formats**: KMZ (simplekml), PDF (reportlab), Excel (openpyxl)
- **Image Processing**: Pillow

## Project Structure

```
ai-osp/
├── client/                  # Flask application
│   ├── app.py              # Flask entry point
│   ├── config.py           # Configuration
│   ├── api/                # API endpoints
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   ├── exporters/          # Export implementations
│   └── static/             # Frontend build output
│
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # FastAPI remote servers
│   ├── main.py            # FastAPI entry point
│   ├── config.py          # Server configuration
│   ├── api/               # API endpoints
│   └── services/          # Planning algorithms
│
├── tests/                 # Test suites
├── docs/                  # Documentation
├── scripts/               # Utility scripts
└── PLAN.md               # Implementation plan
```

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-osp.git
cd ai-osp

# Run setup script
bash scripts/setup.sh

# Or manual setup:

# 1. Set up client
cd client
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 2. Set up frontend
cd frontend
npm install
cd ..

# 3. Set up server
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 4. Configure environment
cp .env.example .env
# Edit .env with appropriate values
```

## Development

### Run All Services

```bash
# Terminal 1: Flask client
cd client
source venv/bin/activate
python app.py
# Runs on http://localhost:5000

# Terminal 2: React frontend
cd frontend
npm run dev
# Runs on http://localhost:5173 (proxies API to Flask)

# Terminal 3: FastAPI Server A
cd server
SERVER_ID=A source venv/bin/activate
python main.py
# Runs on http://localhost:8000

# Terminal 4: FastAPI Server B (optional)
cd server
SERVER_ID=B source venv/bin/activate
python main.py
# Runs on http://localhost:8001
```

### Or Use Development Script

```bash
bash scripts/dev.sh
```

## Testing

```bash
# Python tests
cd client
pytest tests/ -v
cd ../server
pytest tests/ -v

# React tests
cd frontend
npm test
npm test -- --coverage

# All tests
bash scripts/test_all.sh
```

## Building

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Frontend output goes to client/static/

# Start Flask production server
cd ../client
python app.py
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
- **TypeScript**: ESLint, Prettier, Jest tests
- **Commits**: Clear messages, atomic commits
- **Documentation**: Docstrings, API docs, user guides

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
lsof -ti:5000 | xargs kill -9  # Flask
lsof -ti:5173 | xargs kill -9  # Vite
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

### Frontend Build Issues
```bash
# Clean and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
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
