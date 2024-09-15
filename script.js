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
            // 这里，这里
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

    // codeing
    function encodeBase64(text){

        const encoder = new TextEncoder();
        const bytes =encoder.encode(text);

        return btoa(String.fromCharCode(...new Uint8Array(bytes)));
    }

    function decodeBase64(encodedText) {
        
        const decodedBytes=atob(encodedText);
        const byteArray= new Uint8Array([...decodedBytes].map(c => c.charCodeAt(0)));

        const decoder =new TextDecoder();
        
        return decoder.decode(byteArray);
    }

    function showFinalStats() {
        let statsText = `${stats[3].errors || 0},${stats[3].time || 0}@${stats[4].errors || 0},${stats[4].time || 0}@${stats[5].errors || 0},${stats[5].time || 0}`;
        const encodedStatsText=encodeBase64(statsText);

        if (navigator.clipboard) {
            // 使用 Clipboard API 进行复制
            navigator.clipboard.writeText(encodedStatsText.trim())
                .then(() => {
                    alert('游戏完成！已将代码写入剪贴板。[]~(￣▽￣)~*');
                })
                .catch(err => {
                    console.error('代码复制到剪贴板失败:', err);
                    alert('复制到剪贴板失败，请点击确定后手动复制内容。(っ °Д °;)っ');
                    
                    const statsBlock = document.createElement('textarea');
                    statsBlock.value = encodedStatsText.trim();
                    statsBlock.style.position = 'fixed';
                    statsBlock.style.left = '50%';
                    statsBlock.style.top = '50%';
                    statsBlock.style.transform = 'translate(-50%, -50%)';
                    statsBlock.style.width = '90%';
                    statsBlock.style.maxWidth = '600px';
                    statsBlock.style.height = '150px';
                    statsBlock.style.backgroundColor = '#f9f9f9';
                    statsBlock.style.border = '2px solid #007bff';
                    statsBlock.style.borderRadius = '8px';
                    statsBlock.style.padding = '15px';
                    statsBlock.style.fontSize = '16px';
                    statsBlock.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    statsBlock.style.zIndex = '1000';
                    statsBlock.style.overflow = 'auto';
                    statsBlock.style.resize = 'none'; // 防止用户调整大小
                    document.body.appendChild(statsBlock);
                
                    // 添加提示文本
                    const hint = document.createElement('div');
                    hint.textContent = '请将下方的文本复制到剪贴板：';
                    hint.style.position = 'absolute';
                    hint.style.top = '-30px';
                    hint.style.left = '15px';
                    hint.style.fontSize = '18px';
                    hint.style.fontWeight = 'bold';
                    hint.style.color = '#333';
                    statsBlock.parentElement.insertBefore(hint, statsBlock);
                    
                });
        } else {
            // Fallback for browsers that do not support Clipboard API
            const statsBlock = document.createElement('textarea');
            statsBlock.value = encodedStatsText.trim();
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
                alert('复制到剪贴板失败，请点击确定后手动复制内容。(っ °Д °;)っ');
                

                const statsBlock = document.createElement('textarea');
                statsBlock.value = encodedStatsText.trim();
                statsBlock.style.position = 'fixed';
                statsBlock.style.left = '50%';
                statsBlock.style.top = '50%';
                statsBlock.style.transform = 'translate(-50%, -50%)';
                statsBlock.style.width = '90%';
                statsBlock.style.maxWidth = '600px';
                statsBlock.style.height = '150px';
                statsBlock.style.backgroundColor = '#f9f9f9';
                statsBlock.style.border = '2px solid #007bff';
                statsBlock.style.borderRadius = '8px';
                statsBlock.style.padding = '15px';
                statsBlock.style.fontSize = '16px';
                statsBlock.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                statsBlock.style.zIndex = '1000';
                statsBlock.style.overflow = 'auto';
                statsBlock.style.resize = 'none'; // 防止用户调整大小
                document.body.appendChild(statsBlock);
            
                // 添加提示文本
                const hint = document.createElement('div');
                hint.textContent = '请将下方的文本复制到剪贴板：';
                hint.style.position = 'absolute';
                hint.style.top = '-30px';
                hint.style.left = '15px';
                hint.style.fontSize = '18px';
                hint.style.fontWeight = 'bold';
                hint.style.color = '#333';
                statsBlock.parentElement.insertBefore(hint, statsBlock);

    
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
