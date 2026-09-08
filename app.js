// Todo App - Local Storage Functionality

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todos_app_data';
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.totalTodos = document.getElementById('totalTodos');
        this.activeTodos = document.getElementById('activeTodos');
        this.completedTodos = document.getElementById('completedTodos');
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        // Add todo event
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Clear and delete events
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
    }

    /**
     * Add a new todo item
     */
    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            alert('لطفاً متن را وارد کنید');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleString('tr-TR'),
            dueDate: null
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.todoInput.focus();
        
        this.saveToStorage();
        this.render();
    }

    /**
     * Toggle todo completion status
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Delete a todo item
     */
    deleteTodo(id) {
        if (confirm('Bu görev silinsin mi?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            alert('Tamamlanmış görev yok');
            return;
        }

        if (confirm(`${completedCount} tamamlanmış görev silinecek. Devam et mi?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Delete all todos
     */
    deleteAll() {
        if (this.todos.length === 0) {
            alert('Silinecek görev yok');
            return;
        }

        if (confirm('Tüm görevler silinecek. Bu işlem geri alınamaz. Devam et mi?')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Set current filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    /**
     * Get filtered todos
     */
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        this.totalTodos.textContent = total;
        this.activeTodos.textContent = active;
        this.completedTodos.textContent = completed;
    }

    /**
     * Render todos to DOM
     */
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Clear the list
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            
            filteredTodos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoList.appendChild(todoElement);
            });
        }

        this.updateStats();
    }

    /**
     * Create a todo element
     */
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        dateSpan.textContent = `📅 ${todo.createdAt}`;

        textContainer.appendChild(textSpan);
        textContainer.appendChild(dateSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️ Sil';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        div.appendChild(checkbox);
        div.appendChild(textContainer);
        div.appendChild(deleteBtn);

        return div;
    }

    /**
     * Save todos to local storage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
            console.log('✅ Görevler kaydedildi');
        } catch (error) {
            console.error('❌ Local Storage hatası:', error);
        }
    }

    /**
     * Load todos from local storage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
                console.log('✅ Görevler yüklendi');
            }
        } catch (error) {
            console.error('❌ Local Storage okuma hatası:', error);
            this.todos = [];
        }
    }

    /**
     * Export todos as JSON
     */
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos_${new Date().toISOString()}.json`;
        link.click();
    }

    /**
     * Import todos from JSON file
     */
    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.todos = imported;
                    this.saveToStorage();
                    this.render();
                    alert('✅ Görevler başarıyla içeri aktarıldı');
                }
            } catch (error) {
                alert('❌ Dosya okuma hatası');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
