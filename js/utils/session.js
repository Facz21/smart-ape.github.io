// Session Management Utilities
const SessionUtils = {
    // Get current user from localStorage
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    // Set current user in localStorage
    setCurrentUser: (user) => {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        } catch (error) {
            console.error('Error setting current user:', error);
            return false;
        }
    },

    // Remove current user from localStorage
    clearCurrentUser: () => {
        try {
            localStorage.removeItem('currentUser');
            return true;
        } catch (error) {
            console.error('Error clearing current user:', error);
            return false;
        }
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return SessionUtils.getCurrentUser() !== null;
    },

    // Require authentication (redirect to login if not logged in)
    requireAuth: () => {
        if (!SessionUtils.isLoggedIn()) {
            console.log('Authentication required, redirecting to login...');
            NavigationUtils.redirectTo('login.html');
            return false;
        }
        return true;
    },

    // Logout user
    logout: () => {
        SessionUtils.clearCurrentUser();
        NavigationUtils.redirectTo('login.html');
    },

    // Check if already logged in and redirect to main app
    checkAlreadyLoggedIn: () => {
        if (SessionUtils.isLoggedIn() && (NavigationUtils.isOnLoginPage() || NavigationUtils.isOnRegisterPage())) {
            console.log('User already logged in, redirecting to main app...');
            NavigationUtils.redirectTo('app.html');
            return true;
        }
        return false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SessionUtils };
}
