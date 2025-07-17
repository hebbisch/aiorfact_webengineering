import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import PageWrapper from "../components/PageWrapper";
import getOrCreatePlayerId from "../utils/playerId.js";
import { loadResults } from "../services/socket.js";
import confetti from "canvas-confetti";

export default function ResultsPage() {
    const playerId = getOrCreatePlayerId();
    const navigate = useNavigate();
    const [score, setScore] = useState(null);

    useEffect(() => {
        loadResults(playerId, (result) => {
            setScore(result);
            const totalQuestions = parseInt(sessionStorage.getItem("totalQuestions")) || 10;
            const ratio = result / totalQuestions;

            if (ratio > 0) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } 
        });
    }, []);

    const handleRestart = () => {
        navigate("/");
        sessionStorage.removeItem("playerName");
        sessionStorage.removeItem("totalQuestions");
    };

    return (
        <div style={styles.wrapper}>
            

            <h1 style={styles.heading}>Ergebnis</h1>

            {score !== null ? (
                <div style={styles.result}>
                    Du hast <span style={styles.highlight}>{score}</span> Punkte erreicht.
                </div>
            ) : (
                <p style={{ color: "white" }}>Lade Ergebnisse...</p>
            )}

            <CustomButton onClick={handleRestart} style={styles.button}>
                Neues Spiel
            </CustomButton>

            
        </div>
    );
}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        position: "relative",
        backgroundColor: "#111",
        color: "white",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
    },
    result: {
        fontSize: "1.2rem",
        marginBottom: "2rem",
    },
    highlight: {
        color: "cyan",
        fontWeight: "bold",
    },
    button: {
        width: "200px",
    },
};
