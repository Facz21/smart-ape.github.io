// Authentication API Service
const AuthService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await fetch(API_URLS.USERS);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const response = await fetch(API_URLS.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Check if email exists
    emailExists: async (email) => {
        try {
            const users = await AuthService.getAllUsers();
            return users.some(user => user.email.toLowerCase() === email.toLowerCase());
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw error;
        }
    },

    // Validate user credentials
    validateCredentials: async (email, password) => {
        try {
            const users = await AuthService.getAllUsers();
            const user = users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.password === password
            );
            return user || null;
        } catch (error) {
            console.error('Error validating credentials:', error);
            throw error;
        }
    },

    // Generate new user ID
    generateNewUserId: async () => {
        try {
            const users = await AuthService.getAllUsers();
            return users.length > 0 ? 
                Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
        } catch (error) {
            console.error('Error generating user ID:', error);
            return 1;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService };
}
