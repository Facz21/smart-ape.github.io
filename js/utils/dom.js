// DOM Utilities
const DOMUtils = {
    // Get element by ID with error handling
    getElementById: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },

    // Show element
    show: (element) => {
        if (element) element.style.display = 'block';
    },

    // Hide element
    hide: (element) => {
        if (element) element.style.display = 'none';
    },

    // Clear element content
    clear: (element) => {
        if (element) element.innerHTML = '';
    },

    // Set text content safely
    setText: (element, text) => {
        if (element) element.textContent = text;
    },

    // Set HTML content safely
    setHTML: (element, html) => {
        if (element) element.innerHTML = html;
    }
};

// Form Utilities
const FormUtils = {
    // Get form data as object
    getFormData: (form) => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    // Reset form safely
    reset: (form) => {
        if (form && typeof form.reset === 'function') {
            form.reset();
        }
    },

    // Validate required fields
    validateRequired: (data, requiredFields) => {
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return { valid: false, field, message: `${field} is required` };
            }
        }
        return { valid: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOMUtils, FormUtils };
}
