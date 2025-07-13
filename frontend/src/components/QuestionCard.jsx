import { categoryMap } from "../config/categories";

export default function QuestionCard({ question, category, timeLeft }) {
    // Map internal key (like "essen_trinken") to label (like "Essen 🍽️")
    const displayCategory =
        Object.entries(categoryMap).find(([, value]) => value === category)?.[0] || category;

    return (
        <div className="bg-blue-600 p-6 rounded-xl w-full max-w-3xl text-center text-2xl text-black font-semibold relative">
            <p className="absolute top-2 left-4 text-sm text-white opacity-70">
                {displayCategory}
            </p>
            {question}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-gray-800">
                <div
                    className="bg-cyan-400 h-full transition-all duration-100"
                    style={{ width: `${timeLeft}%` }}
                />
            </div>
        </div>
    );
}