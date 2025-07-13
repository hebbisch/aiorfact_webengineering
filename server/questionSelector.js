// Auswahl und Mischung von Quizfragen
import fs from "fs";
const rawData = fs.readFileSync("./questions.json", "utf-8");
const allQuestions = JSON.parse(rawData);

/**
 * @param {Array} array
 * @returns {Array}
 */
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

/**
 * @param {Object} options
 * @param {string[]} options.categories - Liste der ausgewählten Kategorien
 * @param {number} options.limit - Anzahl der gewünschten Fragen
 * @returns {Array} - Gemischte Liste ausgewählter Fragen
 */
function selectQuestions({ categories, limit = 10 }) {
    const selectedCategories = categories.includes("zufall")
        ? [...new Set(allQuestions.map(q => q.category))]
        : categories;

    // Filter nach gewählten Kategorien
    const filtered = allQuestions.filter(q => selectedCategories.includes(q.category));

    const realFacts = filtered.filter(q => q.is_ai_generated === false);
    const aiFakes   = filtered.filter(q => q.is_ai_generated === true);

    const half = Math.floor(limit / 2);
    const remainder = limit - half;

    const selectedReal = shuffleArray(realFacts).slice(0, half);
    const selectedAI   = shuffleArray(aiFakes).slice(0, remainder);

    const combined = shuffleArray([...selectedReal, ...selectedAI]);

    return combined;
}

export default selectQuestions;
