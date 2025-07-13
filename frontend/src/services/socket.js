import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

/**
 * Starts a new game by sending settings to the server.
 * @param {string} playerId
 * @param {object} settings
 */
export function startGame(playerId, settings) {
    socket.emit("start-game", {
        playerId,
        settings,
    });
}

/**
 * Requests the quiz questions for the given playerId from the server.
 *
 * This function emits a "load-questions" event to the server via WebSocket,
 * then listens for the "questions" response event containing the question list
 * and time limit.
 *
 * - Sets the questions using the provided `setQuestions` state setter
 * - Sets the time limit using `setTimeLimit`
 * - Starts the question timer using `startTimer`
 *
 * The "questions" event listener is removed immediately after receiving the response
 * to avoid duplicate listeners or updates.
 *
 * @param {string} playerId - Unique identifier for the player requesting questions
 * @param {function} setQuestions - React state setter for storing questions
 * @param {function} setTimeLimit - React state setter for the time limit
 */
export function loadQuestions(playerId, setQuestions, setTimeLimit) {
    socket.emit("load-questions", { playerId });

    const handleQuestions = ({ questions, timeLimit }) => {
        console.log("🧠 Questions received:", questions.length);
        console.log("⏱️ Time limit received (ms):", timeLimit);
        setQuestions(questions);
        setTimeLimit(timeLimit);
        // Remove this handler right after it's used
        socket.off("questions", handleQuestions);
    };

    socket.on("questions", handleQuestions);
}


export function submitScore({ playerId, correctAnswers }) {
    socket.emit("submit-score", {
        playerId,
        correctAnswers,
    });
}

/**
 * Requests the final game results for a player and handles the server response.
 *
 * @param {string} playerId - The player to fetch results for
 * @param {function} setScore - React state setter for score
 */
export function loadResults(playerId, setScore ) {
    socket.emit("get-results", { playerId });

    const handleResults = ({ score }) => {
        setScore(score);
        socket.off("results", handleResults); // Remove listener after one use
    };

    socket.on("results", handleResults);
}