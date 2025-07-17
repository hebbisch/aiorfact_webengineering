import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import selectQuestions from "./questionSelector.js";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

// 🧠 In-memory session storage
const gameSessions = {}; // { [playerId]: { questions, timeLimit, correctAnswers } }

// 🔎 Load all questions once at startup
const rawData = fs.readFileSync("./questions.json", "utf-8");
const allQuestions = JSON.parse(rawData);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // 1. Receive game settings and generate a session
    socket.on("start-game", ({ playerId, settings }) => {
        const {
            zeitProFrage,
            fragenRunden,
            kategorie,
            //shuffle
        } = settings;

        const selected = selectQuestions({
            categories: kategorie,
            limit: fragenRunden
        });



        // Store game session
        gameSessions[playerId] = {
            questions: selected,
            timeLimit: zeitProFrage * 1000, // in ms!
            correctAnswers: null
        };

        console.log(`🎮 Started game for ${playerId}: ${selected.length} questions`);
    });


    // 2. Client asks for their questions
    socket.on("load-questions", ({ playerId }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        socket.emit("questions", {
            questions: session.questions,
            timeLimit: session.timeLimit
        });
    });

    // 3. Client submits score
    socket.on("submit-score", ({ playerId, correctAnswers }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        session.correctAnswers = correctAnswers;
        console.log(`Player ${playerId} finished with score: ${correctAnswers}`);
    });

    // 4. Client requests results
    socket.on("get-results", ({ playerId }) => {
        const session = gameSessions[playerId];
        if (!session) return;

        socket.emit("results", {
            score: session.correctAnswers ?? 0,
            topPlayers: null // Placeholder if you add multiplayer later
        });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});