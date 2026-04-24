/**
 * AhorrADAs - Operations Manager
 * Manages financial operations for users
 */

class OperationsManager {
    constructor() {
        this.operations = [];
        this.currentUser = null;
        this.currentBalance = { ganancias: 0, gastos: 0, total: 0 };
    }

    /**
     * Initialize the operations manager with current user
     */
    init(user) {
        this.currentUser = user;
        this.loadUserOperations();
        this.updateBalance();
        console.log('OperationsManager initialized for user:', user.email);
    }

    /**
     * Load operations for the current user from localStorage
     */
    loadUserOperations() {
        if (!this.currentUser) return;

        const userOperationsKey = `ahorrADAs_operations_${this.currentUser.email}`;
        const savedOperations = localStorage.getItem(userOperationsKey);
        
        if (savedOperations) {
            this.operations = JSON.parse(savedOperations);
        } else {
            this.operations = [];
            this.saveUserOperations();
        }
    }

    /**
     * Save operations for the current user to localStorage
     */
    saveUserOperations() {
        if (!this.currentUser) return;

        const userOperationsKey = `ahorrADAs_operations_${this.currentUser.email}`;
        localStorage.setItem(userOperationsKey, JSON.stringify(this.operations));
    }

    /**
     * Add a new operation
     */
    addOperation(operationData) {
        const operation = {
            id: Date.now(),
            description: operationData.description,
            amount: parseFloat(operationData.amount),
            type: operationData.type,
            category: operationData.category,
            date: operationData.date,
            createdAt: new Date().toISOString()
        };

        this.operations.unshift(operation);
        this.saveUserOperations();
        this.updateBalance();
        
        return operation;
    }

    /**
     * Delete an operation by ID
     */
    deleteOperation(id) {
        this.operations = this.operations.filter(op => op.id !== parseInt(id));
        this.saveUserOperations();
        this.updateBalance();
    }

    /**
     * Get operation by ID
     */
    getOperation(id) {
        return this.operations.find(op => op.id === parseInt(id));
    }

    /**
     * Update balance calculations
     */
    updateBalance() {
        const ganancias = this.operations
            .filter(op => op.type === 'ganancias')
            .reduce((sum, op) => sum + op.amount, 0);
        
        const gastos = this.operations
            .filter(op => op.type === 'gastos')
            .reduce((sum, op) => sum + op.amount, 0);
        
        const total = ganancias - gastos;
        
        this.currentBalance = { ganancias, gastos, total };
        
        // Update UI
        this.updateBalanceUI();
    }

    /**
     * Update balance display in UI
     */
    updateBalanceUI() {
        const ganElement = document.getElementById('ganancias');
        const gastElement = document.getElementById('gastos');
        const totalElement = document.getElementById('totalBalance');

        if (ganElement) ganElement.textContent = `+$${this.currentBalance.ganancias}`;
        if (gastElement) gastElement.textContent = `-$${this.currentBalance.gastos}`;
        if (totalElement) {
            totalElement.textContent = `$${this.currentBalance.total}`;
            totalElement.className = `balance-amount ${this.currentBalance.total >= 0 ? 'positive' : 'negative'}`;
        }
    }

    /**
     * Get filtered operations
     */
    getFilteredOperations(filters = {}) {
        let filtered = [...this.operations];

        if (filters.type && filters.type !== 'todos') {
            filtered = filtered.filter(op => op.type === filters.type);
        }

        if (filters.category && filters.category !== 'todas') {
            filtered = filtered.filter(op => op.category === filters.category);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(op => op.date >= filters.dateFrom);
        }

        if (filters.order) {
            switch (filters.order) {
                case 'recent':
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'oldest':
                    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                    break;
                case 'highest':
                    filtered.sort((a, b) => b.amount - a.amount);
                    break;
                case 'lowest':
                    filtered.sort((a, b) => a.amount - b.amount);
                    break;
            }
        }

        return filtered;
    }

    /**
     * Get all operations
     */
    getAllOperations() {
        return this.operations;
    }

    /**
     * Get current balance
     */
    getCurrentBalance() {
        return this.currentBalance;
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperationsManager;
}
