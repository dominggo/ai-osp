# Implementation Plan: AI-Assisted Fiber Planning Client

## Executive Summary
Build a Python-based web application for AI-assisted fiber network planning (FTTH and non-FTTH) with a browser UI, dual remote server architecture, mandatory feedback submission, and multi-format export capabilities.

## Technology Stack

### Client Application
- **Backend Framework**: Flask (Python 3.10+)
  - Lightweight, easy to deploy
  - Built-in development server
  - Simple routing and API structure

- **Frontend Framework**: Alpine.js 3.x + Vanilla JavaScript
  - **Zero build step** - Direct serving from static/ directory
  - **Git pull + restart deployment** - No npm rebuild required
  - **Lightweight** - 165KB total vs 450KB+ for React
  - Alpine.js for reactive UI state management
  - Vanilla JS for Leaflet map integration

- **Map Library**: Leaflet.js (1.9.4) with Leaflet.Draw
  - Open-source, lightweight
  - Excellent GeoJSON support
  - Extensible drawing/editing capabilities
  - Works well with OSM data
  - Direct vanilla JS integration (no wrapper library)

- **State Management**: Alpine.js Stores
  - Lightweight reactive stores (similar to Zustand)
  - Less boilerplate than Redux
  - Perfect for GIS application state
  - Stores: mapStore, planningStore, exportStore

- **HTTP Client**: Axios
  - Promise-based
  - Easy request/response interceptors for auth
  - CDN-loaded for zero npm dependency

### Server Application (A & B)
- **Framework**: FastAPI (Python 3.10+)
  - High performance, async support
  - Automatic API documentation
  - Type hints and validation

- **AI/ML**: TensorFlow/PyTorch (for route planning models)
  - Industry-standard ML frameworks
  - Model serving capabilities

### Data & Export
- **GeoJSON Processing**: geojson, shapely
- **KMZ Export**: simplekml
- **PDF Export**: reportlab
- **Excel Export**: openpyxl
- **Image Export**: Pillow + selenium (for map screenshots)

### Development Tools
- **Build Tool**: None required (direct static file serving)
- **Package Management**: pip + requirements.txt only (no npm)
- **Linting**: pylint/black (Python)
- **Testing**: pytest (Python)
- **Frontend Libraries**: CDN or vendored locally

## Project Structure

```
ai-osp/
├── client/                          # Python Flask application
│   ├── app.py                       # Flask app entry point
│   ├── config.py                    # Configuration management
│   ├── api/                         # Backend API routes
│   │   ├── __init__.py
│   │   ├── server_proxy.py          # Proxy to remote servers A/B
│   │   ├── geojson_handler.py       # GeoJSON CRUD operations
│   │   ├── export_handler.py        # Export format generators
│   │   └── cache_handler.py         # OSM data caching
│   ├── models/                      # Data models
│   │   ├── planning_request.py      # Planning request schema
│   │   ├── feedback.py              # Feedback data schema
│   │   └── export_config.py         # Export configuration
│   ├── services/                    # Business logic
│   │   ├── planning_service.py      # Orchestrates planning requests
│   │   ├── spof_analyzer.py         # SPOF analysis logic
│   │   ├── bom_generator.py         # BOM/BOQ generation
│   │   └── osm_cache.py             # OSM data caching service
│   ├── exporters/                   # Export implementations
│   │   ├── geojson_exporter.py
│   │   ├── kmz_exporter.py
│   │   ├── pdf_exporter.py
│   │   ├── image_exporter.py
│   │   └── excel_exporter.py
│   ├── static/                      # Alpine.js frontend (NO BUILD STEP)
│   │   ├── index.html               # Main application shell
│   │   ├── css/
│   │   │   └── app.css              # Complete responsive styling
│   │   └── js/
│   │       ├── main.js              # Application entry point
│   │       ├── stores/              # Alpine.js stores
│   │       │   ├── mapStore.js      # Map state (layers, selections)
│   │       │   ├── planningStore.js # Planning state (requests, results)
│   │       │   └── exportStore.js   # Export state
│   │       ├── services/
│   │       │   └── api.js           # Axios API client
│   │       └── components/
│   │           └── map/
│   │               └── mapContainer.js # Leaflet map component
│   └── requirements.txt             # Python dependencies
│
├── server/                          # Remote server implementation (A & B)
│   ├── main.py                      # FastAPI app entry point
│   ├── config.py                    # Server configuration (A vs B)
│   ├── api/
│   │   ├── health.py                # GET /health
│   │   ├── planning.py              # POST /v1/plan/sync
│   │   └── feedback.py              # POST /v1/feedback
│   ├── services/
│   │   ├── planner_service.py       # Core planning logic
│   │   ├── ftth_planner.py          # FTTH-specific planning
│   │   ├── p2p_planner.py           # Point-to-point planning
│   │   └── model_loader.py          # ML model management
│   ├── models/
│   │   ├── request_schema.py        # Planning request validation
│   │   └── response_schema.py       # Planning response format
│   └── requirements.txt
│
├── tests/                           # Test suites
│   ├── client/
│   │   ├── test_planning_service.py
│   │   ├── test_spof_analyzer.py
│   │   └── test_exporters.py
│   └── server/
│       ├── test_ftth_planner.py
│       └── test_p2p_planner.py
│
├── docs/                            # Documentation
│   ├── API.md                       # API contract specification
│   ├── DEPLOYMENT.md                # Deployment guide
│   └── USER_GUIDE.md                # End-user documentation
│
├── scripts/                         # Utility scripts
│   ├── setup.sh                     # Initial setup script
│   └── dev.sh                       # Development server launcher
│
├── .env.example                     # Environment variables template
├── .gitignore
├── README.md
└── PLAN.md                          # This file (implementation plan)
```

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure (Week 1)
**Goal**: Establish project structure, development environment, and basic client-server communication with Alpine.js frontend

**Status**: ✅ COMPLETED

**Tasks Completed**:
1. ✅ Initialized project structure
   - Directory hierarchy created
   - Python virtual environment configured
   - Flask application initialized
   - Alpine.js + Vanilla JS frontend created (NO npm required!)

2. ✅ Set up Alpine.js frontend
   - Alpine.js 3.x state stores (mapStore, planningStore, exportStore)
   - Leaflet.js map component (Vanilla JS)
   - Responsive CSS styling
   - Axios API client
   - Direct static file serving (no build step)

3. ✅ Implemented Flask server
   - Flask app with CORS support
   - Static file serving for Alpine.js frontend
   - Health check endpoint
   - Error handling

4. ✅ Created Alpine.js application UI
   - HTML structure with Alpine directives
   - Responsive layout (left/center/right sidebars)
   - Server selection UI
   - Planning configuration panel
   - Layer management
   - Export & feedback forms

5. ✅ Set up FastAPI remote server skeleton
   - FastAPI application created
   - /health endpoint implemented
   - Logging configured
   - CORS enabled

**Critical Files Created**:
- `client/app.py` - Flask entry point
- `client/static/index.html` - Alpine.js app shell (250 lines)
- `client/static/css/app.css` - Responsive styling (600 lines)
- `client/static/js/main.js` - Application entry point (250 lines)
- `client/static/js/stores/mapStore.js` - Map state management
- `client/static/js/stores/planningStore.js` - Planning state
- `client/static/js/stores/exportStore.js` - Export & feedback state
- `client/static/js/services/api.js` - Axios API client (200 lines)
- `client/static/js/components/map/mapContainer.js` - Leaflet map (350 lines)
- `server/main.py` - FastAPI entry point

**Verification** ✅:
- Run `python client/app.py` - Flask server starts on port 5000
- Navigate to `http://localhost:5000` - Alpine.js app displays
- Leaflet map renders at default location
- Alpine.js stores initialize (check browser console)
- No npm or Node.js required!
- Git pull + restart deployment ready
- All files committed to GitHub

**Key Achievement**: **Zero build step** - Clients deploy via simple `git pull` + `systemctl restart` without npm rebuild

---

### Phase 2: GeoJSON Management & Map Editing (Week 2)
**Goal**: Implement GeoJSON layer loading, viewing, and basic editing capabilities

**Tasks**:
1. GeoJSON backend API
   - Create endpoints: POST /api/layers (upload), GET /api/layers (list), DELETE /api/layers/:id
   - Implement file storage/retrieval
   - Add GeoJSON validation

2. Layer management UI
   - Build LayerManager component
   - Implement drag-drop GeoJSON upload
   - Display layer list with visibility toggles
   - Add layer styling controls

3. Site selection functionality
   - Implement click-to-select on map
   - Create coordinate input dialog
   - Implement feature selection from layers
   - Store selections in Zustand store

4. Route editing tools
   - Integrate Leaflet.draw or custom drawing tools
   - Implement snapping to OSM roads
   - Add drawing modes: existing pole, existing ductway, new pole, new ductway
   - Store drawn features in state

**Critical Files**:
- `client/api/geojson_handler.py`
- `frontend/src/components/Map/LayerManager.tsx`
- `frontend/src/components/Map/SiteSelector.tsx`
- `frontend/src/components/Map/DrawingTools.tsx`
- `frontend/src/stores/mapStore.ts`

**Verification**:
- Upload GeoJSON file successfully
- Layers appear on map with correct styling
- Click site selection captures correct coordinates
- Drawing tools create valid GeoJSON features
- Drawn routes snap to visible roads

---

### Phase 3: OSM Data Caching (Week 2)
**Goal**: Implement local OSM data caching to avoid rate limits

**Tasks**:
1. OSM cache service
   - Design cache storage (SQLite or file-based)
   - Implement tile/data download logic
   - Add cache expiration mechanism
   - Create cache management API

2. Cache integration
   - Modify map component to use cached data
   - Add cache status indicator in UI
   - Implement background cache warming
   - Add manual cache refresh option

**Critical Files**:
- `client/services/osm_cache.py`
- `client/api/cache_handler.py`
- `frontend/src/components/Map/MapContainer.tsx` (modify)

**Verification**:
- First load downloads OSM data
- Subsequent loads use cached data
- Cache miss triggers new download
- UI indicates cache status

---

### Phase 4: Remote Server Planning Integration (Week 3)
**Goal**: Implement planning request/response flow with Server A and Server B

**Tasks**:
1. Planning API contract
   - Define request/response schemas (align with SRS)
   - Implement request validation
   - Add authentication (API key/JWT)
   - Set up TLS certificates

2. Server selection UI
   - Build ServerSelector component
   - Add server status indicators (online/offline)
   - Implement latency display
   - Add planning mode selector (FTTH/non-FTTH)

3. Client-side planning orchestration
   - Create planning_service.py to route requests
   - Implement retry logic
   - Add timeout handling
   - Store planning results in state

4. FTTH configuration panel
   - Build FTTHOptions component
   - Implement option selection: FDC+FDP, existing FDC, new ODF, Tie DP
   - Add validation for FTTH parameters
   - Send configuration with planning request

5. Basic planning response display
   - Create PlanningResults component
   - Display proposed routes on map
   - Show route statistics
   - Allow route acceptance/rejection

**Critical Files**:
- `client/api/server_proxy.py`
- `client/services/planning_service.py`
- `frontend/src/components/Planning/ServerSelector.tsx`
- `frontend/src/components/Planning/FTTHOptions.tsx`
- `frontend/src/components/Planning/PlanningResults.tsx`
- `frontend/src/stores/planningStore.ts`
- `server/api/planning.py`
- `server/services/planner_service.py`

**Verification**:
- Select Server A, submit planning request
- Receive response in <5 seconds
- Select Server B, submit complex planning request
- Planning results display on map
- Server offline scenario shows appropriate error

---

### Phase 5: AI Planning Implementation (Server A & B) (Week 4)
**Goal**: Implement core AI planning algorithms for FTTH and non-FTTH networks

**Tasks**:
1. FTTH planning algorithm
   - Implement split-based routing logic
   - Add FDC/FDP placement calculation
   - Implement splitter configuration (1:4, 1:8, 1:32)
   - Calculate fiber counts per segment

2. Non-FTTH P2P planning algorithm
   - Implement direct point-to-point routing
   - Optimize route for distance/cost
   - Handle multiple destination sites

3. ML model integration (placeholder initially)
   - Create model loading infrastructure
   - Implement basic heuristic-based planning
   - Add model versioning
   - Include model_id in responses

4. Server differentiation
   - Configure Server A for fast, simple plans
   - Configure Server B for complex, multi-site plans
   - Implement job complexity detection
   - Add resource management for Server B

**Critical Files**:
- `server/services/ftth_planner.py`
- `server/services/p2p_planner.py`
- `server/services/model_loader.py`
- `server/config.py`

**Verification**:
- FTTH planning returns valid split-based network design
- FDC/FDP locations are logical and optimized
- Non-FTTH returns direct P2P routes
- Server A completes simple plan in <5s
- Server B handles 100+ site complex plan in <10 minutes

---

### Phase 6: SPOF Analysis & Tagging (Week 5)
**Goal**: Implement Single Point of Failure analysis and visualization

**Tasks**:
1. SPOF analysis algorithm
   - Identify single points of failure in network topology
   - Calculate redundancy metrics
   - Tag critical nodes/segments
   - Generate SPOF report

2. SPOF UI components
   - Build SPOFAnalysis component
   - Display SPOF tags on map (color-coded)
   - Show SPOF metrics dashboard
   - Allow manual SPOF tagging

3. SPOF data integration
   - Store SPOF data in GeoJSON properties
   - Include SPOF info in exports
   - Add SPOF filter in layer manager

**Critical Files**:
- `client/services/spof_analyzer.py`
- `frontend/src/components/SPOF/SPOFAnalysis.tsx`
- `frontend/src/components/SPOF/SPOFMetrics.tsx`

**Verification**:
- Run SPOF analysis on network design
- Critical nodes are highlighted on map
- SPOF metrics show percentage of critical segments
- Manual tagging persists correctly

---

### Phase 7: Feedback System & BOM/BOQ Generation (Week 6)
**Goal**: Implement mandatory feedback submission and BOM/BOQ generation

**Tasks**:
1. Feedback form UI
   - Build FeedbackForm component
   - Add rating system (1-5 stars)
   - Include text feedback field
   - Add screenshot/annotation capability

2. Feedback submission flow
   - Create POST /v1/feedback endpoint (server)
   - Implement feedback validation
   - Store feedback for model training
   - Return success/failure status

3. BOM/BOQ generation logic
   - Calculate material quantities from network design
   - Generate itemized bill of materials
   - Calculate labor/equipment costs
   - Format for Excel export

4. Feedback enforcement
   - Disable BOM/BOQ button until feedback submitted
   - Implement local fallback if server unavailable
   - Show submission status in UI
   - Store feedback submission timestamp

**Critical Files**:
- `frontend/src/components/Export/FeedbackForm.tsx`
- `client/services/bom_generator.py`
- `server/api/feedback.py`

**Verification**:
- BOM/BOQ button is disabled before feedback
- Submit feedback, button becomes enabled
- Generate BOM/BOQ successfully
- Disconnect server, local fallback works
- Feedback data stored on server

---

### Phase 8: Multi-Format Export (Week 7)
**Goal**: Implement export functionality for all required formats

**Tasks**:
1. GeoJSON exporter
   - Export all layers with properties
   - Include SPOF tags and planning metadata
   - Validate output format

2. KMZ exporter
   - Convert GeoJSON to KML
   - Add styling and icons
   - Package as KMZ (zipped)

3. PDF exporter
   - Generate map screenshot
   - Add network design summary
   - Include BOM/BOQ table
   - Add metadata (date, planner, server used)

4. Image exporter
   - Capture map view as PNG/JPEG
   - Add legend and scale
   - Include title and timestamp

5. Excel exporter
   - Export BOM/BOQ as Excel workbook
   - Add multiple sheets: Materials, Labor, Summary
   - Format as table with totals

6. Export panel UI
   - Build ExportPanel component
   - Add format selection checkboxes
   - Show export progress
   - Download exported files

**Critical Files**:
- `client/exporters/geojson_exporter.py`
- `client/exporters/kmz_exporter.py`
- `client/exporters/pdf_exporter.py`
- `client/exporters/image_exporter.py`
- `client/exporters/excel_exporter.py`
- `frontend/src/components/Export/ExportPanel.tsx`

**Verification**:
- Export GeoJSON opens correctly in QGIS
- Export KMZ opens in Google Earth
- Export PDF contains map and BOM
- Export Image shows high-quality map
- Export Excel contains formatted BOM/BOQ

---

### Phase 9: Security & Authentication (Week 8)
**Goal**: Implement TLS, API authentication, and data privacy features

**Tasks**:
1. TLS configuration
   - Generate/obtain SSL certificates
   - Configure Flask/FastAPI for HTTPS
   - Enforce HTTPS redirects
   - Test certificate validation

2. API authentication
   - Implement JWT token generation/validation
   - Add API key support as alternative
   - Create authentication middleware
   - Store credentials securely

3. Data minimization
   - Review data sent to servers
   - Remove unnecessary GeoJSON properties
   - Implement data anonymization
   - Add consent UI

4. Security testing
   - Test for common vulnerabilities (XSS, CSRF, SQL injection)
   - Validate input sanitization
   - Test authentication bypass attempts
   - Review dependencies for vulnerabilities

**Critical Files**:
- `client/config.py` (add TLS config)
- `server/config.py` (add TLS config)
- `client/api/server_proxy.py` (add auth headers)
- `server/api/middleware/auth.py` (new file)

**Verification**:
- HTTPS endpoints accessible
- HTTP requests redirect to HTTPS
- Unauthenticated requests return 401
- Invalid tokens rejected
- Data payloads contain minimal information

---

### Phase 10: Testing, Documentation & Deployment (Week 9)
**Goal**: Comprehensive testing, documentation, and deployment preparation

**Tasks**:
1. Unit testing
   - Write pytest tests for all services
   - Write Jest tests for React components
   - Achieve >80% code coverage
   - Set up CI/CD for automated testing

2. Integration testing
   - Test complete planning workflow
   - Test all export formats
   - Test feedback submission flow
   - Test server failover scenarios

3. Documentation
   - Write API.md (API contract specification)
   - Write DEPLOYMENT.md (setup and deployment guide)
   - Write USER_GUIDE.md (end-user documentation)
   - Create CLAUDE.md for future maintenance

4. Deployment packaging
   - Create installation script (setup.sh)
   - Package Python dependencies
   - Build production React bundle
   - Test one-command installation

5. Performance optimization
   - Optimize map rendering performance
   - Minimize bundle size
   - Implement lazy loading
   - Add caching headers

**Critical Files**:
- `tests/` (all test files)
- `docs/API.md`
- `docs/DEPLOYMENT.md`
- `docs/USER_GUIDE.md`
- `CLAUDE.md`
- `scripts/setup.sh`

**Verification**:
- All tests pass
- Fresh install completes successfully
- Application runs on new machine with only Python installed
- All features work end-to-end
- Documentation is clear and complete

---

## Development Commands

### Initial Setup
```bash
# Clone/navigate to project directory
cd P:/OneDrive/sync/project/12_ai_planning_tools

# Python only - NO npm required!

# 1. Set up client
cd client
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Set up server
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with appropriate values
```

### Development

```bash
# Terminal 1: Run Flask backend (from client/)
cd client
source venv/bin/activate
python app.py
# Runs on http://localhost:5000
# Serves Alpine.js frontend from static/ directly - NO BUILD STEP!

# Terminal 2: Run FastAPI Server A (from server/)
cd server
SERVER_ID=A source venv/bin/activate
python main.py
# Runs on http://localhost:8000

# Terminal 3: Run FastAPI Server B (from server/) - optional
cd server
SERVER_ID=B source venv/bin/activate
python main.py
# Runs on http://localhost:8001

# Or use the dev script (will be created):
bash scripts/dev.sh
```

### Development Workflow with Git

```bash
# Edit Alpine.js files in client/static/
# - index.html
# - css/app.css
# - js/*.js files

# No build required - Flask serves files directly!
# Just refresh browser to see changes

# Deploy to production:
git add .
git commit -m "feat: your changes"
git push origin main

# On remote machine (e.g., Proxmox LXC):
ssh root@claude.aku
cd /opt/ai-osp
git pull origin main
systemctl restart fiber-client
# Done! Updates live in seconds
```

### Testing

```bash
# Run Python tests (from client/ or server/)
cd client
pytest tests/ -v
pytest tests/test_spof_analyzer.py  # Single test file

cd ../server
pytest tests/ -v

# Run all tests
bash scripts/test_all.sh  # Will be created
```

### Linting

```bash
# Python linting (from client/ or server/)
pylint client/
black client/  # Auto-format
```

## Key Technical Decisions

### 1. Why Flask instead of Django?
- **Lightweight**: Django is overkill for this application
- **Simplicity**: Flask is easier to understand and deploy
- **Fast development**: Minimal boilerplate for API endpoints
- **Single-file deployment**: Can run from a single script if needed

### 2. Why FastAPI for remote servers?
- **Performance**: Async support for handling concurrent planning requests
- **Validation**: Automatic request/response validation with Pydantic
- **Documentation**: Auto-generated API docs (OpenAPI)
- **Type safety**: Leverages Python type hints

### 3. Why Leaflet.js instead of Mapbox/Google Maps?
- **Open source**: No licensing concerns
- **OSM integration**: Native support for OpenStreetMap
- **Lightweight**: Smaller bundle size
- **Flexibility**: Easy to customize and extend

### 4. Why Alpine.js + Vanilla JS instead of React?
- **Zero build step**: Direct static file serving, no npm rebuild
- **Git pull deployment**: Clients update via simple `git pull && systemctl restart`
- **Lightweight**: 165KB total vs 450KB+ for React
- **Simple state management**: Alpine.js stores (similar to Zustand)
- **Easy frontend updates**: No TypeScript compilation, no bundler complexity
- **Perfect for GIS apps**: Vanilla Leaflet integration without wrapper libraries
- **Python-only deployment**: No Node.js required on client machines
- **Responsive UI**: Alpine.js provides reactive updates without framework overhead

### 5. Client-Server Architecture Design
- **Dual-server approach**: Allows cost optimization (Server A always-on, Server B on-demand)
- **Identical API contract**: Enables seamless switching between servers
- **Client-side orchestration**: Reduces server complexity, enables offline editing
- **Local caching**: Reduces external dependencies and improves performance

## Critical Files Summary

| File | Purpose |
|------|---------|
| `client/app.py` | Flask application entry point, serves Alpine.js frontend |
| `client/static/index.html` | Alpine.js application shell with directives |
| `client/static/css/app.css` | Responsive styling (600+ lines) |
| `client/static/js/main.js` | Application entry point and app logic |
| `client/static/js/stores/mapStore.js` | Map layers and GeoJSON state |
| `client/static/js/stores/planningStore.js` | Planning requests and results state |
| `client/static/js/stores/exportStore.js` | Export formats and feedback state |
| `client/static/js/services/api.js` | Axios API client wrapper |
| `client/static/js/components/map/mapContainer.js` | Leaflet map initialization and management |
| `client/services/planning_service.py` | Orchestrates planning requests to Server A/B |
| `client/services/spof_analyzer.py` | SPOF analysis logic |
| `client/services/bom_generator.py` | BOM/BOQ generation logic |
| `server/main.py` | FastAPI application entry point |
| `server/services/ftth_planner.py` | FTTH planning algorithm |
| `server/services/p2p_planner.py` | Non-FTTH P2P planning algorithm |
| `server/api/planning.py` | POST /v1/plan/sync endpoint |
| `server/api/feedback.py` | POST /v1/feedback endpoint |

## Risk Mitigation

### Risk 1: OSM Rate Limiting
- **Mitigation**: Implement aggressive local caching with SQLite
- **Fallback**: Allow users to manually load OSM data from file

### Risk 2: Server B Unavailable
- **Mitigation**: Always show server status before planning
- **Fallback**: Allow degraded planning with Server A only

### Risk 3: Complex AI Planning Takes Too Long
- **Mitigation**: Show progress indicator with estimated time
- **Fallback**: Allow cancellation and retry with simpler parameters

### Risk 4: Export Failures
- **Mitigation**: Validate data before export, provide detailed error messages
- **Fallback**: Allow partial exports (e.g., skip PDF if image fails)

### Risk 5: Feedback Submission Fails
- **Mitigation**: Store feedback locally and retry
- **Fallback**: Allow BOM/BOQ generation after local storage

## Success Metrics

- **Setup time**: < 5 minutes on fresh Python installation (no Node.js needed!)
- **Frontend load time**: < 1 second (direct static serving)
- **Git pull + restart deployment**: < 30 seconds total
- **Planning request latency**: Server A <5s, Server B <10min
- **Export success rate**: >99% for all formats
- **Code coverage**: >80% for critical services
- **Frontend bundle**: 165KB total (Alpine + Leaflet + CSS + JS)
- **Map performance**: 60 FPS with 100+ GeoJSON features loaded
- **No npm requirement**: Python 3.10+ only on client machines

## Next Steps After Plan Approval

1. Create project structure and initialize Git repository
2. Set up Python virtual environments for client and server
3. Initialize React application with Vite and TypeScript
4. Implement Phase 1 tasks (project setup and core infrastructure)
5. Create CLAUDE.md for future development guidance
