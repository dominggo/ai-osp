# AI-OSP Development Guide for Claude AI

This file contains guidance for AI assistants working on the AI-OSP (AI-Assisted Fiber Network Planning) project.

## Project Overview

AI-OSP is a comprehensive Python-based web application for fiber network planning with:
- React/TypeScript frontend with Leaflet.js mapping
- Flask backend for client orchestration
- Dual FastAPI remote servers (A and B) for AI planning
- Multi-format export capabilities (GeoJSON, KMZ, PDF, Excel, images)
- SPOF analysis and BOM/BOQ generation
- Mandatory feedback system for ML improvement

## Architecture

```
Browser → Flask Client (5000) → FastAPI Server A (8000)
                              ↘ FastAPI Server B (8001)
```

### Key Components

1. **Flask Client** (`client/app.py`)
   - Serves React frontend from `client/static/`
   - Proxies planning requests to remote servers
   - Handles GeoJSON layer management
   - Manages export functionality
   - Coordinates SPOF analysis

2. **React Frontend** (`frontend/src/`)
   - Interactive Leaflet.js map
   - Zustand state management
   - Layer management UI
   - Planning workflow UI
   - Export panel with feedback form

3. **FastAPI Servers** (`server/main.py`)
   - Server A: Fast, simple plans (<20 sites)
   - Server B: Complex plans (up to 1000 sites)
   - `/v1/plan/sync` endpoint for planning requests
   - `/v1/feedback` endpoint for feedback submission

## Current Implementation Status

### ✅ Completed (Phase 1)
- Project structure and directory hierarchy
- Flask app with CORS and health check
- React/Vite/TypeScript configuration
- FastAPI server skeleton with health endpoints
- Environment configuration (.env.example)
- Requirements files (requirements.txt)
- Documentation (PLAN.md, README.md)
- Git configuration (.gitignore, .claudeignore)

### ⏳ Next Phases
- See `PLAN.md` for Phase 2-10 implementation details

## Development Workflow

### Setup New Development Environment

```bash
cd P:/OneDrive/sync/project/12_ai_planning_tools

# 1. Set up client
cd client
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# 2. Set up frontend
cd ../frontend
npm install

# 3. Set up server
cd ../server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
```

### Run During Development

```bash
# Terminal 1: Flask client (serves frontend from static/ in prod)
cd client
source venv/bin/activate
python app.py  # http://localhost:5000

# Terminal 2: React frontend (Vite dev server)
cd frontend
npm run dev  # http://localhost:5173 (proxies /api to Flask)

# Terminal 3: FastAPI Server A
cd server
SERVER_ID=A source venv/bin/activate
python main.py  # http://localhost:8000

# Terminal 4: FastAPI Server B (optional)
cd server
SERVER_ID=B source venv/bin/activate
python main.py  # http://localhost:8001
```

### Build for Production

```bash
# Build React frontend
cd frontend
npm run build
# Output goes to client/static/

# Run Flask in production mode
cd ../client
DEBUG=False python app.py
```

## Code Organization

### Python Backend (`client/` and `server/`)
- **Structure**: Modular, organized by functionality
- **Style**: PEP 8, type hints for all functions
- **Imports**: Use absolute imports from project root
- **Documentation**: Docstrings for all public functions

### React Frontend (`frontend/src/`)
- **Structure**: Component-based, organized by feature
- **Style**: TypeScript strict mode, ESLint enforced
- **State**: Zustand stores in `stores/`
- **API**: Centralized in `services/api.ts`
- **Types**: Shared types in `services/types.ts`

## Critical Files to Understand

| File | Purpose | Status |
|------|---------|--------|
| `client/app.py` | Flask entry point | ✅ Complete |
| `client/config.py` | Configuration management | ✅ Complete |
| `frontend/src/App.tsx` | React root component | 🚧 Partial |
| `frontend/src/components/Map/MapContainer.tsx` | Leaflet map | ⏳ To Do |
| `frontend/src/stores/mapStore.ts` | Map state (Zustand) | ⏳ To Do |
| `server/main.py` | FastAPI entry point | ✅ Complete |
| `server/config.py` | Server configuration | ✅ Complete |
| `server/api/planning.py` | Planning endpoint | ⏳ To Do |
| `server/services/ftth_planner.py` | FTTH algorithm | ⏳ To Do |
| `server/services/p2p_planner.py` | P2P algorithm | ⏳ To Do |

## Common Tasks

### Adding a New API Endpoint

1. **Create endpoint file** in `client/api/` or `server/api/`
   ```python
   from flask import Blueprint, request, jsonify

   bp = Blueprint('my_feature', __name__, url_prefix='/api')

   @bp.route('/my-endpoint', methods=['POST'])
   def my_endpoint():
       data = request.get_json()
       # Process and return
       return jsonify({'result': data})
   ```

2. **Register blueprint** in `app.py`:
   ```python
   from api.my_feature import bp
   app.register_blueprint(bp)
   ```

3. **Update frontend API client** in `services/api.ts`:
   ```typescript
   export const myEndpoint = async (data: any) => {
     return await api.post('/api/my-endpoint', data);
   };
   ```

### Adding React Components

1. **Create component file** in `frontend/src/components/`:
   ```typescript
   interface Props {
     title: string;
     onSubmit: (data: any) => void;
   }

   export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
     return <div>{title}</div>;
   };
   ```

2. **Use Zustand store** if needed:
   ```typescript
   import { useMapStore } from '@/stores/mapStore';

   const { layers, addLayer } = useMapStore();
   ```

### Testing

```bash
# Python tests
cd client
pytest tests/ -v
pytest tests/test_spof_analyzer.py  # Single test

# React tests
cd frontend
npm test
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

## Important Design Principles

### 1. Dual-Server Architecture
- Server A: Always online, handles simple requests (fast response)
- Server B: On-demand, handles complex requests (longer timeout)
- Client should detect complexity and choose appropriately

### 2. State Management
- **Frontend**: Zustand stores for map, planning, export
- **Backend**: Flask session for client state, no persistent server state
- **Remote Servers**: Stateless, accept full requests, return complete responses

### 3. API Contract
- All endpoints return JSON with consistent structure:
  ```json
  {
    "status": "success|error",
    "data": { /* endpoint-specific data */ },
    "error": "optional error message",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

### 4. GeoJSON as Data Format
- All spatial data flows as GeoJSON through the system
- Properties include metadata (type, SPOF tags, planning details)
- Map layers rendered directly from GeoJSON

### 5. Error Handling
- Python: Use HTTPException for API errors
- React: Try-catch around all API calls, show user-friendly errors
- Fallbacks: Always have degraded modes if server unavailable

## Deployment

### Local Deployment
```bash
# Build frontend
cd frontend && npm run build && cd ..

# Run Flask (serves static files)
cd client && python app.py
# Access at http://localhost:5000
```

### Docker Deployment (Future)
```dockerfile
FROM python:3.10
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "client/app.py"]
```

## Testing Strategy

### Unit Tests
- Test individual functions/methods
- Mock external dependencies (requests, database)
- Located in `tests/` directory
- Python: pytest, React: Jest

### Integration Tests
- Test complete workflows (upload GeoJSON → plan → export)
- Test server communication
- Test state management

### E2E Tests (Future)
- Test complete user workflows
- Use Selenium or Playwright
- Test across browsers

## Common Issues

### "ModuleNotFoundError: No module named 'flask'"
**Solution**: Activate virtual environment: `source venv/bin/activate`

### "Cannot find module '@/components'"
**Solution**: Check `frontend/tsconfig.json` has path aliases configured

### "CORS error when calling API"
**Solution**: Ensure Flask has `CORS(app)` and server has CORS middleware

### Port already in use
**Solution**: Kill process: `lsof -ti:5000 | xargs kill -9`

## Performance Tips

1. **Frontend**:
   - Use React DevTools Profiler to find slow renders
   - Lazy load components with React.lazy
   - Memoize expensive computations

2. **Backend**:
   - Use FastAPI async for I/O operations
   - Cache expensive computations
   - Use connection pooling for databases

3. **Map**:
   - Cluster markers for large datasets
   - Use canvas rendering for 1000+ features
   - Implement viewport-based rendering

## Security Checklist

- [ ] Remove DEBUG=True in production
- [ ] Use strong SECRET_KEY (not default)
- [ ] Validate all user inputs
- [ ] Sanitize GeoJSON properties
- [ ] Use HTTPS in production
- [ ] Set proper CORS origins
- [ ] Never commit .env with real values
- [ ] Review dependencies for vulnerabilities

## Documentation Standards

- **Code**: Clear variable names, type hints, docstrings
- **API**: Document all endpoints with examples
- **UI**: Tooltips and help text for complex features
- **Setup**: Clear installation and development instructions

## Next Development Steps

Refer to `PLAN.md` for detailed implementation roadmap:

1. **Phase 2**: GeoJSON Management & Map Editing
2. **Phase 3**: OSM Data Caching
3. **Phase 4**: Remote Server Planning Integration
4. **Phase 5**: AI Planning Implementation
5. **Phase 6**: SPOF Analysis & Tagging
6. **Phase 7**: Feedback System & BOM/BOQ
7. **Phase 8**: Multi-Format Export
8. **Phase 9**: Security & Authentication
9. **Phase 10**: Testing, Docs & Deployment

## Useful Commands

```bash
# Clean up
rm -rf node_modules dist build __pycache__ .pytest_cache

# Reinstall dependencies
pip install --upgrade -r requirements.txt
npm install --legacy-peer-deps

# Format code
black client/ server/  # Python
npm run lint:fix  # TypeScript

# Check for issues
pylint client/ server/
npm run lint

# Update dependencies
pip list --outdated
npm outdated
```

## Contact & Support

- Check PLAN.md for comprehensive implementation details
- Review README.md for project overview
- Check existing code for patterns and conventions
- Test thoroughly before committing changes

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/description

# Make changes, test locally
npm run lint && npm test
pytest tests/

# Commit with clear message
git add .
git commit -m "feat: add new planning endpoint"

# Push and create pull request
git push origin feature/description
```

## Environment Variables Reference

See `.env.example` for all available configuration options.

Key variables:
- `DEBUG`: Enable/disable debug mode
- `SERVER_ID`: Which server configuration to use (A or B)
- `SERVER_TIMEOUT`: Request timeout in seconds
- `CACHE_TTL`: Cache time-to-live in seconds
- `SECRET_KEY`: Session/JWT secret

---

**Last Updated**: 2024-01-19
**Current Phase**: Phase 1 (Project Setup)
**Status**: Repository initialized, basic infrastructure ready for Phase 2 implementation
