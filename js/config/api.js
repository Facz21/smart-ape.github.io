// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: {
        USERS: '/users',
        PRODUCTS: '/productos'
    },
    TIMEOUT: 10000
};

// Full API URLs
const API_URLS = {
    USERS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
    PRODUCTS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, API_URLS };
}
