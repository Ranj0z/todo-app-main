document.addEventListener('DOMContentLoaded', () => {
  const todoList = document.getElementById('todo-list');
  const newTodo = document.getElementById('new-todo');
  const newTodoCheckbox = document.getElementById('new-todo-checkbox');
  const itemsLeft = document.getElementById('items-left');
  const clearCompleted = document.getElementById('clear-completed');
  const themeToggle = document.getElementById('themeToggle');
  const filterAll = document.getElementById('filter-all');
  const filterActive = document.getElementById('filter-active');
  const filterCompleted = document.getElementById('filter-completed');
  const filterButtons = document.querySelectorAll('.filter');

  // Theme toggle using light-mode class and emoji icon
  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '\u263E' : '\u2600'; // ☾ or ☀
    localStorage.setItem('lightMode', document.body.classList.contains('light-mode'));
  }

  // Set initial theme from localStorage
  if (localStorage.getItem('lightMode') === 'true') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '\u263E'; // ☾
  } else {
    themeToggle.textContent = '\u2600'; // ☀
  }

  themeToggle.addEventListener('click', toggleTheme);

  // Items left counter
  function updateItemsLeft() {
    const count = document.querySelectorAll('.todo-item:not(.completed)').length;
    itemsLeft.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
  }

  // Mark completed
  todoList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const item = e.target.closest('.todo-item');
      item.classList.toggle('completed', e.target.checked);
      updateItemsLeft();
    }
  });

  // Clear completed
  clearCompleted.addEventListener('click', () => {
    document.querySelectorAll('.todo-item.completed').forEach(item => item.remove());
    updateItemsLeft();
  });

  // Add new todo
  newTodo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && newTodo.value.trim()) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      // Set checked attribute based on create-new checkbox
      const checked = newTodoCheckbox.checked ? 'checked' : '';
      li.innerHTML = `
        <input type="checkbox" ${checked} />
        <span>${newTodo.value.trim()}</span>
        <button class="delete-button" aria-label="Delete"></button>
      `;
      // If checked, also add the completed class
      if (newTodoCheckbox.checked) {
        li.classList.add('completed');
      }
      todoList.appendChild(li);
      newTodo.value = '';
      newTodoCheckbox.checked = false; // Optionally reset the create-new checkbox
      updateItemsLeft();
      makeItemsDraggable(); // Make new item draggable
    }
  });

  // Delete todo
  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
      const item = e.target.closest('.todo-item');
      if (item) {
        item.remove();
        updateItemsLeft();
      }
    }
  });

  // Filter functionality
  function setFilter(filter) {
    // Remove 'active' class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Show/hide todos based on filter
    document.querySelectorAll('.todo-item').forEach(item => {
      const checked = item.querySelector('input[type="checkbox"]').checked;
      if (filter === 'all') {
        item.style.display = '';
        filterAll.classList.add('active');
      } else if (filter === 'active') {
        item.style.display = checked ? 'none' : '';
        filterActive.classList.add('active');
      } else if (filter === 'completed') {
        item.style.display = checked ? '' : 'none';
        filterCompleted.classList.add('active');
      }
    });
  }

  // Event listeners for filter buttons
  filterAll.addEventListener('click', () => setFilter('all'));
  filterActive.addEventListener('click', () => setFilter('active'));
  filterCompleted.addEventListener('click', () => setFilter('completed'));

  // Drag and Drop functionality
  let draggedItem = null;

  todoList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('todo-item')) {
      draggedItem = e.target;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    }
  });

  todoList.addEventListener('dragend', (e) => {
    if (draggedItem) {
      draggedItem.style.display = '';
      draggedItem = null;
    }
  });

  todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    if (afterElement == null) {
      todoList.appendChild(draggedItem);
    } else {
      todoList.insertBefore(draggedItem, afterElement);
    }
  });

  // Make todo items draggable
  function makeItemsDraggable() {
    document.querySelectorAll('.todo-item').forEach(item => {
      item.setAttribute('draggable', 'true');
    });
  }

  // Helper to find the element after which to insert
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not([style*="display: none"])')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: -Infinity }).element;
  }

  // Call this once on page load
  makeItemsDraggable();

  updateItemsLeft();
});
