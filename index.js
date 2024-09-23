let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let welcomeScreen = document.getElementById("welcome-screen");
let modeSelection = document.getElementById("mode-selection");
let gameContainer = document.getElementById("game-container");
let startBtn = document.getElementById("start-btn");
let pvpBtn = document.getElementById("pvp-btn");
let pveBtn = document.getElementById("pve-btn");

let turno; // true for X, false for O (AI)
let moves;
const winPattern = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

let isAI; // True if Player vs AI, false for Player vs Player
let playerStarts = true; // Track who starts the game

// Start game button click event
startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hide");
    modeSelection.classList.remove("hide");
});

// Select Player vs Player
pvpBtn.addEventListener("click", () => {
    isAI = false;
    modeSelection.classList.add("hide");
    gameContainer.classList.remove("hide");
    initGame();
});

// Select Player vs AI
pveBtn.addEventListener("click", () => {
    isAI = true;
    modeSelection.classList.add("hide");
    gameContainer.classList.remove("hide");
    initGame();
});

// Initialize the game
function initGame() {
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    moves = 0;
    msgContainer.classList.add("hide");
    resetBtn.classList.add("hide"); // Hide reset button at the start

    turno = playerStarts; // Set the starting player

    // Clear previous event listeners to avoid stacking
    boxes.forEach(box => {
        box.removeEventListener("click", playerMovePVP);
        box.removeEventListener("click", playerMovePVE);
        if (isAI) {
            box.addEventListener("click", (event) => playerMovePVE(event.target));
        } else {
            box.addEventListener("click", (event) => playerMovePVP(event.target));
        }
    });

    // If AI mode and it's AI's turn, let AI start if required
    if (isAI && !playerStarts) {
        aiStarts();
    }
}

// AI starts the game
function aiStarts() {
    turno = false; // AI starts first
    aiMove();
}

// Player vs Player move function
function playerMovePVP(box) {
    if (box.innerText === "" && moves < 9) {
        box.innerText = turno ? "X" : "O"; // Set the symbol based on the turn
        box.disabled = true; 
        moves++;
        checkWinner();
        if (moves === 1) {
            resetBtn.classList.remove("hide"); // Show reset button after the first move
        }
        turno = !turno; // Switch turn after player move
    }
}

// Player vs AI move function
function playerMovePVE(box) {
    if (box.innerText === "" && moves < 9) {
        box.innerText = "X"; // Player is always X
        box.disabled = true; 
        moves++;
        checkWinner();
        if (moves === 1) {
            resetBtn.classList.remove("hide"); // Show reset button after the first move
        }

        if (moves < 9) {
            turno = false; // Set to AI's turn
            setTimeout(aiMove, 500); 
        }
    }
}

// AI move logic
function aiMove() {
    if (moves >= 9) return; // Prevent AI from moving after game ends

    let availableBoxes = [...boxes].filter(box => box.innerText === "");

    // Check for winning move
    for (let pattern of winPattern) {
        const [a, b, c] = pattern;
        if (boxes[a].innerText === "O" && boxes[b].innerText === "O" && boxes[c].innerText === "") {
            boxes[c].innerText = "O";
            boxes[c].disabled = true;
            moves++;
            checkWinner();
            return;
        }
        if (boxes[a].innerText === "O" && boxes[c].innerText === "O" && boxes[b].innerText === "") {
            boxes[b].innerText = "O";
            boxes[b].disabled = true;
            moves++;
            checkWinner();
            return;
        }
        if (boxes[b].innerText === "O" && boxes[c].innerText === "O" && boxes[a].innerText === "") {
            boxes[a].innerText = "O";
            boxes[a].disabled = true;
            moves++;
            checkWinner();
            return;
        }
    }

    // Check for blocking move
    for (let pattern of winPattern) {
        const [a, b, c] = pattern;
        if (boxes[a].innerText === "X" && boxes[b].innerText === "X" && boxes[c].innerText === "") {
            boxes[c].innerText = "O";
            boxes[c].disabled = true;
            moves++;
            checkWinner();
            return;
        }
        if (boxes[a].innerText === "X" && boxes[c].innerText === "X" && boxes[b].innerText === "") {
            boxes[b].innerText = "O";
            boxes[b].disabled = true;
            moves++;
            checkWinner();
            return;
        }
        if (boxes[b].innerText === "X" && boxes[c].innerText === "X" && boxes[a].innerText === "") {
            boxes[a].innerText = "O";
            boxes[a].disabled = true;
            moves++;
            checkWinner();
            return;
        }
    }

    // Random move if no winning or blocking moves
    if (availableBoxes.length > 0) {
        let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        randomBox.innerText = "O"; // AI plays O
        randomBox.disabled = true;
        moves++;
        checkWinner();
    }

    // Show reset button after AI's first move
    if (moves === 1) {
        resetBtn.classList.remove("hide"); // Show reset button after the first move
    }

    turno = true; // Switch turn back to player after AI move
}

// Disables all boxes
const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

// Show winner message
const showWinner = (winner) => {
    msg.innerText = `Congratulations, ${winner} wins!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    resetBtn.classList.add("hide"); // Hide reset button when there's a winner
};

// Check for a tie
const checkTie = () => {
    if (moves === 9) {
        msg.innerText = "It's a tie!";
        msgContainer.classList.remove("hide");
        resetBtn.classList.add("hide"); // Hide reset button in case of a tie
    }
};

// Check for a winner
const checkWinner = () => {
    for (let pattern of winPattern) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            showWinner(boxes[a].innerText);
            return;
        }
    }
    checkTie(); 
};

// Reset game functionality
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

function resetGame() {
    playerStarts = !playerStarts; // Toggle starting player on reset
    initGame(); // Initialize the game
    msgContainer.classList.add("hide"); // Hide the message container
}
