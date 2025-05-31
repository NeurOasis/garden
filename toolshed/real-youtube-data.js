// Real YouTube data from scraping - ALL THESE ARE WRONG!
const failedGuesses = {
    "FUTURE": 15,
    "FAMILY": 12,
    "FRIEND": 8,
    "FROZEN": 7,
    "FOREST": 6,
    "FINGER": 5,
    "FRIDAY": 5,
    "FRENCH": 4,
    "FILTER": 3,
    "FLIGHT": 3,
    "FAMOUS": 2,
    "FABRIC": 2,
    "FACTOR": 2,
    "FALCON": 1,
    "FASTER": 1,
    "FATHER": 1,
    "FEMALE": 1,
    "FIGURE": 1,
    "FINALS": 1,
    "FINDER": 1
};

// Update the display to show these are all WRONG
console.log("🚨 LOADED REAL DATA: All these words have FAILED!");
console.log("The answer must be something NOT in this list!");

// Auto-populate these as already tried (and failed)
if (typeof puzzleData !== 'undefined') {
    Object.entries(failedGuesses).forEach(([word, count]) => {
        puzzleData.guesses.set(word, count);
        puzzleData.tried.add(word); // Mark as tried and FAILED
    });
    
    // Save this real data
    saveProgress();
    updateDisplay();
}
