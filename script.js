document.addEventListener('DOMContentLoaded', () => {
  const todoList = document.getElementById('todo-list');
  const newTodo = document.getElementById('new-todo');
  const itemsLeft = document.getElementById('items-left');
  const clearCompleted = document.getElementById('clear-completed');
  const themeToggle = document.getElementById('themeToggle');

  function updateItemsLeft() {
    const count = document.querySelectorAll('.todo-item:not(.completed)').length;
    itemsLeft.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
  }

  todoList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const item = e.target.closest('.todo-item');
      item.classList.toggle('completed', e.target.checked);
      updateItemsLeft();
    }
  });

  clearCompleted.addEventListener('click', () => {
    document.querySelectorAll('.todo-item.completed').forEach(item => item.remove());
    updateItemsLeft();
  });

  newTodo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && newTodo.value.trim()) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.innerHTML = `<input type="checkbox" /> <span>${newTodo.value.trim()}</span>`;
      todoList.appendChild(li);
      newTodo.value = '';
      updateItemsLeft();
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '\u263E' : '\u2600'; // ☾ or ☀
  });

  updateItemsLeft();
});
