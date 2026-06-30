document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const turnIndicator = document.getElementById('turn-indicator');
    const modePvpBtn = document.getElementById('mode-pvp');
    const modePvaiBtn = document.getElementById('mode-pvai');
    const resetBtn = document.getElementById('reset-btn');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close');
    const scoreXElement = document.querySelector('#score-x .score');
    const scoreOElement = document.querySelector('#score-o .score');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let vsAI = false;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function init() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        resetBtn.addEventListener('click', restartGame);
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            restartGame();
        });

        modePvpBtn.addEventListener('click', () => setMode(false));
        modePvaiBtn.addEventListener('click', () => setMode(true));

        updateTurnIndicator();
    }

    function setMode(isAI) {
        if (vsAI === isAI) return;
        vsAI = isAI;
        modePvpBtn.classList.toggle('active', !isAI);
        modePvaiBtn.classList.toggle('active', isAI);
        scores = { X: 0, O: 0 };
        updateScores();
        restartGame();
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (board[index] !== '' || !gameActive) return;

        makeMove(index, currentPlayer);

        if (gameActive && vsAI && currentPlayer === 'O') {
            setTimeout(makeAIMove, 400);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('occupied');

        checkWinCondition();

        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnIndicator();
        }
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = `${currentPlayer}'s Turn`;
        turnIndicator.style.color = currentPlayer === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
        turnIndicator.style.textShadow = currentPlayer === 'X' ? '0 0 10px rgba(56, 189, 248, 0.4)' : '0 0 10px rgba(244, 114, 182, 0.4)';
    }

    function updateScores() {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
    }

    function checkWinCondition() {
        let roundWon = false;
        let winningCells = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningCells = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            announceWin(currentPlayer, winningCells);
            gameActive = false;
            return;
        }

        if (!board.includes('')) {
            announceDraw();
            gameActive = false;
            return;
        }
    }

    function announceWin(player, winningCells) {
        scores[player]++;
        updateScores();

        winningCells.forEach(index => {
            cells[index].classList.add('winning-cell');
        });

        setTimeout(() => {
            modalMessage.textContent = `Player ${player} Wins!`;
            modalMessage.style.color = player === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
            modal.classList.remove('hidden');
        }, 500);
    }

    function announceDraw() {
        setTimeout(() => {
            modalMessage.textContent = 'Game Ended in a Draw!';
            modalMessage.style.color = 'var(--text-main)';
            modal.classList.remove('hidden');
        }, 500);
    }

    function restartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        modal.classList.add('hidden');
        updateTurnIndicator();
    }

    function makeAIMove() {
        if (!gameActive) return;

        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        if (move !== undefined) {
            makeMove(move, 'O');
        }
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWinnerForMinimax();
        if (result !== null) {
            if (result === 'O') return 10 - depth;
            if (result === 'X') return depth - 10;
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinnerForMinimax() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes('')) {
            return 'tie';
        }
        return null;
    }

    init();
});
