const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
const humanPlayer = 'X';
const aiPlayer = 'O';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWin(board, player) {
    return winningCombinations.some(combination => 
        combination.every(index => board[index] === player)
    );
}

function checkTie(board) {
    return board.every(cell => cell !== '');
}

function minimax(newBoard, player) {
    let availSpots = newBoard.reduce((acc, cell, index) => 
        cell === '' ? acc.concat(index) : acc, []);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

function makeMove(index, player) {
    board[index] = player;
    document.getElementById(`cell-${index}`).textContent = player;

    if (checkWin(board, player)) {
        alert(`${player} wins!`);
        resetGame();
    } else if (checkTie(board)) {
        alert('Tie game!');
        resetGame();
    } else {
        currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
        if (currentPlayer === aiPlayer) {
            const bestMove = minimax(board, aiPlayer);
            makeMove(bestMove.index, aiPlayer);
        }
    }
}

function handleCellClick(event) {
    const index = Array.from(cells).indexOf(event.target);
    if (board[index] === '') {
        makeMove(index, currentPlayer);
    }
}

function resetGame() {
    board.fill('');
    cells.forEach(cell => (cell.textContent = ''));
    currentPlayer = humanPlayer;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', resetGame);
