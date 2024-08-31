// Select DOM elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// Initialize to-do array from localStorage or empty array
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Function to save to-dos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to render the to-do list
function renderTodos() {
  // Clear the current list
  todoList.innerHTML = "";

  // Iterate over to-dos in reverse to show latest first
  todos
    .slice()
    .reverse()
    .forEach((todo, index) => {
      const li = document.createElement("li");
      li.className =
        "flex items-center justify-between bg-gray-50 p-3 rounded shadow";

      // Serial Number
      const serial = document.createElement("span");
      serial.className = "mr-2 text-gray-700";
      serial.textContent = todos.length - index + ".";

      // Checkbox and Text
      const leftDiv = document.createElement("div");
      leftDiv.className = "flex items-center";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "mr-2 form-checkbox h-5 w-5 text-blue-600";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleCompletion(todo.id));

      const span = document.createElement("span");
      span.textContent = todo.text;
      span.className = todo.completed
        ? "line-through text-gray-500"
        : "text-gray-800";
      span.addEventListener("dblclick", () => editTodo(todo.id, span));

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(span);

      // Edit and Delete Buttons
      const rightDiv = document.createElement("div");
      rightDiv.className = "flex items-center space-x-2";

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className =
        "bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:outline-none";
      editButton.addEventListener("click", () => editTodo(todo.id, span));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className =
        "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));

      rightDiv.appendChild(editButton);
      rightDiv.appendChild(deleteButton);

      li.appendChild(serial);
      li.appendChild(leftDiv);
      li.appendChild(rightDiv);

      todoList.appendChild(li);
    });
}

// Function to add a new to-do
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// Function to toggle completion status
function toggleCompletion(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Function to edit a to-do
function editTodo(id, spanElement) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  // Create an input field with current text
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.className =
    "px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
  spanElement.replaceWith(input);
  input.focus();

  // Save changes on Enter or when input loses focus
  const save = () => {
    const newText = input.value.trim();
    if (newText) {
      todo.text = newText;
      saveTodos();
      renderTodos();
    } else {
      alert("To-Do cannot be empty.");
      input.focus();
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      save();
    }
  });

  input.addEventListener("blur", save);
}

// Function to delete a to-do
function deleteTodo(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this to-do item?"
  );
  if (confirmDelete) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }
}

// Handle form submission
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value;
  if (text.trim()) {
    addTodo(text);
    todoInput.value = "";
    todoInput.focus();
  }
});

// Initial render
renderTodos();
