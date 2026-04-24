// User Registration Module
const RegisterModule = {
    // Initialize registration form
    init: () => {
        console.log('Initializing registration module...');
        
        // Check if already logged in
        SessionUtils.checkAlreadyLoggedIn();
        
        // Setup form event listener
        const form = DOMUtils.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', RegisterModule.handleSubmit);
        } else {
            console.error('Registration form not found');
        }
    },

    // Handle form submission
    handleSubmit: async (event) => {
        event.preventDefault();
        
        console.log('Registration form submitted');
        MessageUtils.clearMessages();
        
        try {
            // Get form data
            const form = event.target;
            const formData = FormUtils.getFormData(form);
            
            // Validate form data
            const validation = RegisterModule.validateForm(formData);
            if (!validation.valid) {
                MessageUtils.showError(validation.error);
                return;
            }

            // Clean and normalize data
            const cleanData = RegisterModule.cleanFormData(formData);
            
            // Check if email already exists
            const emailExists = await AuthService.emailExists(cleanData.email);
            if (emailExists) {
                MessageUtils.showError('Email already registered');
                return;
            }

            // Create user
            await RegisterModule.createUser(cleanData);
            
        } catch (error) {
            console.error('Registration error:', error);
            MessageUtils.showError('Error connecting to server. Please try again.');
        }
    },

    // Validate form data
    validateForm: (data) => {
        // Check required fields
        const requiredFields = ['fullName', 'email', 'password', 'confirmPassword'];
        const requiredValidation = FormUtils.validateRequired(data, requiredFields);
        if (!requiredValidation.valid) {
            return { valid: false, error: `${requiredValidation.field} is required` };
        }

        // Validate full name
        const nameValidation = ValidationUtils.validateFullName(data.fullName);
        if (!nameValidation.valid) {
            return nameValidation;
        }

        // Validate email
        if (!ValidationUtils.isValidEmail(data.email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }

        // Validate password
        const passwordValidation = ValidationUtils.validatePassword(data.password);
        if (!passwordValidation.valid) {
            return { valid: false, error: passwordValidation.errors[0] };
        }

        // Validate password confirmation
        const confirmValidation = ValidationUtils.validatePasswordConfirmation(
            data.password, 
            data.confirmPassword
        );
        if (!confirmValidation.valid) {
            return confirmValidation;
        }

        return { valid: true };
    },

    // Clean and normalize form data
    cleanFormData: (data) => {
        return {
            fullName: data.fullName.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
            confirmPassword: data.confirmPassword
        };
    },

    // Create new user
    createUser: async (userData) => {
        try {
            // Generate new user ID
            const newId = await AuthService.generateNewUserId();
            
            // Create user object
            const newUser = {
                id: newId.toString(),
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                role: 'user', // Default role for new users
                createdAt: new Date().toISOString()
            };

            // Save user to API
            const createdUser = await AuthService.createUser(newUser);
            console.log('User created successfully:', createdUser);

            // Clear form
            const form = DOMUtils.getElementById('registerForm');
            FormUtils.reset(form);

            // Redirect to login page directly
            NavigationUtils.redirectTo('login.html');

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', RegisterModule.init);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RegisterModule };
}
