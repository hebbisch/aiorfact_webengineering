// GamePage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuestions } from "../services/socket.js";
import { submitScore } from "../services/socket";
import logo from "../assets/logo.png";
import QuestionCard from "../components/QuestionCard";
import CustomButton from "../components/CustomButton";
import getOrCreatePlayerId from "../utils/playerId";
import PageWrapper from "../components/PageWrapper.jsx";

export default function GamePage() {
    const navigate = useNavigate();
    const playerId = getOrCreatePlayerId();
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [timeLeft, setTimeLeft] = useState(100);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const scoreRef = useRef(0);
    const timerRef = useRef(null);
    const [timeLimit, setTimeLimit] = useState(20000);


    useEffect(() => {
        loadQuestions(playerId, setQuestions, setTimeLimit);
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            setIndex(0);      // ✅ manually show the first question
            startTimer();     // ✅ start the timer manually
        }
    }, [questions]);

    const startTimer = (limit = timeLimit) => {
        clearInterval(timerRef.current);
        const start = Date.now();
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.max(0, 100 - (elapsed / limit) * 100);
            setTimeLeft(percent);
            if (elapsed >= limit) {
                clearInterval(timerRef.current);
                showFeedback("⏰");
            }
        }, 100);
    };

    const handleAnswer = (answer) => {
        setButtonsDisabled(true);
        clearInterval(timerRef.current);
        const correct = answer === questions[index].is_ai_generated;
        if (correct) scoreRef.current += 1;
        showFeedback(correct ? "✅" : "❌");
    };

    const showFeedback = (icon) => {
        setFeedback(icon);
        setTimeout(() => {
            setFeedback(null);
            nextQuestion();
        }, 1000);
    };

    const nextQuestion = () => {
        setIndex((prevIndex) => {
            const next = prevIndex + 1;
            if (next < questions.length) {
                setButtonsDisabled(false);
                startTimer();
                return next;
            } else {
                submitScore({
                    playerId,
                    correctAnswers: scoreRef.current,
                });
                navigate(`/results/${playerId}`);
                return prevIndex; // prevent overshooting index
            }
        });
    };

    if (!questions.length) return <div className="text-white">Loading...</div>;

    const q = questions[index];

    return (
        <PageWrapper>
            <img src={logo} className="w-32 mb-4" />

            <p className="text-gray-400 mb-2">
                Frage {index + 1} / {questions.length}
            </p>

            <QuestionCard
                question={q.text}
                category={q.category} // ← internal key like "essen_trinken"
                timeLeft={timeLeft}
            />

            <div className="flex gap-8 mt-6">
                <CustomButton disabled={buttonsDisabled} onClick={() => handleAnswer(false)}>
                    Fact
                </CustomButton>
                <CustomButton disabled={buttonsDisabled} onClick={() => handleAnswer(true)}>
                    AI
                </CustomButton>
            </div>

            {feedback && (
                <div className="text-7xl mt-8 animate-pulse">{feedback}</div>
            )}
        </PageWrapper>
    );
}