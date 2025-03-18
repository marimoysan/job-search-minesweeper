const rows = 10;
const cols = 10;
const mineCount = 30;

const rejectionReasons = [
    "Your resume wasn't impressive enough.",
    "You lacked the specific experience we were looking for.",
    "We decided to go with another candidate who was a better fit.",
    "The team felt you weren’t a good culture match.",
    "You didn’t demonstrate enough leadership experience.",
    "Your technical skills didn’t meet our expectations.",
    "We found someone with more relevant qualifications.",
    "The competition was tough, and we had to make tough choices.",
    "You didn’t seem to have the drive we were looking for.",
    "We decided to move forward with a candidate who had more industry experience."
];

const stages = [
    "New job application sent! Let's play.",
    "Phone Screeners (Recruiters)",
    "HR Assistants (Tell me about yourself)",
    "Culture Fit Interviewers (Basic behavioral Q&A)",
    "Compliance & Paperwork (Forms, background checks)",
    "Junior Team Members (Peer compatibility)",
    "Direct Manager (Will you fit in?)",
    "Cross-Functional Teams (Other departments)",
    "First Mini-Boss – Department Head",
    "Senior Team Leads (Advanced skills test)",
    "Internal Specialists (Deep technical questions)",
    "Problem-Solving Committee (Puzzle challenge)",
    "Mid-Boss – Senior Manager",
    "Department Directors (Long-term vision)",
    "VP of Operations (Processes & efficiency)",
    "VP of Strategy (Company goals & future)",
    "CFO & Finance Team (Budgets, risk management)",
    "CEO's Inner Circle (Final major challenge)",
    "Semi-Final Boss – The CEO",
    "Congratulations, you got the job! 🎉"
];


let board = [];
let minePositions = [];
let revealedCells = 0; // Tracks the number of cells revealed
let totalCells = rows * cols - mineCount; // Total non-mine cells

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-game-btn").addEventListener("click", startGame);
    startGame(); // Start the game when the page loads
});

function startGame() {
    board = [];
    minePositions = [];
    generateBoard();
    placeMines();
}

function generateBoard() {
    const boardElement = document.getElementById("game-board");
    boardElement.innerHTML = ""; // Clear previous board
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", () => handleClick(i));
        cell.addEventListener("contextmenu", (e) => handleRightClick(e, i));
        boardElement.appendChild(cell);
        board.push(cell);
    }
}

function placeMines() {
    while (minePositions.length < mineCount) {
        let randomIndex = Math.floor(Math.random() * rows * cols);
        if (!minePositions.includes(randomIndex)) {
            minePositions.push(randomIndex);
        }
    }
}

// Handle click on cell
function handleClick(index) {
    const cell = board[index];

    if (minePositions.includes(index)) {
        cell.classList.add("mine");
        const rejectionMessage = getRandomRejectionReason();
        document.getElementById("motivation-msg").textContent = rejectionMessage;
        alert("Game Over! 💥");
        startGame();
    } else {
        cell.classList.add("clicked");
        cell.innerText = getAdjacentMines(index);
        revealedCells++;
        updateStats(); // Update stats whenever a cell is revealed

        // Check if game is completed
        if (revealedCells === totalCells) {
            document.getElementById("motivation-msg").textContent = "Congratulations, you got the job! 🎉";
        }
    }
}

function handleRightClick(event, index) {
    event.preventDefault(); // Prevent the context menu from appearing

    const cell = board[index];

    // Toggle the 'flagged' class on the cell to show/hide the flag
    if (cell.classList.contains("flagged")) {
        cell.classList.remove("flagged"); // Unflag the cell
    } else {
        cell.classList.add("flagged"); // Flag the cell
    }
}

function getAdjacentMines(index) {
    const offsets = [-1, 1, -cols, cols, -cols - 1, -cols + 1, cols - 1, cols + 1];
    return offsets.reduce((count, offset) => {
        const neighborIndex = index + offset;
        return count + (minePositions.includes(neighborIndex) ? 1 : 0);
    }, 0);
}

function updateStats() {
    const currentStageElement = document.getElementById("current-stage");
    const nextStageElement = document.getElementById("next-stage");
    const motivationMsg = document.getElementById("motivation-msg");

    const currentStageIndex = Math.floor(revealedCells / 5); // Every 5 cells, move to the next stage
    const nextStageIndex = Math.min(Math.floor(revealedCells / 5) + 1, stages.length - 1); // The next stage

    currentStageElement.textContent = stages[currentStageIndex];
    nextStageElement.textContent = stages[nextStageIndex];

    // Update motivation message
    if (revealedCells < totalCells) {
        motivationMsg.textContent = "Keep going! You're doing great! 🚀";
    } else {
        motivationMsg.textContent = "Congratulations, you've reached the final stage! 🎉";
    }
}

// Randomly pick a rejection reason
function getRandomRejectionReason() {
    return rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
}