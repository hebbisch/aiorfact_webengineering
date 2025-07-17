/**
 *  Fragenauswahl mit Zufall & Balance
 *
 * Dieses Modul lädt alle Fragen aus der JSON-Datei und stellt die Funktion `selectQuestions` bereit.
 * Basierend auf:
 * - gewünschten Kategorien
 * - Gesamtanzahl (Limit)
 * wählt es pro Kategorie eine (approximativ gleichmäßige) Mischung aus echten und KI-generierten Fragen.
 *
 * Die Auswahl ist zufällig (Fisher-Yates-Shuffle).
 */


import fs from "fs";
// Fragen einmal beim Start laden
const rawData = fs.readFileSync("./questions.json", "utf-8");
const allQuestions = JSON.parse(rawData);

/**
 * Mischt ein Array mit dem Fisher-Yates-Algorithmus.
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
* Wählt eine bestimmte Anzahl an Quizfragen aus den gegebenen Kategorien aus.
 * Achtet dabei auf Mischung zwischen echten und KI-generierten Aussagen.
 * @param {Object} options
 * @param {string[]} options.categories - Liste der ausgewählten Kategorien
 * @param {number} options.limit - Anzahl der gewünschten Fragen
 * @returns {Array}
 */
function selectQuestions({ categories, limit = 10 }) {
    // Validierung der Eingabe
    if (limit < 5 || limit > 20) {
        throw new Error("Limit muss zwischen 5 und 20 liegen.");
    }

    if (!Array.isArray(categories) || (categories.length < 3 && !categories.includes("zufall"))) {
        throw new Error("Mindestens 3 Kategorien oder 'zufall' müssen gewählt werden.");
    }
     // Wenn "zufall" ausgewählt wurde → alle verfügbaren Kategorien verwenden
    const selectedCategories = categories.includes("zufall")
        ? [...new Set(allQuestions.map(q => q.category))]
        : categories;

    const perCategory = Math.floor(limit / selectedCategories.length);
    const rest = limit % selectedCategories.length;

    let selectedReal = [];
    let selectedAI = [];

    // Fragen pro Kategorie auswählen
    selectedCategories.forEach((category, index) => {
        const filtered = allQuestions.filter(q => q.category === category);
        const realFacts = filtered.filter(q => q.is_ai_generated === false);
        const aiFakes   = filtered.filter(q => q.is_ai_generated === true);

        //Gesamtanzahl für diese Kategorie
        const need = perCategory + (index < rest ? 1 : 0);

        // Zufällige Anzahl echter Fragen (0 bis need)
        let realCount = Math.floor(Math.random() * (need + 1));
        let aiCount = need - realCount;

        // Begrenzung, falls nicht genug echte/AI-Fragen vorhanden
        if (realFacts.length < realCount) {
            aiCount += realCount - realFacts.length;
            realCount = realFacts.length;
        }
        if (aiFakes.length < aiCount) {
            realCount += aiCount - aiFakes.length;
            aiCount = aiFakes.length;
        }

        const real = shuffleArray(realFacts).slice(0, realCount);
        const ai = shuffleArray(aiFakes).slice(0, aiCount);


        selectedReal.push(...real);
        selectedAI.push(...ai);
    });

    //Gesamtauswahl mischen
    const combined = shuffleArray([...selectedReal, ...selectedAI]);

    return combined;
}

export default selectQuestions;
