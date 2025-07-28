const BACKEND_URL = 'https://web-production-5986da.up.railway.app';

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

async function loadAnswerHistory() {
  const userName = localStorage.getItem("username");
  if (!userName) return showNotification("No user name found. Answer at least one question first!");

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
        <p><strong>Question:</strong> ${escapeHTML(ans.question)}</p>
        <p><strong>Your answer:</strong> ${escapeHTML(ans.user_answer)}</p>
        <p><strong>Ideal answer:</strong> ${escapeHTML(ans.ideal_answer)}</p>
        <p><em>${new Date(ans.timestamp).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'})}</em></p>
        <button class="delete-button" onclick="deleteAnswer(${ans.question_id}, this)">🗑️</button>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    showNotification("Failed to load answer history.");
  }
}


function customConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("confirm-message");
    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    msg.textContent = message;
    modal.style.display = "flex";

    const cleanup = () => {
      modal.style.display = "none";
      yesBtn.onclick = null;
      noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
      cleanup();
      resolve(true);
    };

    noBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}


async function deleteAnswer(questionId, buttonElement) {
  const userName = localStorage.getItem("username");
  if (!userName) {
    showNotification("Username not found.");
    return;
  }

  const confirmDelete = await customConfirm("Are you sure you want to delete this answer?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${BACKEND_URL}/delete_answer_history`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        user_name: userName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete.");
    }

    const data = await response.json();
    console.log(data.message);
    const card = buttonElement.closest(".answer-card");
    if (card) card.remove();

  } catch (err) {
    showNotification("Error deleting answer.");
    console.error(err.message);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadAnswerHistory();
});
