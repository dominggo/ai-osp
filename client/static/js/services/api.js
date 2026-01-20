/**
 * API Service - Centralized HTTP client for API communication
 * Uses Axios for request handling
 */

const API_BASE_URL = '/api';
const SERVER_A_URL = window.location.origin + '/api/server-a';
const SERVER_B_URL = window.location.origin + '/api/server-b';

const api = {
    /**
     * Health check for servers
     */
    async checkServerHealth(serverId = 'a') {
        try {
            const url = serverId === 'b' ? SERVER_B_URL : SERVER_A_URL;
            const response = await axios.get(`${url}/health`, {
                timeout: 5000
            });
            return {
                status: 'online',
                data: response.data
            };
        } catch (error) {
            return {
                status: 'offline',
                error: error.message
            };
        }
    },

    /**
     * Upload GeoJSON file
     */
    async uploadGeoJSON(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name.replace(/\.[^/.]+$/, ''));

            const response = await axios.post(`${API_BASE_URL}/layers/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.message
            };
        }
    },

    /**
     * Get list of uploaded layers
     */
    async getLayers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/layers`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Delete a layer
     */
    async deleteLayer(layerId) {
        try {
            await axios.delete(`${API_BASE_URL}/layers/${layerId}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Submit planning request to appropriate server
     */
    async submitPlanningRequest(request) {
        try {
            const serverId = request.server === 'b' ? 'b' : 'a';
            const serverUrl = serverId === 'b' ? SERVER_B_URL : SERVER_A_URL;

            const response = await axios.post(`${serverUrl}/v1/plan/sync`, request, {
                timeout: serverId === 'b' ? 600000 : 10000 // 10 min for B, 10 sec for A
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: 'Request timeout - planning took too long'
                };
            }
            return {
                success: false,
                error: error.response?.data?.detail || error.message
            };
        }
    },

    /**
     * Submit feedback for model training
     */
    async submitFeedback(feedback, planningResults) {
        try {
            const payload = {
                rating: feedback.rating,
                comments: feedback.comments,
                planning_results: planningResults,
                timestamp: new Date().toISOString()
            };

            const response = await axios.post(`${API_BASE_URL}/feedback`, payload);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            // If server unavailable, store locally
            try {
                const pending = JSON.parse(localStorage.getItem('pending_feedback') || '[]');
                pending.push(payload);
                localStorage.setItem('pending_feedback', JSON.stringify(pending));
                return { success: true, local: true };
            } catch (e) {
                return {
                    success: false,
                    error: 'Failed to submit feedback'
                };
            }
        }
    },

    /**
     * Run SPOF analysis on network design
     */
    async analyzeSPOF(geojson, planningResults) {
        try {
            const response = await axios.post(`${API_BASE_URL}/spof/analyze`, {
                geojson: geojson,
                planning_results: planningResults
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Export design in specified formats
     */
    async exportDesign(formats, geojson, planningResults, feedback) {
        try {
            const response = await axios.post(`${API_BASE_URL}/export`, {
                formats: formats,
                geojson: geojson,
                planning_results: planningResults,
                feedback: feedback
            }, {
                responseType: 'blob'
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Generate BOM/BOQ
     */
    async generateBOM(planningResults) {
        try {
            const response = await axios.post(`${API_BASE_URL}/bom/generate`, {
                planning_results: planningResults
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
