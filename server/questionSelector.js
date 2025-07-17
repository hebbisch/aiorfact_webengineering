import fs from "fs";
const rawData = fs.readFileSync("./questions.json", "utf-8");
const allQuestions = JSON.parse(rawData);

/**
 * Besseres Shuffling: Fisher-Yates
 * @param {Array} array
 * @returns {Array}
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Auswahl und Mischung von Quizfragen
 * @param {Object} options
 * @param {string[]} options.categories - Liste der ausgewählten Kategorien
 * @param {number} options.limit - Anzahl der gewünschten Fragen
 * @returns {Array}
 */
function selectQuestions({ categories, limit = 10 }) {
    if (limit < 5 || limit > 20) {
        throw new Error("Limit muss zwischen 5 und 20 liegen.");
    }

    if (!Array.isArray(categories) || (categories.length < 3 && !categories.includes("zufall"))) {
        throw new Error("Mindestens 3 Kategorien oder 'zufall' müssen gewählt werden.");
    }

    const selectedCategories = categories.includes("zufall")
        ? [...new Set(allQuestions.map(q => q.category))]
        : categories;

    const perCategory = Math.floor(limit / selectedCategories.length);
    const rest = limit % selectedCategories.length;

    let selectedReal = [];
    let selectedAI = [];

    selectedCategories.forEach((category, index) => {
        const filtered = allQuestions.filter(q => q.category === category);
        const realFacts = filtered.filter(q => q.is_ai_generated === false);
        const aiFakes   = filtered.filter(q => q.is_ai_generated === true);

        const need = perCategory + (index < rest ? 1 : 0);
        const half = Math.floor(need / 2);
        const remainder = need - half;

        const real = shuffleArray(realFacts).slice(0, half);
        const ai = shuffleArray(aiFakes).slice(0, remainder);

        selectedReal.push(...real);
        selectedAI.push(...ai);
    });

    const combined = shuffleArray([...selectedReal, ...selectedAI]);

    return combined;
}

export default selectQuestions;
