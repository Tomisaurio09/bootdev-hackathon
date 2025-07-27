const BACKEND_URL = 'http://localhost:5000';

let currentQuestionId = null;

function showNotification(message) {
  const popup = document.getElementById("notification-popup");
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  }[match]));
}

async function loadRandomQuestion() {
  try {
    const res = await fetch(`${BACKEND_URL}/questions/random`);
    const data = await res.json();
    currentQuestionId = data.id;
    document.getElementById("question-title").textContent = data.title;
    document.getElementById("question-category").textContent = data.category;
    document.getElementById("question-difficulty").textContent = data.difficulty;
    document.getElementById("user-answer").value = "";
  } catch (err) {
    showNotification("Failed to load question.");
  }
}

function getUserName() {
  return new Promise(resolve => {
    const modal = document.getElementById("username-modal");
    const form = document.getElementById("username-form");
    const input = document.getElementById("username-input");
    modal.style.display = "flex";
    input.value = "";
    input.focus();

    form.onsubmit = e => {
      e.preventDefault();
      const name = escapeHTML(input.value.trim());
      if (name) {
        modal.style.display = "none";
        resolve(name);
      }
    };
  });
}

async function submitAnswer() {
  const userAnswer = escapeHTML(document.getElementById("user-answer").value.trim());
  let userName = localStorage.getItem("username");
  if (!userName) {
    userName = await getUserName();
    localStorage.setItem("username", userName);
  }

  if (!userAnswer) return showNotification("Please write an answer.");

  try {
    const res = await fetch(`${BACKEND_URL}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: currentQuestionId,
        user_answer: userAnswer,
        user_name: userName
      })
    });
    await res.json();
    showNotification("Answer submitted!");
    loadRandomQuestion();
  } catch (err) {
    showNotification("Failed to submit answer.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadRandomQuestion();
});
