# 🧠 Tech Interview Trainer

**Tech Interview Trainer** is a web application built for the [Boot.dev Hackathon](https://boot.dev) that helps developers **practice real technical interview questions** in a focused and interactive way.
You can write your answers, compare them with ideal solutions, and track your progress — all in a clean and distraction-free environment.

---

## 💡 What Does It Do?

* 🔀 Get **random coding interview questions**
* 🎯 Filter questions by **category** and **difficulty**
* ✍️ Submit your answer and instantly compare it with the **ideal one**
* 📚 View your **answer history**, including timestamps
* 🧽 Remove specific entries from your history
* 🔒 Protected against basic **XSS attacks** with HTML escaping

Whether you're preparing for interviews or just brushing up on your skills, this app gives you a simple, focused space to practice.

---

## ⚙️ Built With

* **Python** + **Flask** (Backend)
* **MySQL** (hosted via Railway)
* **HTML**, **CSS**, and **Vanilla JavaScript** (Frontend)
* REST API structured with Flask **Blueprints**
* Hosted on **Vercel** (frontend) and **Railway** (backend)

---
## 🧠 AI Usage & Transparency

For transparency:
I used **ChatGPT** to help speed up development in a few key areas:

* Writing and refactoring **JavaScript DOM logic**, especially modals and dynamic rendering.
* Generating some of the **interview questions** used in the app, with adjustments based on official documentation.
---

## 🚀 Try It Out

👉 **Live App**: https://bootdev-hackathon.vercel.app/

---
## 🧪 Extra Features

* Responsive design using pure CSS
* Modals instead of default browser alerts
* Escape functions to avoid injection
* User name stored in localStorage, no authentication required
* Easy to reset history by deleting cards manually

