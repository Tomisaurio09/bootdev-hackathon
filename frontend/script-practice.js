const BACKEND_URL = 'https://web-production-5986da.up.railway.app';

let currentQuestionId = null;

function showNotification(message) {
  const popup = document.getElementById("notification-popup");
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 1000);
}

function escapeHTML(str) {
  return str.replace(/[&<>"]/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;'
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

async function loadFilteredQuestion() {
  const category = document.getElementById("category-filter").value;
  const difficulty = document.getElementById("difficulty-filter").value;

  let url = `${BACKEND_URL}/questions/random_filtered`;

  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No question found.");
    const data = await res.json();

    currentQuestionId = data.id;
    document.getElementById("question-title").textContent = data.title;
    document.getElementById("question-category").textContent = data.category;
    document.getElementById("question-difficulty").textContent = data.difficulty;
    document.getElementById("user-answer").value = "";
  } catch (err) {
    showNotification("No questions match the selected filters.");
    console.error(err);
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
      if (name && name.length >= 2) {
        modal.style.display = "none";
        resolve(escapeHTML(name));
      } else{
        showNotification("Name must be at least 2 characters");
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
