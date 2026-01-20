/**
 * Map Store - Manages map state, layers, and GeoJSON data
 * Alpine.js store for centralized map-related state
 */

document.addEventListener('alpine:init', () => {
    Alpine.store('mapStore', {
        layers: [],
        selectedFeatures: [],
        drawnFeatures: [],
        mapInstance: null,
        drawnFeaturesLayer: null,

        /**
         * Add a GeoJSON layer to the map
         */
        addLayer(name, geojson, visible = true) {
            const layerId = `layer_${Date.now()}`;
            const layer = {
                id: layerId,
                name: name,
                geojson: geojson,
                visible: visible,
                leafletLayer: null,
                color: this.generateRandomColor()
            };

            this.layers.push(layer);
            return layerId;
        },

        /**
         * Remove a layer by index
         */
        removeLayer(index) {
            if (this.layers[index] && this.layers[index].leafletLayer) {
                this.mapInstance.removeLayer(this.layers[index].leafletLayer);
            }
            this.layers.splice(index, 1);
        },

        /**
         * Update layer visibility
         */
        updateLayerVisibility(index, visible) {
            const layer = this.layers[index];
            if (layer) {
                layer.visible = visible;
                if (layer.leafletLayer) {
                    if (visible) {
                        this.mapInstance.addLayer(layer.leafletLayer);
                    } else {
                        this.mapInstance.removeLayer(layer.leafletLayer);
                    }
                }
            }
        },

        /**
         * Select a feature on the map
         */
        selectFeature(feature) {
            if (!this.selectedFeatures.find(f => f.id === feature.id)) {
                this.selectedFeatures.push(feature);
            }
        },

        /**
         * Deselect a feature
         */
        deselectFeature(featureId) {
            this.selectedFeatures = this.selectedFeatures.filter(f => f.id !== featureId);
        },

        /**
         * Clear all selections
         */
        clearSelection() {
            this.selectedFeatures = [];
        },

        /**
         * Add a drawn feature (from Leaflet.Draw)
         */
        addDrawnFeature(feature) {
            feature.id = `drawn_${Date.now()}`;
            this.drawnFeatures.push(feature);
            return feature.id;
        },

        /**
         * Remove a drawn feature
         */
        removeDrawnFeature(featureId) {
            this.drawnFeatures = this.drawnFeatures.filter(f => f.id !== featureId);
        },

        /**
         * Generate a random color for layer visualization
         */
        generateRandomColor() {
            const colors = [
                '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        },

        /**
         * Export all layers as GeoJSON
         */
        exportAsGeoJSON() {
            const features = [];

            this.layers.forEach(layer => {
                if (layer.geojson.features) {
                    features.push(...layer.geojson.features);
                }
            });

            this.drawnFeatures.forEach(feature => {
                features.push(feature);
            });

            return {
                type: 'FeatureCollection',
                features: features
            };
        }
    });
});
