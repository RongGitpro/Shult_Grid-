// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const startButton = document.getElementById('start-button');
    const errorCountDisplay = document.getElementById('error-count');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');

    // Tracking completion times and error counts for each grid size
    const stats = {
        3: { time: null, errors: 0 },
        4: { time: null, errors: 0 },
        5: { time: null, errors: 0 }
    };

    let timer;
    let startTime;
    let interval;
    let currentNumber = 1;
    let totalCells;
    let errorCount = 0;
    let gridSize = 3; // Initial grid size
    let gameInProgress = false;

    function createGrid(size) {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
        shuffle(numbers);

        totalCells = size * size;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = numbers[i];
            cell.dataset.number = numbers[i];
            cell.addEventListener('click', () => handleClick(cell));
            gridContainer.appendChild(cell);
        }

        // Ensure cells are square
        const cellSize = 100 / size;
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style.paddingTop = `${cellSize}%`;
        });

        // Disable clicks until the game starts
        gridContainer.classList.add('disabled');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleClick(cell) {
        if (!gameInProgress) return; // Ignore clicks if game is not in progress
        
        if (parseInt(cell.dataset.number) === currentNumber) {
            cell.classList.add('active');
            currentNumber++;
            if (currentNumber > totalCells) {
                clearInterval(interval);
                stats[gridSize].time = Math.floor((Date.now() - startTime) / 1000);
                stats[gridSize].errors = errorCount;
                updateStatsDisplay();
                setTimeout(() => {
                    // Automatically move to the next grid size
                    gridSize++;
                    if (gridSize > 5) {
                        showFinalStats(); // Show final stats if all sizes are completed
                    } else {
                        startGame(); // Restart game with new grid size
                    }
                }, 1000); // Delay to show completion
            }
        } else {
            cell.classList.add('error');
            errorCount++;
            errorCountDisplay.textContent = errorCount;
            setTimeout(() => cell.classList.remove('error'), 500); // Remove error class after 500ms
        }

        // Flash effect for the start button
        startButton.classList.add('button-flash');
        setTimeout(() => startButton.classList.remove('button-flash'), 500); // Remove flash effect after 0.5s
    }

    function startTimer() {
        startTime = Date.now();
        interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            elapsedTimeDisplay.textContent = elapsed + '秒';
        }, 1000);
    }

    function startGame() {
        createGrid(gridSize);
        currentNumber = 1; // Reset to 1
        errorCount = 0; // Reset error count
        errorCountDisplay.textContent = errorCount;
        elapsedTimeDisplay.textContent = '0秒';
        clearInterval(interval);
        startTimer();
        gameInProgress = true; // Set game in progress

        // Enable clicks
        gridContainer.classList.remove('disabled');
    }

    function updateStatsDisplay() {
        document.getElementById(`time-${gridSize}`).textContent = stats[gridSize].time ? `${stats[gridSize].time}秒` : '--';
        document.getElementById(`errors-${gridSize}`).textContent = stats[gridSize].errors;
    }

    function showFinalStats() {
        alert('所有方格大小的测试完成！请查看下表以了解每个方格大小的完成时间和错误次数。');
        gameInProgress = false; // End the game
    }

    startButton.addEventListener('click', () => {
        if (!gameInProgress) {
            startGame();
        }
    });

    // Initialize default grid
    createGrid(gridSize);
});
