// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const successMsg = document.getElementById("successMsg");

// Simple email regex
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Reset messages
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  successMsg.textContent = "";

  let isValid = true;

  // Name validation
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Name is required";
    isValid = false;
  }

  // Email validation
  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    emailError.textContent = "Enter a valid email address";
    isValid = false;
  }

  // Message validation
  if (messageInput.value.trim() === "") {
    messageError.textContent = "Message is required";
    isValid = false;
  }

  if (isValid) {
    successMsg.textContent = "Form submitted successfully!";
    contactForm.reset();
  }
});


// ===== TO-DO LIST DOM MANIPULATION =====
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");

function createTodoItem(text) {
  const li = document.createElement("li");
  li.className = "todo-item";

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;

  const removeBtn = document.createElement("button");
  removeBtn.className = "todo-remove";
  removeBtn.textContent = "Remove";

  removeBtn.addEventListener("click", () => {
    todoList.removeChild(li);
  });

  li.appendChild(span);
  li.appendChild(removeBtn);
  return li;
}

addTodoBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (text === "") return;
  const item = createTodoItem(text);
  todoList.appendChild(item);
  todoInput.value = "";
});

// Optional: add item on Enter key
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodoBtn.click();
  }
});
