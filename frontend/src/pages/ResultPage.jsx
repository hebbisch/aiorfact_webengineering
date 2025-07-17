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
    const [totalQuestions, setTotalQuestions] = useState(null);

    useEffect(() => {
        loadResults(playerId, (result) => {
            const total = parseInt(sessionStorage.getItem("totalQuestions"));
            setScore(result);
            setTotalQuestions(total);

            const ratio = result / total;

            if (ratio > 0.5) {
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
        <PageWrapper className="text-center space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Ergebnis</h2>
            <br/>
            {score !== null ? (
                <div>
                    Du hast <span className="font-bold text-xl">{score}</span> von <span>{totalQuestions}</span> möglichen Punkte erreicht.
                    <br/>
                    <br/>
                </div>
            ) : (
                <p>Lade Ergebnisse...</p>
            )}
            <CustomButton onClick={handleRestart}>
                <br/>
                Neues Spiel
            </CustomButton>
        </PageWrapper>
    );
}
