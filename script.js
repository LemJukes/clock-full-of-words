// script.js

const GRID = [
    "FITSISAQUARTERHALFED",
    "ATWENTYTENFIVEANTOWN",
    "HALMOSTMINUTESPASTEJ",
    "RAFTERTONESEVENTENTH",
    "OFOUREIGHTFIVENINERS",
    "ASIXTWOELEVENTHREEOX",
    "SNOONTWELVESOCLOCKEN"
];

const WORD_POSITIONS = {
    'IT': [[0, 1, 2]],
    'IS': [[0, 4, 5]],
    'A': [[0, 6, 6]],
    'QUARTER': [[0, 7, 13]],
    'HALF': [[0, 14, 17]],
    'TWENTY': [[1, 1, 6]],
    'TEN': [[1, 7, 9]],
    'FIVE': [[1, 10, 13]],
    'ALMOST': [[2, 1, 6]],
    'MINUTES': [[2, 7, 13]],
    'PAST': [[2, 14, 17]],
    'AFTER': [[3, 1, 5]],
    'TO': [[3, 6, 7]],
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
    'OCLOCK': [[6, 12, 17]]
};

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

function findActiveWords() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let activeWords = new Set(['IT', 'IS']);

    // Handle midnight and noon special cases
    if (hours === 12 && minutes < 5) {
        activeWords.add('NOON');
        activeWords.add('OCLOCK');
        return activeWords;
    } else if (hours === 0 && minutes < 5) {
        activeWords.add('TWELVE');
        activeWords.add('OCLOCK');
        return activeWords;
    }

    // Convert to 12-hour format
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    // Handle "almost" case for the upcoming hour (at 55+ minutes)
    if (minutes >= 55) {
        activeWords = new Set(['IT', 'IS', 'ALMOST']);
        hours = (hours % 12) + 1;
        if (hours === 13) hours = 1;
        const hourWords = [
            'TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
            'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN'
        ];
        activeWords.add(hourWords[hours % 12]);
        return activeWords;
    }

    // Determine if we're past the half-hour
    const isAfterHalf = minutes > 30;
    
    // Adjust minutes and hours for "to" case
    if (isAfterHalf) {
        minutes = 60 - minutes;
        hours = (hours % 12) + 1;
        if (hours === 13) hours = 1;
    }

    // Handle minutes
    if (minutes >= 5) {
        if (minutes >= 13 && minutes <= 17) {
            activeWords.add('QUARTER');
        } else if (minutes >= 28 && minutes <= 32) {
            activeWords.add('HALF');
        } else if (minutes >= 8 && minutes <= 12) {
            activeWords.add('TEN');
            if (!isAfterHalf) activeWords.add('MINUTES');
        } else if (minutes >= 3 && minutes <= 7) {
            activeWords.add('FIVE');
            activeWords.add('MINUTES');
        } else if (minutes >= 18 && minutes <= 22) {
            activeWords.add('TWENTY');
            if (!isAfterHalf) activeWords.add('MINUTES');
        } else if (minutes >= 23 && minutes <= 27) {
            activeWords.add('TWENTY');
            activeWords.add('FIVE');
            activeWords.add('MINUTES');
        }
        
        // Add 'TO' or 'PAST' based on whether we're in the first or second half of the hour
        activeWords.add(isAfterHalf ? 'TO' : 'PAST');
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

function updateDisplay() {
    const activeWords = findActiveWords();
    const allLetters = document.querySelectorAll('.letter');
    
    allLetters.forEach(letter => {
        letter.classList.remove('active');
    });

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

function initClock() {
    initializeGrid();
    updateDisplay();
    setInterval(updateDisplay, 1000);
}

document.addEventListener('DOMContentLoaded', initClock);

