
/**
 * Game-Server mit Socket.io & Express
 *
 * Diese Datei stellt den zentralen Spielserver bereit.
 * Sie verarbeitet alle Spielaktionen wie:
 * - Spielstart (Fragenauswahl & Sessionaufbau)
 * - Übertragung der Fragen an den Client
 * - Speichern der Punktzahl
 * - Rückgabe des Spielergebnisses
 *
 * Die Kommunikation läuft in Echtzeit über WebSocket (Socket.io).
 * Der Server basiert auf Node.js + Express und nutzt ein temporäres In-Memory-Speicherobjekt.
 */


import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import selectQuestions from "./questionSelector.js";

//Express + HTTP + WEBSOCKET Setup

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// Test-Route
app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 4000;
//Starte den Server
httpServer.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

//  Temporäre In-Memory-Spielstände (nur zur Laufzeit)
const gameSessions = {}; // { [playerId]: { questions, timeLimit, correctAnswers } }

// Lade alle Fragen aus der JSON-Datei beim Start
const rawData = fs.readFileSync("./questions.json", "utf-8");
const allQuestions = JSON.parse(rawData);

/**
 * Socket.IO Verbindung pro Spieler
 */
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Spielstart – erstellt eine neue Session für einen Spieler
    socket.on("start-game", ({ playerId, settings }) => {
        const {
            zeitProFrage,
            fragenRunden,
            kategorie,
        } = settings;

        const selected = selectQuestions({
            categories: kategorie,
            limit: fragenRunden
        });



        // Speichern der Spielsession
        gameSessions[playerId] = {
            questions: selected,
            timeLimit: zeitProFrage * 1000, // in ms!
            correctAnswers: null
        };

        console.log(`🎮 Started game for ${playerId}: ${selected.length} questions`);
    });


    // Fragen laden – schickt Fragen + Zeitlimit an den Spieler
    socket.on("load-questions", ({ playerId }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        socket.emit("questions", {
            questions: session.questions,
            timeLimit: session.timeLimit
        });
    });

    // Punktestand übermitteln – Spieler sendet seine Anzahl richtiger Antworten
    socket.on("submit-score", ({ playerId, correctAnswers }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        session.correctAnswers = correctAnswers;
        console.log(`Player ${playerId} finished with score: ${correctAnswers}`);
    });

    // Ergebnis abfragen – sendet die Endauswertung an den Spieler
    socket.on("get-results", ({ playerId }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        socket.emit("results", {
            score: session.correctAnswers ?? 0,
            topPlayers: null //Platzhalter für spätere Multiplayer-Funktion
        });
    });

    //Trennung – wenn Spieler die Verbindung trennt
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});