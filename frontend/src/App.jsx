import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import ImpressumPage from "./pages/ImpressumPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game/:playerId" element={<GamePage />} />
            <Route path="/results/:playerId" element={<ResultPage />} />*
            <Route path="/impressum" element={<ImpressumPage />} />
        </Routes>
    );
}

export default App;