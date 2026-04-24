// User Login Module
const LoginModule = {
    // Initialize login form
    init: () => {
        console.log('Initializing login module...');
        
        // Check if already logged in
        SessionUtils.checkAlreadyLoggedIn();
        
        // Setup form event listener
        const form = DOMUtils.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', LoginModule.handleSubmit);
        } else {
            console.error('Login form not found');
        }
    },

    // Handle form submission
    handleSubmit: async (event) => {
        event.preventDefault();
        
        console.log('Login form submitted');
        MessageUtils.clearMessages();
        
        try {
            // Get form data
            const form = event.target;
            const formData = FormUtils.getFormData(form);
            
            // Validate form data
            const validation = LoginModule.validateForm(formData);
            if (!validation.valid) {
                MessageUtils.showError(validation.error);
                return;
            }

            // Clean data
            const cleanData = {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            
            // Validate credentials
            const user = await AuthService.validateCredentials(cleanData.email, cleanData.password);
            
            if (user) {
                // Login successful
                await LoginModule.loginUser(user);
            } else {
                MessageUtils.showError('Invalid email or password');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            MessageUtils.showError('Error connecting to server. Please try again.');
        }
    },

    // Validate form data
    validateForm: (data) => {
        // Check required fields
        const requiredFields = ['email', 'password'];
        const requiredValidation = FormUtils.validateRequired(data, requiredFields);
        if (!requiredValidation.valid) {
            return { valid: false, error: `${requiredValidation.field} is required` };
        }

        // Validate email format
        if (!ValidationUtils.isValidEmail(data.email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }

        return { valid: true };
    },

    // Login user (set session and redirect)
    loginUser: async (user) => {
        try {
            // Store user session (without password)
            const sessionUser = {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role || 'user' // Include role, default to 'user' if not set
            };
            
            const sessionSet = SessionUtils.setCurrentUser(sessionUser);
            if (!sessionSet) {
                throw new Error('Failed to store user session');
            }

            console.log('User logged in successfully:', sessionUser);

            // Clear form
            const form = DOMUtils.getElementById('loginForm');
            FormUtils.reset(form);

            // Redirect to main application directly
            NavigationUtils.redirectTo('app.html');

        } catch (error) {
            console.error('Error during login process:', error);
            MessageUtils.showError('Login failed. Please try again.');
        }
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', LoginModule.init);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoginModule };
}
