// script.js

// Grid configuration
const GRID = [
    "FITSISAQUARTERHALFED",
    "ATWENTYTENFIVEANTOWN",
    "HALMOSTMINUTESPASTEJ",
    "RAFTERTONESEVENTENTH",
    "OFOUREIGHTFIVENINERS",
    "ASIXTWOELEVENTHREEOX",
    "SNOONTWELVESOCLOCKEN"
];

// Word positions in the grid (row, startCol, endCol)
const WORD_POSITIONS = {
    'IT': [[0, 1, 2]],
    'IS': [[0, 4, 5]],
    'A': [[0, 5, 5]],
    'QUARTER': [[0, 6, 12]],
    'HALF': [[0, 14, 17]],
    'TWENTY': [[1, 1, 6]],
    'TEN': [[1, 7, 9]],
    'FIVE': [[1, 10, 13]],
    'ALMOST': [[2, 1, 6]],
    'MINUTES': [[2, 7, 13]],
    'PAST': [[2, 14, 17]],
    'AFTER': [[3, 1, 5]],
    'TO': [[3, 5, 6]],
    'ONE': [[3, 7, 9]],
    'SEVEN': [[3, 10, 14]],
    'FOUR': [[4, 2, 5]],
    'EIGHT': [[4, 6, 10]],
    'NINE': [[4, 12, 15]],
    'SIX': [[5, 1, 3]],
    'TWO': [[5, 4, 6]],
    'ELEVEN': [[5, 7, 12]],
    'THREE': [[5, 13, 17]],
    'NOON': [[6, 1, 4]],
    'TWELVE': [[6, 5, 10]],
    'OCLOCK': [[6, 11, 16]]
};

// Initialize the grid
function initializeGrid() {
    const gridContainer = document.getElementById('letter-grid');
    
    GRID.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'letter-row';
        
        row.split('').forEach((char, colIndex) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.className = 'letter';
            letterSpan.dataset.row = rowIndex;
            letterSpan.dataset.col = colIndex;
            rowDiv.appendChild(letterSpan);
        });
        
        gridContainer.appendChild(rowDiv);
    });
}

// Find active words based on current time
function findActiveWords() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let activeWords = new Set(['IT', 'IS']);

    // Handle noon special case
    if (hours === 12 && minutes < 5) {
        activeWords.add('NOON');
        activeWords.add('OCLOCK');
        return activeWords;
    }

    // Convert to 12-hour format
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    // Handle minutes
    if (minutes >= 5) {
        if (Math.abs(minutes - 15) <= 2) {
            activeWords.add('QUARTER');
        } else if (Math.abs(minutes - 30) <= 2) {
            activeWords.add('HALF');
        } else {
            if (minutes > 28) activeWords.add('HALF');
            if (minutes > 20) activeWords.add('TWENTY');
            if (minutes % 10 >= 5) activeWords.add('FIVE');
            if (minutes > 0) activeWords.add('MINUTES');
        }
        activeWords.add('PAST');
    }

    // Handle "almost" for times close to the hour
    if (minutes >= 55) {
        activeWords.add('ALMOST');
    }

    // Add hour word
    const hourWords = [
        'TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
        'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN'
    ];
    activeWords.add(hourWords[hours % 12]);

    if (minutes < 5) {
        activeWords.add('OCLOCK');
    }

    return activeWords;
}

// Update the display
function updateDisplay() {
    const activeWords = findActiveWords();
    const allLetters = document.querySelectorAll('.letter');
    
    // First, reset all letters to inactive
    allLetters.forEach(letter => {
        letter.classList.remove('active');
    });

    // Then highlight active words
    activeWords.forEach(word => {
        const positions = WORD_POSITIONS[word];
        if (positions) {
            positions.forEach(([row, startCol, endCol]) => {
                for (let col = startCol; col <= endCol; col++) {
                    const letter = document.querySelector(
                        `.letter[data-row="${row}"][data-col="${col}"]`
                    );
                    if (letter) {
                        letter.classList.add('active');
                    }
                }
            });
        }
    });
}

// Initialize and start the clock
function initClock() {
    initializeGrid();
    updateDisplay();
    setInterval(updateDisplay, 1000);
}

// Start when the page loads
document.addEventListener('DOMContentLoaded', initClock);