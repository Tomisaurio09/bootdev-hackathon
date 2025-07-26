const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-link");
const BACKEND_URL = 'http://localhost:5000';

links.forEach(link => {
  link.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(link.dataset.target).classList.add("active");

    if (link.dataset.target === "practice") {
      loadRandomQuestion();
    } else if (link.dataset.target === "history") {
      loadAnswerHistory();
    }
  });
});

let currentQuestionId = null;

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
    alert("Failed to load question.");
  }
}

async function submitAnswer() {
  const userAnswer = document.getElementById("user-answer").value.trim();
  const userName = localStorage.getItem("username") || prompt("What is your name?");
  localStorage.setItem("username", userName);

  if (!userAnswer) return alert("Please write an answer.");

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
    alert("Answer submitted!");
    loadRandomQuestion();
  } catch (err) {
    alert("Failed to submit answer.");
  }
}

async function loadAnswerHistory() {
  const userName = localStorage.getItem("username");
  if (!userName) return alert("No user name found. Answer at least one question first!");

  try {
    const res = await fetch(`${BACKEND_URL}/user_answers?user=${userName}`);
    const data = await res.json();
    const list = document.getElementById("answers-list");
    list.innerHTML = "";
    if (data.length === 0) {
      list.innerHTML = "<p>No answers found yet.</p>";
      return;
    }
    data.forEach(ans => {
      const card = document.createElement("div");
      card.className = "answer-card";
      card.innerHTML = `
        <p><strong>Question:</strong> ${ans.question}</p>
        <p><strong>Your answer:</strong> ${ans.user_answer}</p>
        <p><strong>Ideal answer:</strong> ${ans.ideal_answer}</p>
        <p><em>${new Date(ans.timestamp).toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</em></p>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    alert("Failed to load answer history.");
  }
}