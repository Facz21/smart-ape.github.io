/**
 * AhorrADAs - Categories Manager
 * Manages user categories for financial operations
 */

class CategoriesManager {
    constructor(operationsManager = null) {
        this.categories = [];
        this.currentUser = null;
        this.operationsManager = operationsManager;
        this.defaultCategories = [
            { name: 'trabajo', icon: '💼', color: '#ffd93d' },
            { name: 'comida', icon: '🍽️', color: '#ffb700' },
            { name: 'entretenimiento', icon: '🎬', color: '#ffe066' },
            { name: 'transporte', icon: '🚗', color: '#fff6d9' },
            { name: 'salud', icon: '🏥', color: '#ffd93d' },
            { name: 'educación', icon: '📚', color: '#ffb700' }
        ];
    }

    /**
     * Set the operations manager reference
     */
    setOperationsManager(operationsManager) {
        this.operationsManager = operationsManager;
    }

    /**
     * Initialize the categories manager with current user
     */
    init(user) {
        this.currentUser = user;
        this.loadUserCategories();
        console.log('CategoriesManager initialized for user:', user.email);
    }

    /**
     * Load categories for the current user from localStorage
     */
    loadUserCategories() {
        if (!this.currentUser) return;

        const userCategoriesKey = `ahorrADAs_categories_${this.currentUser.email}`;
        const savedCategories = localStorage.getItem(userCategoriesKey);
        
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        } else {
            // Initialize with default categories for new users
            this.categories = this.defaultCategories.map((cat, index) => ({
                id: Date.now() + index,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                createdAt: new Date().toISOString()
            }));
            this.saveUserCategories();
        }
    }

    /**
     * Save categories for the current user to localStorage
     */
    saveUserCategories() {
        if (!this.currentUser) return;

        const userCategoriesKey = `ahorrADAs_categories_${this.currentUser.email}`;
        localStorage.setItem(userCategoriesKey, JSON.stringify(this.categories));
    }

    /**
     * Add a new category
     */
    addCategory(categoryData) {
        const category = {
            id: Date.now(),
            name: categoryData.name.toLowerCase(),
            icon: categoryData.icon || '📁',
            color: categoryData.color || '#4fd1c7',
            createdAt: new Date().toISOString()
        };

        // Check if category already exists
        if (this.categories.find(cat => cat.name === category.name)) {
            throw new Error('La categoría ya existe');
        }

        this.categories.push(category);
        this.saveUserCategories();
        
        return category;
    }

    /**
     * Delete a category by ID
     */
    deleteCategory(id) {
        const categoryIndex = this.categories.findIndex(cat => cat.id === parseInt(id));
        if (categoryIndex === -1) {
            throw new Error('Categoría no encontrada');
        }

        const categoryName = this.categories[categoryIndex].name;

        // Delete all operations associated with this category
        if (this.operationsManager) {
            const operations = this.operationsManager.getAllOperations();
            const operationsToDelete = operations.filter(op => op.category === categoryName);
            
            operationsToDelete.forEach(operation => {
                this.operationsManager.deleteOperation(operation.id);
            });

            console.log(`Se eliminaron ${operationsToDelete.length} operaciones asociadas a la categoría "${categoryName}"`);
        }

        this.categories.splice(categoryIndex, 1);
        this.saveUserCategories();
        
        return {
            success: true,
            message: `Categoría "${categoryName}" eliminada exitosamente`,
            deletedOperations: this.operationsManager ? operationsToDelete.length : 0
        };
    }

    /**
     * Update a category
     */
    updateCategory(id, updateData) {
        const category = this.categories.find(cat => cat.id === parseInt(id));
        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        if (updateData.name) {
            updateData.name = updateData.name.toLowerCase();
            // Check if new name already exists (excluding current category)
            const existingCategory = this.categories.find(cat => cat.name === updateData.name && cat.id !== parseInt(id));
            if (existingCategory) {
                throw new Error('Ya existe una categoría con ese nombre');
            }
        }

        Object.assign(category, updateData);
        this.saveUserCategories();
        
        return category;
    }

    /**
     * Get category by ID
     */
    getCategory(id) {
        return this.categories.find(cat => cat.id === parseInt(id));
    }

    /**
     * Get category by name
     */
    getCategoryByName(name) {
        return this.categories.find(cat => cat.name === name.toLowerCase());
    }

    /**
     * Get all categories
     */
    getAllCategories() {
        return this.categories;
    }

    /**
     * Get categories for select options
     */
    getCategoriesForSelect() {
        return this.categories.map(cat => ({
            value: cat.name,
            text: `${cat.icon} ${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}`,
            color: cat.color
        }));
    }

    /**
     * Update category selects in the UI
     */
    updateCategorySelects() {
        const selects = document.querySelectorAll('select[name="category"], #categoryFilter, #operationCategory');
        const categories = this.getCategoriesForSelect();
        
        selects.forEach(select => {
            const currentValue = select.value;
            
            // Clear existing options (except "Todas" for filters)
            if (select.id === 'categoryFilter') {
                select.innerHTML = '<option value="todas">Todas</option>';
            } else {
                select.innerHTML = '';
            }
            
            // Add category options
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.value;
                option.textContent = cat.text;
                option.style.color = cat.color;
                select.appendChild(option);
            });
            
            // Restore previous value if it exists
            if (currentValue && categories.find(cat => cat.value === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    /**
     * Show categories management modal
     */
    showCategoriesModal() {
        const modal = document.getElementById('categoriesModal');
        if (modal) {
            modal.style.display = 'flex';
            this.renderCategoriesList();
        }
    }

    /**
     * Hide categories management modal
     */
    hideCategoriesModal() {
        const modal = document.getElementById('categoriesModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Render categories list in the modal
     */
    renderCategoriesList() {
        const container = document.getElementById('categoriesListContainer');
        if (!container) return;

        container.innerHTML = this.categories.map(category => `
            <div class="category-item" data-id="${category.id}">
                <div class="category-info">
                    <span class="category-icon" style="color: ${category.color}">${category.icon}</span>
                    <span class="category-name">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                </div>
                <div class="category-actions">
                    
                    <button class="btn-delete-category" onclick="categoriesManager.deleteCategoryConfirm(${category.id})" title="Eliminar">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render categories grid in the main categories section
     */
    renderCategoriesGrid() {
        const container = document.getElementById('categoriesGrid');
        if (!container) return;

        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="empty-categories">
                    <div class="empty-illustration">
                        <span style="font-size: 48px;">🏷️</span>
                    </div>
                    <h3>No hay categorías</h3>
                    <p>Crea tu primera categoría para organizar tus operaciones</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.categories.map(category => `
            <div class="category-card" data-id="${category.id}">
                <div class="category-card-header">
                    <span class="category-icon" style="color: ${category.color}; font-size: 24px;">${category.icon}</span>
                    <div class="category-actions">
                        <button class="btn-edit-category" onclick="categoriesManager.editCategory(${category.id})" title="Editar">✏️</button>
                        <button class="btn-delete-category" onclick="categoriesManager.deleteCategoryConfirm(${category.id})" title="Eliminar">🗑️</button>
                    </div>
                </div>
                <div class="category-card-body">
                    <h4 class="category-name">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h4>
                    <div class="category-stats">
                        <span class="operations-count">${this.getCategoryOperationsCount(category.name)} operación(es)</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Get the number of operations for a category
     */
    getCategoryOperationsCount(categoryName) {
        if (!this.operationsManager) return 0;
        const operations = this.operationsManager.getAllOperations();
        return operations.filter(op => op.category === categoryName).length;
    }

    /**
     * Render simple categories list (matching Smart APE design)
     */
    renderSimpleCategoriesList() {
        const container = document.getElementById('simpleCategoriesList');
        if (!container) return;

        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="categories-empty-state">
                    <h3>🏷️ Sin categorías</h3>
                    <p>Agrega tu primera categoría para organizar mejor tus operaciones financieras</p>
                </div>
            `;
            return;
        }

        // Calculate stats for each category if operations manager is available
        const categoryStats = {};
        if (this.operationsManager) {
            const operations = this.operationsManager.getAllOperations();
            operations.forEach(op => {
                if (!categoryStats[op.category]) {
                    categoryStats[op.category] = { count: 0, totalAmount: 0 };
                }
                categoryStats[op.category].count++;
                categoryStats[op.category].totalAmount += parseFloat(op.amount);
            });
        }

        container.innerHTML = this.categories.map(category => {
            const stats = categoryStats[category.name] || { count: 0, totalAmount: 0 };
            return `
                <div class="simple-category-item" data-id="${category.id}">
                    <div class="simple-category-header">
                        <div style="display: flex; align-items: center;">
                            <span class="simple-category-icon">${category.icon}</span>
                            <span class="simple-category-name">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                        </div>
                    </div>
                    <div class="simple-category-stats">
                        <div>📊 ${stats.count} operación${stats.count !== 1 ? 'es' : ''}</div>
                        <div>💰 $${stats.totalAmount.toFixed(2)} total</div>
                    </div>
                    <div class="simple-category-actions">
                        <button class="btn-edit-simple" onclick="categoriesManager.editSimpleCategory('${category.name}')">✏️ Editar</button>
                        <button class="btn-delete-simple" onclick="categoriesManager.deleteSimpleCategory(${category.id})">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Add a simple category (just name, auto-assigns icon and color)
     */
    addSimpleCategory() {
        const input = document.getElementById('simpleCategoryName');
        if (!input) return;

        const categoryName = input.value.trim();
        if (!categoryName) {
            alert('Por favor ingresa un nombre para la categoría');
            return;
        }

        try {
            // Auto-assign icon and color
            const defaultIcons = ['📁', '💰', '🏠', '🎯', '⭐', '📋', '🔧', '💡'];
            const defaultColors = ['#4fd1c7', '#f56565', '#9f7aea', '#38b2ac', '#48bb78', '#ed8936', '#667eea', '#f093fb'];
            
            const categoryData = {
                name: categoryName.toLowerCase(),
                icon: defaultIcons[this.categories.length % defaultIcons.length],
                color: defaultColors[this.categories.length % defaultColors.length]
            };

            this.addCategory(categoryData);
            this.renderSimpleCategoriesList();
            this.updateCategorySelects();
            
            // Clear input
            input.value = '';
            
            console.log('Categoría agregada exitosamente');
            
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Edit simple category (just changes name)
     */
    editSimpleCategory(currentName) {
        const newName = prompt('Nuevo nombre para la categoría:', currentName);
        if (!newName || newName.trim() === '') return;
        
        if (newName.toLowerCase() === currentName.toLowerCase()) return;

        try {
            const category = this.getCategoryByName(currentName);
            if (!category) {
                alert('Categoría no encontrada');
                return;
            }

            this.updateCategory(category.id, { name: newName.trim() });
            this.renderSimpleCategoriesList();
            this.updateCategorySelects();
            
            console.log('Categoría editada exitosamente');
            
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Delete simple category with confirmation
     */
    deleteSimpleCategory(categoryId) {
        const category = this.getCategory(categoryId);
        if (!category) return;

        // Count operations that will be deleted
        let operationsCount = 0;
        if (this.operationsManager) {
            const operations = this.operationsManager.getAllOperations();
            operationsCount = operations.filter(op => op.category === category.name).length;
        }

        let confirmMessage = `¿Estás seguro que quieres eliminar la categoría "${category.name}"?`;
        if (operationsCount > 0) {
            confirmMessage += `\n\nEsto también eliminará ${operationsCount} operación(es) asociada(s) a esta categoría.`;
        }

        if (confirm(confirmMessage)) {
            try {
                const result = this.deleteCategory(categoryId);
                this.renderSimpleCategoriesList();
                this.updateCategorySelects();
                
                // Update operations display if available
                if (this.operationsManager && typeof this.operationsManager.renderOperations === 'function') {
                    this.operationsManager.renderOperations();
                }
                
                console.log('Categoría eliminada exitosamente');
                
            } catch (error) {
                alert(error.message);
            }
        }
    }

    /**
     * Show add category form
     */
    showAddCategoryForm() {
        const form = document.getElementById('addCategoryForm');
        const title = document.getElementById('categoryFormTitle');
        
        if (form && title) {
            title.textContent = 'Nueva Categoría';
            form.reset();
            form.style.display = 'block';
            
            // Focus on name input
            const nameInput = document.getElementById('categoryName');
            if (nameInput) nameInput.focus();
        }
    }

    /**
     * Hide add category form
     */
    hideAddCategoryForm() {
        const form = document.getElementById('addCategoryForm');
        if (form) {
            form.style.display = 'none';
            form.reset();
        }
    }

    /**
     * Handle add/edit category form submission
     */
    handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const categoryData = {
            name: formData.get('name').trim(),
            icon: formData.get('icon').trim() || '📁',
            color: formData.get('color') || '#4fd1c7'
        };

        try {
            const categoryId = e.target.dataset.editId;
            
            if (categoryId) {
                // Edit existing category
                this.updateCategory(categoryId, categoryData);
            } else {
                // Add new category
                this.addCategory(categoryData);
            }
            
            this.renderCategoriesList();
            this.renderCategoriesGrid();
            this.updateCategorySelects();
            this.hideAddCategoryForm();
            
            // Show success message
            this.showMessage('Categoría guardada exitosamente', 'success');
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    /**
     * Edit category
     */
    editCategory(id) {
        const category = this.getCategory(id);
        if (!category) return;

        const form = document.getElementById('addCategoryForm');
        const title = document.getElementById('categoryFormTitle');
        
        if (form && title) {
            title.textContent = 'Editar Categoría';
            form.dataset.editId = id;
            
            // Fill form with category data
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryIcon').value = category.icon;
            document.getElementById('categoryColor').value = category.color;
            
            form.style.display = 'block';
        }
    }

    /**
     * Confirm category deletion
     */
    deleteCategoryConfirm(id) {
        const category = this.getCategory(id);
        if (!category) return;

        // Count operations that will be deleted
        let operationsCount = 0;
        if (this.operationsManager) {
            const operations = this.operationsManager.getAllOperations();
            operationsCount = operations.filter(op => op.category === category.name).length;
        }

        let confirmMessage = `¿Estás seguro que quieres eliminar la categoría "${category.name}"?`;
        if (operationsCount > 0) {
            confirmMessage += `\n\nEsto también eliminará ${operationsCount} operación(es) asociada(s) a esta categoría.`;
        }

        if (confirm(confirmMessage)) {
            try {
                const result = this.deleteCategory(id);
                this.renderCategoriesList();
                this.renderCategoriesGrid();
                this.updateCategorySelects();
                
                let message = result.message;
                if (result.deletedOperations > 0) {
                    message += ` y ${result.deletedOperations} operación(es) asociada(s)`;
                }
                
                this.showMessage(message, 'success');
                
                // Update operations display if available
                if (this.operationsManager && typeof this.operationsManager.renderOperations === 'function') {
                    this.operationsManager.renderOperations();
                }
                
            } catch (error) {
                this.showMessage(error.message, 'error');
            }
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type) {
        // You can implement a toast notification system here
        if (type === 'error') {
            alert(message);
        } else {
            console.log(message);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoriesManager;
}
