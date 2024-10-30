const canvas = document.getElementById("laberintoCanvas");
const ctx = canvas.getContext("2d");
let cellSize = 30; 
let rows = 15; 
let cols = 15; 
canvas.width = cellSize * cols;
canvas.height = cellSize * rows;

let playerX = 1;
let playerY = 1;
let visitedCells = new Set();

const generateMaze = () => {
    let maze = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1));

    const carveMaze = (x, y) => {
        let directions = [
            [0, -2],
            [2, 0],
            [0, 2],
            [-2, 0],
        ].sort(() => Math.random() - 0.5);
        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[y + dy / 2][x + dx / 2] = 0;
                carveMaze(nx, ny);
            }
        }
    };

    maze[1][1] = 0;
    carveMaze(1, 1);
    maze[rows - 2][cols - 2] = 0; // Salida
    return maze;
};

let maze = generateMaze();

const drawMaze = () => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#555" : "#222";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
};

const drawPlayer = () => {
    ctx.fillStyle = "#FFD700"; // Color del jugador (cubo)
    ctx.fillRect(playerX * cellSize, playerY * cellSize, cellSize, cellSize);
};

const drawPath = () => {
    ctx.fillStyle = "#32CD32"; // Color del recorrido
    for (let cell of visitedCells) {
        const [x, y] = cell.split(",").map(Number);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
};

// Nueva función para dibujar la meta
const drawGoal = () => {
    ctx.fillStyle = "#FF4500"; // Color del cubo de la meta
    ctx.fillRect((cols - 2) * cellSize, (rows - 2) * cellSize, cellSize, cellSize);
};

const movePlayer = (dx, dy) => {
    const newX = playerX + dx;
    const newY = playerY + dy;
    if (
        newX >= 0 &&
        newY >= 0 &&
        newX < cols &&
        newY < rows &&
        maze[newY][newX] === 0
    ) {
        playerX = newX;
        playerY = newY;
        visitedCells.add(`${playerX},${playerY}`);
        drawMaze();
        drawPath();
        drawPlayer();
        drawGoal(); // Dibuja la meta

        // Verifica si ha llegado a la meta
        if (playerX === cols - 2 && playerY === rows - 2) {
            alert("¡Has alcanzado la meta!");
            resetGame();
        }
    }
};

const resetGame = () => {
    playerX = 1;
    playerY = 1;
    visitedCells.clear();
    maze = generateMaze();
    drawMaze();
    drawPlayer();
    drawGoal(); // Dibuja la meta en el nuevo laberinto
};

const startGame = (difficulty) => {
    if (difficulty === 'easy') {
        cellSize = 43; // Tamaño de celda para fácil
        rows = 15;
        cols = 15;
    } else if (difficulty === 'medium') {
        cellSize = 25; // Tamaño de celda para medio
        rows = 25;
        cols = 25;
    } else {
        cellSize = 19; 
        rows = 33;
        cols = 33;
    }

    canvas.width = cellSize * cols;
    canvas.height = cellSize * rows;
    resetGame();
};

document.getElementById("playButton").addEventListener("click", () => {
    const modeSelect = document.getElementById("modeSelect");
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame(modeSelect.value);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});

function showInstructions() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("info").style.display = "block";
    document.getElementById("info-title").innerText = "Instrucciones";
    document.getElementById("info-content").innerText = "Usa las flechas para mover el cubo a través del laberinto hasta alcanzar la meta.";
}

function showCredits() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("info").style.display = "block";
    document.getElementById("info-title").innerText = "Créditos";
    document.getElementById("info-content").innerText = "Thomas Requena & David González";
}

function returnToMenu() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("menu").style.display = "block"; 
    document.getElementById("info").style.display = "none"; 
}

function showOptionsMenu() {
    document.getElementById("options-menu").style.display = "block";
}

function changeDifficulty() {
    const difficultySelect = document.getElementById("difficultySelect");
    const selectedDifficulty = difficultySelect.value;
    startGame(selectedDifficulty);
    document.getElementById("options-menu").style.display = "none";
}

function resumeGame() {
    document.getElementById("options-menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
}

function closeOptionsMenu() {
    document.getElementById("options-menu").style.display = "none"; 
}


document.getElementById("backButton").addEventListener("click", returnToMenu);
