/**
 * Planning Store - Manages planning requests, server selection, and results
 * Alpine.js store for centralized planning state
 */

document.addEventListener('alpine:init', () => {
    Alpine.store('planningStore', {
        selectedServer: 'a',
        mode: 'ftth',
        status: null, // null, 'planning', 'success', 'error'
        message: '',
        error: null,
        results: null,
        ftth: {
            includeFDC: true,
            includeFDP: true,
            newODF: false,
            splitterRatio: '1:8'
        },
        requestId: null,

        /**
         * Set planning status
         */
        setStatus(status) {
            this.status = status;
        },

        /**
         * Set planning message (for progress updates)
         */
        setMessage(message) {
            this.message = message;
        },

        /**
         * Set planning results
         */
        setResults(results) {
            this.results = results;
            this.status = 'success';
            this.error = null;
        },

        /**
         * Set planning error
         */
        setError(error) {
            this.error = error;
            this.status = 'error';
            this.results = null;
        },

        /**
         * Create a planning request payload
         */
        createPlanningRequest(geojson) {
            const request = {
                mode: this.mode,
                server: this.selectedServer,
                geojson: geojson
            };

            if (this.mode === 'ftth') {
                request.ftth_config = {
                    include_fdc: this.ftth.includeFDC,
                    include_fdp: this.ftth.includeFDP,
                    new_odf: this.ftth.newODF,
                    splitter_ratio: this.ftth.splitterRatio
                };
            }

            return request;
        },

        /**
         * Clear planning state
         */
        reset() {
            this.status = null;
            this.message = '';
            this.error = null;
            this.results = null;
            this.requestId = null;
        }
    });
});
