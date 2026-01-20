/**
 * Export Store - Manages export options, formats, and feedback
 * Alpine.js store for centralized export state
 */

document.addEventListener('alpine:init', () => {
    Alpine.store('exportStore', {
        formats: {
            geojson: true,
            kmz: false,
            pdf: false,
            excel: true,
            image: false
        },
        feedback: {
            rating: 0,
            comments: '',
            submitted: false,
            submittedAt: null
        },
        exportStatus: null, // null, 'exporting', 'success', 'error'
        exportError: null,

        /**
         * Submit feedback for ML model improvement
         */
        submitFeedback() {
            if (this.feedback.rating === 0) {
                this.exportError = 'Please provide a rating';
                return false;
            }

            this.feedback.submitted = true;
            this.feedback.submittedAt = new Date().toISOString();

            // Store locally for syncing if server unavailable
            const feedbackData = {
                timestamp: this.feedback.submittedAt,
                rating: this.feedback.rating,
                comments: this.feedback.comments
            };

            try {
                const storedFeedback = localStorage.getItem('pending_feedback') || '[]';
                const feedbackArray = JSON.parse(storedFeedback);
                feedbackArray.push(feedbackData);
                localStorage.setItem('pending_feedback', JSON.stringify(feedbackArray));
            } catch (e) {
                console.warn('Failed to store feedback locally:', e);
            }

            return true;
        },

        /**
         * Reset feedback
         */
        resetFeedback() {
            this.feedback = {
                rating: 0,
                comments: '',
                submitted: false,
                submittedAt: null
            };
        },

        /**
         * Get selected export formats
         */
        getSelectedFormats() {
            return Object.keys(this.formats).filter(fmt => this.formats[fmt]);
        },

        /**
         * Check if at least one format is selected
         */
        hasSelectedFormats() {
            return this.getSelectedFormats().length > 0;
        },

        /**
         * Set export status
         */
        setStatus(status) {
            this.exportStatus = status;
        },

        /**
         * Set export error
         */
        setError(error) {
            this.exportError = error;
            this.exportStatus = 'error';
        },

        /**
         * Clear export status
         */
        reset() {
            this.exportStatus = null;
            this.exportError = null;
        }
    });
});
