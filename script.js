
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const startButton = document.getElementById('start-button');
    const errorCountDisplay = document.getElementById('error-count');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');

    const stats = {
        3: { time: null, errors: 0 },
        4: { time: null, errors: 0 },
        5: { time: null, errors: 0 }
    };

    let timer, startTime, interval, currentNumber = 1, totalCells, errorCount = 0, gridSize = 3, gameInProgress = false;

    function createGrid(size) {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
        shuffle(numbers);

        totalCells = size * size;
        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = number;
            cell.dataset.number = number;
            cell.addEventListener('click', () => handleClick(cell));
            gridContainer.appendChild(cell);
        });

        const cellSize = 100 / size;
        document.querySelectorAll('.grid-cell').forEach(cell => cell.style.paddingTop = `${cellSize}%`);
        gridContainer.classList.add('disabled');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleClick(cell) {
        if (!gameInProgress) return;

        if (parseInt(cell.dataset.number) === currentNumber) {
            cell.classList.add('active');
            currentNumber++;
            if (currentNumber > totalCells) {
                endGame();
            }
        } else {
            cell.classList.add('error');
            errorCount++;
            errorCountDisplay.textContent = errorCount;
            setTimeout(() => cell.classList.remove('error'), 500);
        }

        startButton.classList.add('button-flash');
        setTimeout(() => startButton.classList.remove('button-flash'), 500);
    }

    function startTimer() {
        startTime = Date.now();
        interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            elapsedTimeDisplay.textContent = `${elapsed}秒`;
        }, 1000);
    }

    function startGame() {
        createGrid(gridSize);
        currentNumber = 1;
        errorCount = 0;
        errorCountDisplay.textContent = errorCount;
        elapsedTimeDisplay.textContent = '0秒';
        clearInterval(interval);
        startTimer();
        gameInProgress = true;
        gridContainer.classList.remove('disabled');
    }

    function endGame() {
        clearInterval(interval);
        stats[gridSize].time = Math.floor((Date.now() - startTime) / 1000);
        stats[gridSize].errors = errorCount;
        updateStatsDisplay();
        setTimeout(() => {
            gridSize++;
            if (gridSize > 5) {
                showFinalStats();
            } else {
                startGame();
            }
        }, 1000);
    }

    function updateStatsDisplay() {
        errorCountDisplay.textContent = stats[gridSize].errors;
        elapsedTimeDisplay.textContent = stats[gridSize].time ? `${stats[gridSize].time}秒` : '0秒';
    }

    // function showFinalStats() {
    //     const statsText = `fit@${stats[3].errors || 0},${stats[3].time || 0}sec@${stats[4].errors || 0},${stats[4].time || 0}thir@${stats[5].errors || 0},${stats[5].time || 0}`;
        
    //     const statsBlock = document.createElement('textarea');
    //     statsBlock.value = statsText.trim();
    //     statsBlock.style.position = 'absolute';
    //     statsBlock.style.left = '-9999px';
    //     document.body.appendChild(statsBlock);
    //     statsBlock.select();
    //     document.execCommand('copy');
    //     document.body.removeChild(statsBlock);

    //     alert('游戏完成！已将每次游戏的错误次数和完成时间复制到剪贴板。');
    //     gameInProgress = false;
    // }

    // startButton.addEventListener('click', () => {
    //     if (!gameInProgress) startGame();
    // });

    // createGrid(gridSize);

    function showFinalStats() {
        const statsText = `fit@${stats[3].errors || 0},${stats[3].time || 0}sec@${stats[4].errors || 0},${stats[4].time || 0}thir@${stats[5].errors || 0},${stats[5].time || 0}`;

        if (navigator.clipboard) {
            // 使用 Clipboard API 进行复制
            navigator.clipboard.writeText(statsText.trim())
                .then(() => {
                    alert('游戏完成！已将每次游戏的错误次数和完成时间复制到剪贴板。');
                })
                .catch(err => {
                    console.error('复制到剪贴板失败:', err);
                    alert('复制到剪贴板失败，请手动复制内容。');
                    
                    const statsBlock = document.createElement('textarea');
                    statsBlock.value = statsText.trim();
                    statsBlock.style.position = 'fixed';
                    statsBlock.style.left = '0';
                    statsBlock.style.top = '0';
                    statsBlock.style.width = '100%';
                    statsBlock.style.height = '100px';
                    statsBlock.style.backgroundColor = '#fff';
                    statsBlock.style.border = '1px solid #ddd';
                    statsBlock.style.padding = '10px';
                    statsBlock.style.zIndex = '1000';
                    statsBlock.style.overflow = 'auto';
                    statsBlock.style.resize = 'none'; // 防止用户调整大小
                    document.body.appendChild(statsBlock);
                    statsBlock.select();
                });
        } else {
            // Fallback for browsers that do not support Clipboard API
            const statsBlock = document.createElement('textarea');
            statsBlock.value = statsText.trim();
            statsBlock.style.position = 'absolute';
            statsBlock.style.left = '-9999px';
            document.body.appendChild(statsBlock);
            statsBlock.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? '成功' : '失败';
                console.log('复制到剪贴板:', msg);
            } catch (err) {
                console.error('复制到剪贴板失败:', err);
                alert('复制到剪贴板失败，请手动复制内容。');
                
                const statsBlock = document.createElement('textarea');
                statsBlock.value = statsText.trim();
                statsBlock.style.position = 'fixed';
                statsBlock.style.left = '0';
                statsBlock.style.top = '0';
                statsBlock.style.width = '100%';
                statsBlock.style.height = '100px';
                statsBlock.style.backgroundColor = '#fff';
                statsBlock.style.border = '1px solid #ddd';
                statsBlock.style.padding = '10px';
                statsBlock.style.zIndex = '1000';
                statsBlock.style.overflow = 'auto';
                statsBlock.style.resize = 'none'; // 防止用户调整大小
                document.body.appendChild(statsBlock);
                statsBlock.select();
            }
            document.body.removeChild(statsBlock);
        }
    
        gameInProgress = false; // 结束游戏
    }
        startButton.addEventListener('click', () => {
        if (!gameInProgress) startGame();
    });

    createGrid(gridSize);

});
