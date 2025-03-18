const rows = 10;
const cols = 10;
const mineCount = 10;
let board = [];
let minePositions = [];

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
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", () => handleClick(i)); // ✅ Properly attach click event
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

function handleClick(index) {
    const cell = board[index];

    if (minePositions.includes(index)) {
        cell.classList.add("mine");
        alert("Game Over! 💥");
        startGame();
    } else {
        cell.classList.add("clicked");
        cell.innerText = getAdjacentMines(index);
    }
}

function getAdjacentMines(index) {
    const offsets = [-1, 1, -cols, cols, -cols - 1, -cols + 1, cols - 1, cols + 1];
    return offsets.reduce((count, offset) => {
        const neighborIndex = index + offset;
        return count + (minePositions.includes(neighborIndex) ? 1 : 0);
    }, 0);
}
