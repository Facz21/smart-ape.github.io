// Validation Utilities
const ValidationUtils = {
    // Email validation
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation
    validatePassword: (password) => {
        const errors = [];
        
        if (!password || password.trim() === '') {
            errors.push('Password is required');
            return { valid: false, errors };
        }

        if (password !== password.trim()) {
            errors.push('Password cannot contain leading or trailing spaces');
        }

        if (password.includes(' ')) {
            errors.push('Password cannot contain spaces');
        }

        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    // Password confirmation validation
    validatePasswordConfirmation: (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return { valid: false, error: 'Passwords do not match' };
        }
        return { valid: true };
    },

    // Full name validation
    validateFullName: (fullName) => {
        if (!fullName || fullName.trim() === '') {
            return { valid: false, error: 'Full name is required' };
        }
        if (fullName.trim().length < 2) {
            return { valid: false, error: 'Full name must be at least 2 characters long' };
        }
        return { valid: true };
    },

    // Generic field validation
    validateField: (value, fieldName, options = {}) => {
        const { required = true, minLength = 0, maxLength = Infinity } = options;
        
        if (required && (!value || value.trim() === '')) {
            return { valid: false, error: `${fieldName} is required` };
        }

        if (value && value.length < minLength) {
            return { valid: false, error: `${fieldName} must be at least ${minLength} characters long` };
        }

        if (value && value.length > maxLength) {
            return { valid: false, error: `${fieldName} must be no more than ${maxLength} characters long` };
        }

        return { valid: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ValidationUtils };
}
