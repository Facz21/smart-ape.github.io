// Message Display Utilities
const MessageUtils = {
    // Show error message
    showError: (message, containerId = 'errorMessage', autoHide = true, duration = 5000) => {
        const errorDiv = DOMUtils.getElementById(containerId);
        if (!errorDiv) {
            console.error(`Error message container '${containerId}' not found`);
            alert(`Error: ${message}`);
            return;
        }

        DOMUtils.setText(errorDiv, message);
        DOMUtils.show(errorDiv);

        if (autoHide) {
            setTimeout(() => {
                DOMUtils.hide(errorDiv);
            }, duration);
        }
    },

    // Show success message
    showSuccess: (message, containerId = 'successMessage', autoHide = false, duration = 5000) => {
        const successDiv = DOMUtils.getElementById(containerId);
        if (!successDiv) {
            console.error(`Success message container '${containerId}' not found`);
            alert(`Success: ${message}`);
            return;
        }

        DOMUtils.setText(successDiv, message);
        DOMUtils.show(successDiv);

        // Hide error messages when showing success
        const errorDiv = DOMUtils.getElementById('errorMessage');
        if (errorDiv) {
            DOMUtils.hide(errorDiv);
        }

        if (autoHide) {
            setTimeout(() => {
                DOMUtils.hide(successDiv);
            }, duration);
        }
    },

    // Show loading state
    showLoading: (show = true, containerId = 'loading') => {
        const loadingDiv = DOMUtils.getElementById(containerId);
        if (loadingDiv) {
            if (show) {
                DOMUtils.show(loadingDiv);
            } else {
                DOMUtils.hide(loadingDiv);
            }
        }
    },

    // Clear all messages
    clearMessages: () => {
        const errorDiv = DOMUtils.getElementById('errorMessage');
        const successDiv = DOMUtils.getElementById('successMessage');
        
        if (errorDiv) DOMUtils.hide(errorDiv);
        if (successDiv) DOMUtils.hide(successDiv);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MessageUtils };
}
