// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const startButton = document.getElementById('start-button');
    const errorCountDisplay = document.getElementById('error-count');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');

    // 跟踪每个方格大小的完成时间和错误次数
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
    let gridSize = 3; // 初始方格大小
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

        // 确保单元格是正方形
        const cellSize = 100 / size;
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style.paddingTop = `${cellSize}%`;
        });

        // 禁用点击，直到游戏开始
        gridContainer.classList.add('disabled');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleClick(cell) {
        if (!gameInProgress) return; // 如果游戏未开始，则忽略点击
        
        if (parseInt(cell.dataset.number) === currentNumber) {
            cell.classList.add('active');
            currentNumber++;
            if (currentNumber > totalCells) {
                clearInterval(interval);
                stats[gridSize].time = Math.floor((Date.now() - startTime) / 1000);
                stats[gridSize].errors = errorCount;
                updateStatsDisplay();
                setTimeout(() => {
                    // 自动进入下一个方格大小
                    gridSize++;
                    if (gridSize > 5) {
                        showFinalStats(); // 如果所有大小都完成，显示最终统计
                    } else {
                        startGame(); // 用新的方格大小重启游戏
                    }
                }, 1000); // 显示完成的延迟
            }
        } else {
            cell.classList.add('error');
            errorCount++;
            errorCountDisplay.textContent = errorCount;
            setTimeout(() => cell.classList.remove('error'), 500); // 500毫秒后移除错误类
        }

        // 开始按钮的闪光效果
        startButton.classList.add('button-flash');
        setTimeout(() => startButton.classList.remove('button-flash'), 500); // 0.5秒后移除闪光效果
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
        currentNumber = 1; // 重置为1
        errorCount = 0; // 重置错误计数
        errorCountDisplay.textContent = errorCount;
        elapsedTimeDisplay.textContent = '0秒';
        clearInterval(interval);
        startTimer();
        gameInProgress = true; // 游戏进行中

        // 启用点击
        gridContainer.classList.remove('disabled');
    }

    function updateStatsDisplay() {
        errorCountDisplay.textContent = stats[gridSize].errors;
        elapsedTimeDisplay.textContent = stats[gridSize].time ? `${stats[gridSize].time}秒` : '0秒';
    }

    function showFinalStats() {
        // 生成统计文本
        const statsText = `
        fit@${stats[3].errors || 0},${stats[3].time || 0}
        sec@${stats[4].errors || 0},${stats[4].time || 0}
        thir@${stats[5].errors || 0},${stats[5].time || 0}
        `;
        
        // 创建并显示可以复制的文本块
        const statsBlock = document.createElement('textarea');
        statsBlock.value = statsText.trim();
        statsBlock.style.position = 'absolute';
        statsBlock.style.left = '-9999px'; // 移出视图
        document.body.appendChild(statsBlock);
        statsBlock.select();
        document.execCommand('copy');
        document.body.removeChild(statsBlock);
        
        // 显示用户消息
        alert('游戏完成！已将每次游戏的错误次数和完成时间复制到剪贴板。');

        gameInProgress = false; // 结束游戏
    }

    startButton.addEventListener('click', () => {
        if (!gameInProgress) {
            startGame();
        }
    });

    // 初始化默认方格
    createGrid(gridSize);
});
