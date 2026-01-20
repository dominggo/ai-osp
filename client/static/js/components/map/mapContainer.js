/**
 * Map Container - Leaflet map initialization and management
 * Handles map setup, layer rendering, and user interactions
 */

class MapContainer {
    constructor(containerId = 'map') {
        this.containerId = containerId;
        this.map = null;
        this.drawnItems = new L.FeatureGroup();
        this.layerControls = new Map();
        this.featureClickHandler = null;

        this.init();
    }

    /**
     * Initialize the Leaflet map
     */
    init() {
        // Create map centered on default location
        this.map = L.map(this.containerId).setView([20, 0], 2);

        // Add OpenStreetMap base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            maxNativeZoom: 18
        }).addTo(this.map);

        // Add drawn items layer
        this.map.addLayer(this.drawnItems);

        // Initialize drawing toolbar
        this.initializeDrawing();

        // Add event listeners
        this.addEventListeners();
    }

    /**
     * Initialize Leaflet.Draw for route drawing
     */
    initializeDrawing() {
        const drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#f357a1',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '5, 5'
                    }
                },
                polygon: {
                    shapeOptions: {
                        color: '#bada55',
                        weight: 4,
                        opacity: 0.7
                    }
                },
                circle: true,
                rectangle: true,
                marker: {
                    icon: L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25, 41],
                        shadowSize: [41, 41],
                        iconAnchor: [12, 41],
                        shadowAnchor: [12, 41],
                        popupAnchor: [1, -34]
                    })
                }
            },
            edit: {
                featureGroup: this.drawnItems,
                remove: true
            }
        });

        this.map.addControl(drawControl);

        // Handle drawing completion
        this.map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            this.drawnItems.addLayer(layer);
            this.handleDrawingCreated(layer);
        });

        this.map.on(L.Draw.Event.EDITED, (e) => {
            e.layers.eachLayer((layer) => {
                this.handleDrawingEdited(layer);
            });
        });

        this.map.on(L.Draw.Event.DELETED, (e) => {
            e.layers.eachLayer((layer) => {
                this.handleDrawingDeleted(layer);
            });
        });
    }

    /**
     * Add a GeoJSON layer to the map
     */
    addGeoJSONLayer(name, geojson, layerId, options = {}) {
        const defaultOptions = {
            color: options.color || '#3388ff',
            weight: options.weight || 2,
            opacity: options.opacity || 0.7,
            fillOpacity: options.fillOpacity || 0.5
        };

        const geoJsonLayer = L.geoJSON(geojson, {
            style: {
                color: defaultOptions.color,
                weight: defaultOptions.weight,
                opacity: defaultOptions.opacity,
                fillOpacity: defaultOptions.fillOpacity
            },
            onEachFeature: (feature, layer) => {
                this.addFeaturePopup(feature, layer);
                layer.on('click', () => this.handleFeatureClick(feature));
            }
        });

        this.map.addLayer(geoJsonLayer);
        this.layerControls.set(layerId, geoJsonLayer);

        return geoJsonLayer;
    }

    /**
     * Remove a layer from the map
     */
    removeGeoJSONLayer(layerId) {
        const layer = this.layerControls.get(layerId);
        if (layer) {
            this.map.removeLayer(layer);
            this.layerControls.delete(layerId);
        }
    }

    /**
     * Add popup to feature
     */
    addFeaturePopup(feature, layer) {
        if (feature.properties) {
            let popupContent = '<div class="feature-popup">';
            popupContent += `<strong>${feature.properties.name || 'Feature'}</strong>`;

            Object.entries(feature.properties).forEach(([key, value]) => {
                if (key !== 'name') {
                    popupContent += `<br><small><strong>${key}:</strong> ${value}</small>`;
                }
            });

            popupContent += '</div>';
            layer.bindPopup(popupContent);
        }
    }

    /**
     * Handle feature click
     */
    handleFeatureClick(feature) {
        if (typeof window.onFeatureClick === 'function') {
            window.onFeatureClick(feature);
        }
    }

    /**
     * Handle drawing creation
     */
    handleDrawingCreated(layer) {
        const geojson = layer.toGeoJSON();
        if (typeof window.onDrawingCreated === 'function') {
            window.onDrawingCreated(geojson);
        }
    }

    /**
     * Handle drawing edit
     */
    handleDrawingEdited(layer) {
        const geojson = layer.toGeoJSON();
        if (typeof window.onDrawingEdited === 'function') {
            window.onDrawingEdited(geojson);
        }
    }

    /**
     * Handle drawing delete
     */
    handleDrawingDeleted(layer) {
        if (typeof window.onDrawingDeleted === 'function') {
            window.onDrawingDeleted();
        }
    }

    /**
     * Add event listeners to the map
     */
    addEventListeners() {
        // Map move/zoom
        this.map.on('moveend', () => {
            const bounds = this.map.getBounds();
            if (typeof window.onMapMove === 'function') {
                window.onMapMove(bounds);
            }
        });

        // Right click for coordinate
        this.map.on('contextmenu', (e) => {
            const { lat, lng } = e.latlng;
            if (typeof window.onMapRightClick === 'function') {
                window.onMapRightClick({ lat, lng });
            }
        });
    }

    /**
     * Get current map bounds
     */
    getBounds() {
        return this.map.getBounds();
    }

    /**
     * Fit map to bounds
     */
    fitBounds(bounds) {
        this.map.fitBounds(bounds);
    }

    /**
     * Set map center and zoom
     */
    setView(center, zoom) {
        this.map.setView(center, zoom);
    }

    /**
     * Get all drawn features as GeoJSON
     */
    getDrawnFeatures() {
        const features = [];
        this.drawnItems.eachLayer((layer) => {
            features.push(layer.toGeoJSON());
        });
        return {
            type: 'FeatureCollection',
            features: features
        };
    }

    /**
     * Clear all drawn features
     */
    clearDrawnFeatures() {
        this.drawnItems.clearLayers();
    }

    /**
     * Add a marker at coordinates
     */
    addMarker(lat, lng, popupText = '') {
        const marker = L.marker([lat, lng]).addTo(this.map);
        if (popupText) {
            marker.bindPopup(popupText);
        }
        return marker;
    }

    /**
     * Add a circle at coordinates
     */
    addCircle(lat, lng, radius, options = {}) {
        const defaultOptions = {
            color: options.color || '#3388ff',
            fillColor: options.fillColor || '#3388ff',
            fillOpacity: options.fillOpacity || 0.2,
            radius: radius
        };
        return L.circle([lat, lng], defaultOptions).addTo(this.map);
    }

    /**
     * Get map instance
     */
    getMap() {
        return this.map;
    }
}
