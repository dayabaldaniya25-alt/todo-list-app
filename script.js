const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

const STORAGE_KEY = 'todo-list-items';
let currentFilter = 'all';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one to get started! 🚀</li>';
  } else {
    taskList.innerHTML = filteredTasks
      .map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="task-main">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
          </div>
          <div class="task-actions">
            <button class="delete-btn" aria-label="Delete task">Delete</button>
          </div>
        </li>
      `)
      .join('');
  }

  updateStats();
}

function updateStats() {
  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.filter(task => !task.completed).length;
  completedCount.textContent = tasks.filter(task => task.completed).length;
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

addBtn.addEventListener('click', addTask);


taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

taskList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  const checkbox = event.target.closest('.task-checkbox');

  if (deleteButton) {
    const taskItem = deleteButton.closest('.task-item');
    deleteTask(Number(taskItem.dataset.id));
  }

  if (checkbox) {
    const taskItem = checkbox.closest('.task-item');
    toggleTask(Number(taskItem.dataset.id));
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

renderTasks();
