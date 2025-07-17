# AI or Fact?

**AI or Fact?** ist ein browserbasiertes Quizspiel, bei dem Spieler:innen erraten müssen, ob Aussagen von einer echten Person stammen – oder von einer KI erfunden wurden.

Jetzt spielen: [https://aiorfact.fun](https://aiorfact.fun)

## Features

- Einzelspielermodus mit Fragenshuffle, Zeitlimit & Kategorien
- Aussagebewertung: Wahrheit oder KI-Erfindung?
- Fragen aus verschiedenen Bereichen
- Echtzeit-Kommunikation über WebSocket
- Gehostet auf einem eigenen Server (Hetzner)

> Mehrspielermodus ist in Planung und wird bald veröffentlicht.

---

## Tech Stack

- Frontend: React, Vite, Tailwind CSS  
- Backend: Node.js, Express, Socket.io  
- Daten: Lokale `questions.json` Datei  
- Hosting: Hetzner Cloud-Server mit Docker  
- Domain: [aiorfact.fun](https://aiorfact.fun)

---

## Lokales Setup (Dev-Modus)

```bash
# Projekt klonen
git clone https://github.com/hebbisch/aiorfact_webengineering.git  # bei Bedarf anpassen
cd webapp

# Frontend starten
cd frontend
npm install
npm run dev

# Backend starten
cd ../server
npm install
node server.js
