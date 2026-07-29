# ⚔️ Cyber Battleground — Frontend

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

> **Interactive client UI for Cyber Battleground** — A multiplayer, decision-driven strategy RPG designed to make cybersecurity learning engaging and immersive for beginners.

---

## 🌐 Overview

**Cyber Battleground** bridges the gap between theoretical security concepts and hands-on decision making. Players step into the role of **Red Attackers** or **Blue Defenders**, competing in a dynamic open cyber world to control nodes, manage digital risks, and forge strategic alliances.

This repository houses the front-end user interface built with **React** and **TypeScript**, delivering a responsive, real-time dashboard and game UI.

* **Backend Repository:** [cyber-battleground-backend](https://github.com/YOUR_USERNAME/cyber-battleground-backend) *(Update link)*

---

## ✨ Key Features

* **Role Selection:** Choose between **Red Team (Offensive)** and **Blue Team (Defensive)** strategies.
* **Interactive Cyber World Map:** Visual representation of network nodes, systems, and controlled assets.
* **Dynamic NPC & Player Interactions:** Engage in tactical encounters, uncover hidden network vulnerabilities, and execute strategic actions.
* **Real-time Tactical Updates:** Live updates reflecting network control shifts, attacks, and defense maneuvers.

---

## 🛠️ Tech Stack

* **Framework:** React + Vite
* **Language:** TypeScript
* **Styling/UI:** Tailwind CSS
* **Icons:** Lucid-icon
* **Animations:** Framer-motion
* **Containerization:** Docker

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v22 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com/) (optional, for containerized run)

### Local Development Setup

**Note:** This project requires a backend server and websocket connection. Checkout [**cyber-battleground-backend**](https://github.com/Kashinda235/cyber-battleground-backend)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kashinda235/cyber-battleground-frontend.git
   cd cyber-battleground-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

#### Running with Docker
To build and run the frontend using Docker:

```bash
# Build the Docker image
docker build -t cyber-battleground-frontend .

# Run the container
docker run -d -p 3000:3000 --name cyber-frontend cyber-battleground-frontend
Access the app at http://localhost:3000.
```

This project is *Work in Progress*
