import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import PageWrapper from "../components/PageWrapper";
import getOrCreatePlayerId from "../utils/playerId.js";
import { loadResults } from "../services/socket.js";

export default function ResultsPage() {
    const playerId = getOrCreatePlayerId();
    const navigate = useNavigate();
    const [score, setScore] = useState(null);

    useEffect(() => {
        loadResults(playerId, setScore);
    }, []);

    const handleRestart = () => {
        navigate("/");
        sessionStorage.removeItem("playerName");
    };

    return (
        <PageWrapper>
            <h1 className="text-3xl font-bold mb-6">Ergebnis</h1>

            {score !== null ? (
                <div className="text-center mb-8">
                    <p className="text-xl mb-2">
                        Du hast <span className="text-cyan-400 font-bold">{score}</span> Punkte erreicht.
                    </p>
                </div>
            ) : (
                <p className="text-white">Lade Ergebnisse...</p>
            )}

            <CustomButton onClick={handleRestart} className="w-64">
                Neues Spiel
            </CustomButton>
        </PageWrapper>
    );
}
