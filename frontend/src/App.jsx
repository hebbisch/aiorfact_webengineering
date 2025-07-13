import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game/:playerId" element={<GamePage />} />
            <Route path="/results/:playerId" element={<ResultPage />} />*
        </Routes>
    );
}

export default App;