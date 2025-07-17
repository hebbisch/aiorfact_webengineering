import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomButton from "../components/CustomButton";
import PageWrapper from "../components/PageWrapper.jsx";
import { startGame } from "../services/socket";
import getOrCreatePlayerId from "../utils/playerId";
import { categoryMap } from "../config/categories";

export default function StartPage() {
    const [step, setStep] = useState("mode");
    const [spielerName, setSpielerName] = useState("");
    const [zeitProFrage, setZeitProFrage] = useState(15);
    const [fragenRunden, setFragenRunden] = useState(10);
    const [kategorie, setKategorie] = useState([]);
    const navigate = useNavigate();
    const playerId = getOrCreatePlayerId();

    const handleAbbrechen = () => {
        setStep("mode");
        setKategorie([]);
        setSpielerName("");
    };

    const handleModeSelect = () => {
        setStep("details");
    };

    const handleKategorieToggle = (kat) => {
        if (kat === "Zufall 🎲") {
            setKategorie(prev => (prev.includes(kat) ? [] : [kat]));
        } else {
            setKategorie(prev => {
                const filtered = prev.filter(k => k !== "Zufall 🎲");
                return filtered.includes(kat)
                    ? filtered.filter(k => k !== kat)
                    : [...filtered, kat];
            });
        }
    };

    const handleStart = () => {
        const isZufall = kategorie.includes("Zufall 🎲");
        if (!spielerName.trim()) {
            alert("Bitte gib einen Spielernamen ein.");
            return;
        }
        if (!isZufall && kategorie.length < 3) {
            alert("Bitte wähle mindestens 3 Kategorien oder Zufall 🎲.");
            return;
        }

        const settings = {
            zeitProFrage,
            fragenRunden,
            kategorie: kategorie.map(k => categoryMap[k]),  // mapped
        };

        startGame(playerId, settings);

        sessionStorage.setItem("playerName", spielerName);

        navigate(`/game/${playerId}`);
    }

    return (
        <PageWrapper>
            {/* first page, here you select single- or multiplayer mode */}
            {step === "mode" && (
                <div className="text-center mb-6">
                    <img src={logo} alt="Logo" className="w-100 mx-auto"/>
                    <h2 className="text-2xl font-semibold mb-4">Spielmodus auswählen</h2>
                    <div className="flex justify-center gap-x-6 mt-4">
                        <CustomButton onClick={() => handleModeSelect()}>
                            Einzelspieler
                        </CustomButton>
                        <CustomButton onClick={() => {}}
                            disabled
                            className="relative bg-gray-600 opacity-60 cursor-not-allowed hover:after:content-['Bald_verfügbar'] hover:after:absolute hover:after:top-full hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bg-black hover:after:text-white hover:after:text-sm hover:after:rounded hover:after:px-2 hover:after:py-1 hover:after:mt-2"
                        >
                            Mehrspieler
                        </CustomButton>
                    </div>
                </div>
            )}

            {/* settings page */}
            {step === "details" && (
                <div className="space-y-4 w-full max-w-md pt-16">
                    <button
                        onClick={handleAbbrechen}
                        className="absolute top-6 left-6 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 z-50"
                    >
                        Abbrechen
                    </button>
                    <h2 className="text-xl font-semibold text-center">Spiel-Einstellungen</h2>

                    <input
                        type="text"
                        placeholder="Spielername"
                        value={spielerName}
                        onChange={(e) => setSpielerName(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />

                    <label className="block text-sm mt-4 mb-1">Zeit pro Frage: {zeitProFrage} Sekunden</label>
                    <input
                        type="range"
                        min="5"
                        max="20"
                        step="5"
                        value={zeitProFrage}
                        onChange={(e) => setZeitProFrage(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 rounded-lg"
                    />

                    <label className="block text-sm mt-4 mb-1">Anzahl Runden: {fragenRunden}</label>
                    <input
                        type="range"
                        min="5"
                        max="20"
                        step="1"
                        value={fragenRunden}
                        onChange={(e) => setFragenRunden(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 rounded-lg"
                    />


                    <div>
                        <p className="mt-4 mb-2 text-sm">Kategorien (mindestens 3):</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(categoryMap).map((kat) => (
                                <button
                                    key={kat}
                                    onClick={() => handleKategorieToggle(kat)}
                                    className={`px-3 py-1 rounded-full border ${
                                        kategorie.includes(kat)
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-700 text-white"}`
                                    }>
                                    {kat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="mt-6 bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 w-full"
                    >
                        Spiel starten
                    </button>
                </div>
            )}
        </PageWrapper>
    );
}