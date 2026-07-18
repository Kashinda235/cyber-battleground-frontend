# SOC Simulator

A real-time multiplayer SOC simulator where Red Team players launch attacks and Blue Team players defend the environment through live SIEM-style actions.

## Features

- Real-time multiplayer gameplay with Socket.io
- Red Team attack actions: Port Scan, Brute Force, SQL Injection, and Ransomware
- Blue Team defensive actions: Block IP and Patch Vulnerability
- Shared chat and live log feed
- Global in-memory game state with system health and live scoring

## Tech Stack

- React
- Vite
- Node.js
- Express
- Socket.io

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend:
   ```bash
   npm run server
   ```

3. Start the frontend in a second terminal:
   ```bash
   npm run client
   ```

4. Open the app in your browser:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## Project Structure

- `server.js` - Express and Socket.io server with game state and event handlers
- `src/App.jsx` - Main client app and socket connection management
- `src/Lobby.jsx` - Username and team selection screen
- `src/Dashboard.jsx` - Main gameplay UI for attacks, defenses, logs, and chat
- `src/styles.css` - Dark minimalist styling

## Notes

This is an initial production-ready blueprint and working prototype for a SOC simulator experience.
