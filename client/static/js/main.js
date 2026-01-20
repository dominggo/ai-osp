/**
 * Main Application Entry Point
 * Initializes Alpine.js app and Leaflet map
 */

function appStore() {
    return {
        // State
        map: Alpine.store('mapStore'),
        planning: Alpine.store('planningStore'),
        export: Alpine.store('exportStore'),

        mapContainer: null,
        connected: false,
        showResults: false,
        canPlan: false,
        serverHealthA: null,
        serverHealthB: null,

        /**
         * Initialize the application
         */
        async init() {
            console.log('Initializing AI-OSP application...');

            // Initialize map
            this.mapContainer = new MapContainer('map');
            Alpine.store('mapStore').mapInstance = this.mapContainer.map;

            // Check server health
            await this.checkServerHealth();

            // Load pending feedback
            this.loadPendingFeedback();

            console.log('AI-OSP initialized successfully');
        },

        /**
         * Check both servers' health
         */
        async checkServerHealth() {
            try {
                // Check Server A
                const responseA = await api.checkServerHealth('a');
                this.serverHealthA = responseA;
                this.connected = responseA.status === 'online';

                // Check Server B
                const responseB = await api.checkServerHealth('b');
                this.serverHealthB = responseB;

                console.log('Server A:', responseA);
                console.log('Server B:', responseB);
            } catch (error) {
                console.error('Error checking server health:', error);
                this.connected = false;
            }
        },

        /**
         * Trigger file upload dialog
         */
        triggerFileUpload() {
            document.getElementById('geojson-upload').click();
        },

        /**
         * Handle GeoJSON file upload
         */
        async handleGeoJSONUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            try {
                // Read file
                const text = await file.text();
                const geojson = JSON.parse(text);

                // Validate GeoJSON
                if (!geojson.features) {
                    alert('Invalid GeoJSON: missing features');
                    return;
                }

                // Add layer
                const layerId = this.map.addLayer(file.name, geojson, true);
                this.mapContainer.addGeoJSONLayer(file.name, geojson, layerId);

                // Update UI
                this.canPlan = this.map.layers.length > 0;
                console.log(`Loaded ${geojson.features.length} features from ${file.name}`);
            } catch (error) {
                alert('Error loading GeoJSON: ' + error.message);
                console.error(error);
            }

            // Reset file input
            event.target.value = '';
        },

        /**
         * Update layer visibility
         */
        updateLayerVisibility(index) {
            const layer = this.map.layers[index];
            if (layer) {
                if (layer.visible) {
                    this.mapContainer.addGeoJSONLayer(layer.name, layer.geojson, layer.id, {
                        color: layer.color
                    });
                } else {
                    this.mapContainer.removeGeoJSONLayer(layer.id);
                }
            }
        },

        /**
         * Remove layer
         */
        removeLayer(index) {
            const layer = this.map.layers[index];
            if (layer) {
                this.mapContainer.removeGeoJSONLayer(layer.id);
            }
            this.map.removeLayer(index);
            this.canPlan = this.map.layers.length > 0;
        },

        /**
         * Clear all selections
         */
        clearSelection() {
            this.map.clearSelection();
            console.log('Selection cleared');
        },

        /**
         * Start planning
         */
        async startPlanning() {
            if (!this.canPlan) {
                alert('Please load at least one GeoJSON layer first');
                return;
            }

            this.planning.setStatus('planning');
            this.planning.setMessage('Sending request to server...');
            this.showResults = true;

            try {
                // Export all layers as GeoJSON
                const geojson = this.map.exportAsGeoJSON();

                // Create planning request
                const request = this.planning.createPlanningRequest(geojson);

                // Submit to server
                const response = await api.submitPlanningRequest(request);

                if (response.success) {
                    this.planning.setResults(response.data);
                    this.planning.setMessage('Planning completed successfully');
                    console.log('Planning results:', response.data);
                } else {
                    this.planning.setError(response.error || 'Unknown error');
                    console.error('Planning error:', response.error);
                }
            } catch (error) {
                this.planning.setError(error.message);
                console.error('Planning request failed:', error);
            }
        },

        /**
         * Analyze SPOF
         */
        async analyzeSPOF() {
            if (!this.planning.results) {
                alert('Run planning first');
                return;
            }

            try {
                const geojson = this.map.exportAsGeoJSON();
                const response = await api.analyzeSPOF(geojson, this.planning.results);

                if (response.success) {
                    // Update results with SPOF analysis
                    this.planning.results.spof = response.data;
                    this.$forceUpdate?.();
                    console.log('SPOF analysis:', response.data);
                } else {
                    alert('SPOF analysis failed: ' + response.error);
                }
            } catch (error) {
                alert('Error analyzing SPOF: ' + error.message);
                console.error(error);
            }
        },

        /**
         * Submit feedback
         */
        async submitFeedback() {
            if (!this.export.submitFeedback()) {
                alert(this.export.exportError);
                return;
            }

            try {
                const response = await api.submitFeedback(
                    this.export.feedback,
                    this.planning.results
                );

                if (response.success) {
                    alert('Feedback submitted' + (response.local ? ' (stored locally)' : '') + '!');
                    console.log('Feedback submitted');
                } else {
                    alert('Error submitting feedback: ' + response.error);
                }
            } catch (error) {
                console.error('Feedback submission error:', error);
            }
        },

        /**
         * Export design in multiple formats
         */
        async exportDesign() {
            if (!this.export.hasSelectedFormats()) {
                alert('Please select at least one export format');
                return;
            }

            this.export.setStatus('exporting');

            try {
                const formats = this.export.getSelectedFormats();
                const geojson = this.map.exportAsGeoJSON();

                const response = await api.exportDesign(
                    formats,
                    geojson,
                    this.planning.results,
                    this.export.feedback
                );

                if (response.success) {
                    // Download file
                    const url = window.URL.createObjectURL(response.data);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `network-design-${new Date().toISOString().split('T')[0]}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();

                    this.export.setStatus('success');
                    alert('Design exported successfully!');
                } else {
                    this.export.setError(response.error);
                }
            } catch (error) {
                this.export.setError(error.message);
                console.error('Export error:', error);
            }
        },

        /**
         * Load pending feedback from localStorage
         */
        loadPendingFeedback() {
            try {
                const pending = JSON.parse(localStorage.getItem('pending_feedback') || '[]');
                if (pending.length > 0) {
                    console.log(`Found ${pending.length} pending feedback entries. Will attempt to sync on next opportunity.`);
                    // Could implement auto-sync here
                }
            } catch (error) {
                console.warn('Error loading pending feedback:', error);
            }
        },

        /**
         * Sync pending feedback to server
         */
        async syncPendingFeedback() {
            try {
                const pending = JSON.parse(localStorage.getItem('pending_feedback') || '[]');
                if (pending.length === 0) return;

                for (const feedback of pending) {
                    try {
                        await api.submitFeedback(feedback, feedback.planning_results || {});
                    } catch (error) {
                        console.warn('Failed to sync feedback:', error);
                    }
                }

                // Clear after sync attempt
                localStorage.removeItem('pending_feedback');
            } catch (error) {
                console.error('Error syncing feedback:', error);
            }
        }
    };
}

// Set up map event handlers
window.onFeatureClick = function(feature) {
    console.log('Feature clicked:', feature);
};

window.onDrawingCreated = function(geojson) {
    console.log('Drawing created:', geojson);
};

window.onDrawingEdited = function(geojson) {
    console.log('Drawing edited:', geojson);
};

window.onDrawingDeleted = function() {
    console.log('Drawing deleted');
};

window.onMapMove = function(bounds) {
    console.log('Map moved to:', bounds);
};

window.onMapRightClick = function(coords) {
    console.log('Right-clicked at:', coords);
};

// Check server health periodically
setInterval(() => {
    const app = document.getElementById('app')?.__x || {};
    if (app.checkServerHealth) {
        app.checkServerHealth();
    }
}, 30000); // Every 30 seconds
