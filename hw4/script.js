const config = {
    boardSize: 12,
    mineCount: 20,
};

const state = {
    board: [],
    gameOver: false,
    isFirstClick: true,
    selectedCell: { row: 0, col: 0 },
};

function createEmptyBoard(size) {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
            mine: false,
            open: false,
            flag: false,
            adjacentMines: 0,
        }))
    );
}

function initializeGameBoard() {
    state.board = createEmptyBoard(config.boardSize);
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = '';

    for (let row = 0; row < config.boardSize; row++) {
        for (let col = 0; col < config.boardSize; col++) {
            const cell = createCellElement(row, col);
            boardContainer.appendChild(cell);
        }
    }

    placeMines();
    calculateAdjacentMines();
    highlightSelectedCell();
}

function createCellElement(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener('click', () => handleCellClick(row, col));
    cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(row, col);
    });
    return cell;
}

function placeMines() {
    let placed = 0;
    while (placed < config.mineCount) {
        const row = randomInt(config.boardSize);
        const col = randomInt(config.boardSize);

        if (!state.board[row][col].mine) {
            state.board[row][col].mine = true;
            placed++;
        }
    }
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function calculateAdjacentMines() {
    for (let row = 0; row < config.boardSize; row++) {
        for (let col = 0; col < config.boardSize; col++) {
            if (!state.board[row][col].mine) {
                state.board[row][col].adjacentMines = countMinesAround(row, col);
            }
        }
    }
}

function countMinesAround(row, col) {
    return getNeighbors(row, col).reduce(
        (count, { r, c }) => count + (state.board[r][c].mine ? 1 : 0),
        0
    );
}

function getNeighbors(row, col) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < config.boardSize && c >= 0 && c < config.boardSize) {
                neighbors.push({ r, c });
            }
        }
    }
    return neighbors;
}

function handleCellClick(row, col) {
    if (state.gameOver || state.board[row][col].open || state.board[row][col].flag) return;

    if (state.isFirstClick) {
        state.isFirstClick = false;
        avoidMineOnFirstClick(row, col);
        calculateAdjacentMines();
    }

    openCell(row, col);
    checkForWin();
}

function avoidMineOnFirstClick(row, col) {
    do {
        state.board = createEmptyBoard(config.boardSize);
        placeMines();
    } while (state.board[row][col].mine || isCellSurroundedByMines(row, col));
}

function isCellSurroundedByMines(row, col) {
    return getNeighbors(row, col).every(({ r, c }) => state.board[r][c].mine);
}

function openCell(row, col) {
    const cellData = state.board[row][col];
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cellData.open) return;

    cellData.open = true;
    cellElement.classList.add('open');

    if (cellData.mine) {
        cellElement.textContent = '💣';
        cellElement.classList.add('mine');
        endGame(false);
    } else if (cellData.adjacentMines > 0) {
        cellElement.textContent = cellData.adjacentMines;
    } else {
        getNeighbors(row, col).forEach(({ r, c }) => openCell(r, c));
    }
}

function toggleFlag(row, col) {
    const cellData = state.board[row][col];
    if (cellData.open || state.gameOver) return;

    cellData.flag = !cellData.flag;
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.textContent = cellData.flag ? '🚩' : '';
    cellElement.classList.toggle('flag', cellData.flag);
}

function checkForWin() {
    const { boardSize, mineCount } = config;
    const totalCells = boardSize * boardSize;
    const openCells = state.board.flat().filter(cell => cell.open).length;
    const correctlyFlaggedMines = state.board.flat().filter(cell => cell.mine && cell.flag).length;

    if (openCells + mineCount === totalCells || correctlyFlaggedMines === mineCount) {
        endGame(true);
    }
}

function endGame(win) {
    state.gameOver = true;
    alert(win ? 'Вы выиграли!' : 'Вы проиграли!');
}

function highlightSelectedCell() {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('selected'));
    const { row, col } = state.selectedCell;
    const selected = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (selected) selected.classList.add('selected');
}

function moveCursor(rowDelta, colDelta) {
    const { row, col } = state.selectedCell;
    state.selectedCell = {
        row: (row + rowDelta + config.boardSize) % config.boardSize,
        col: (col + colDelta + config.boardSize) % config.boardSize,
    };
    highlightSelectedCell();
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && [' ', 'Enter'].includes(e.key)) {
        toggleFlag(state.selectedCell.row, state.selectedCell.col);
    } else {
        const moves = {
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
        };

        if (moves[e.key]) {
            moveCursor(...moves[e.key]);
        } else if ([' ', 'Enter'].includes(e.key)) {
            handleCellClick(state.selectedCell.row, state.selectedCell.col);
        }
    }
});

initializeGameBoard();