// Navigation Utilities
const NavigationUtils = {
    // Redirect to page with multiple fallback methods
    redirectTo: (url, delay = 0) => {
        const redirect = () => {
            console.log(`Redirecting to: ${url}`);
            
            try {
                // Method 1: Standard redirect
                window.location.href = url;
            } catch (error) {
                console.error('Standard redirect failed:', error);
                
                try {
                    // Method 2: Replace current page
                    window.location.replace(url);
                } catch (error2) {
                    console.error('Replace redirect failed:', error2);
                    
                    try {
                        // Method 3: Open in same window
                        window.open(url, '_self');
                    } catch (error3) {
                        console.error('All redirect methods failed:', error3);
                        // Last resort: show alert with manual link
                        alert(`Please navigate manually to: ${url}`);
                    }
                }
            }
        };

        if (delay > 0) {
            setTimeout(redirect, delay);
        } else {
            redirect();
        }
    },

    // Get current page path
    getCurrentPath: () => {
        return window.location.pathname;
    },

    // Check if user is on login page
    isOnLoginPage: () => {
        return window.location.pathname.includes('login.html');
    },

    // Check if user is on register page
    isOnRegisterPage: () => {
        return window.location.pathname.includes('register.html');
    },

    // Get relative path based on current location
    getRelativePath: (targetPage) => {
        // Since all pages are now in the same folder (pages/), 
        // we can use direct filenames
        return targetPage;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationUtils };
}
