// --- KONFIGURASI & STATE ---
const BOARD_SIZE = 5;
const ROWS = ['A', 'B', 'C', 'D', 'E'];
let board = []; 
let currentMode = 'editor'; 
let activeRecommendation = null; 

let selRow = 0;
let selCol = 0;

let lastKey = '';
let lastKeyTime = 0;
let lastProcessedKey = '';
let lastProcessedTime = 0;

function initBoard() {
    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    renderGrid();
}

function renderGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            const coord = `${ROWS[r]}${c + 1}`;
            cell.className = 'cell';
            cell.dataset.coord = coord;
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (r === selRow && c === selCol && currentMode === 'editor') {
                cell.classList.add('selected');
            }

            if (activeRecommendation && activeRecommendation.from.r === r && activeRecommendation.from.c === c) {
                cell.classList.add('recommend-action');
            }

            const level = board[r][c];
            if (level > 0) {
                cell.classList.add(`lv-${level}`);
                cell.textContent = level;
            }

            cell.onclick = () => handleCellClick(r, c);
            gridElement.appendChild(cell);
        }
    }
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('mode-editor').classList.toggle('active', mode === 'editor');
    document.getElementById('mode-solve').classList.toggle('active', mode === 'solve');
    
    const status = document.getElementById('status-text');
    const inst = document.getElementById('input-instructions');
    
    if (mode === 'editor') {
        status.textContent = "Klik kotak di grid, lalu mulai ketik angka.";
        if(inst) inst.style.opacity = '1';
    } else {
        status.textContent = "Mode AI: Klik 'Cari Langkah Terbaik'.";
        if(inst) inst.style.opacity = '0.5';
        clearHighlights();
    }
    renderGrid(); 
}

function handleCellClick(r, c) {
    // Cek rekomendasi AI
    if (activeRecommendation && activeRecommendation.from.r === r && activeRecommendation.from.c === c) {
        if (activeRecommendation.type === 'upgrade') {
            board[r][c] += 1;
        } else if (activeRecommendation.type === 'discard') {
            board[r][c] = 0;
            applyGravity(board);
        }

        resolveMerges(board);
        activeRecommendation = null;
        clearHighlights();
        setMode('editor');
        
        const recBox = document.getElementById('recommendation');
        recBox.innerHTML = `<h4>Saran Diterapkan!</h4><p>Langkah telah disimulasikan. Silakan input tile baru yang muncul di game asli Anda.</p>`;
        document.getElementById('status-text').textContent = "Saran diterapkan. Silakan input tile baru.";
        
        renderGrid();
        return;
    }

    // Mode Editor Biasa
    if (currentMode === 'editor') {
        selRow = r;
        selCol = c;
        
        // PENTING UNTUK MOBILE: Fokuskan input tersembunyi
        const mobileInput = document.getElementById('mobile-input');
        mobileInput.value = ''; // Reset value agar bisa menerima input baru
        
        // Trik Paksa Buka Keyboard di Mobile
        mobileInput.focus();
        // Timeout kecil membantu browser mobile menyadari ada event klik
        setTimeout(() => {
            mobileInput.focus();
        }, 50);
        
        renderGrid(); 
    }
}

function advanceCursor() {
    if (selCol < BOARD_SIZE - 1) {
        selCol++; 
    } else {
        selCol = 0; 
        if (selRow < BOARD_SIZE - 1) {
            selRow++; 
        }
    }
}

// Fungsi bantuan untuk memproses input
let isProcessingInput = false;

function processInput(key) {
    const now = Date.now();

    // [FIX MUTLAK] Jika tombol yang sama ditekan dalam waktu < 150ms, abaikan.
    // Ini mencegah bug 1 ketukan di HP yang memicu event keydown + input sekaligus.
    if (key === lastProcessedKey && (now - lastProcessedTime) < 150) {
        return; 
    }
    lastProcessedKey = key;
    lastProcessedTime = now;

    if (key === 'Backspace' || key === 'Delete' || key.toLowerCase() === 'x') {
        board[selRow][selCol] = 0;
        lastKey = '';
    } 
    else if (key >= '1' && key <= '9') {
        if (lastKey === '1' && key === '0' && (now - lastKeyTime) < 300) {
            board[selRow][selCol] = 10;
            lastKey = ''; 
            advanceCursor(); 
        } else {
            board[selRow][selCol] = parseInt(key);
            lastKey = key;
            lastKeyTime = now;
            advanceCursor(); 
        }
    }
    else if (key === '0') {
        board[selRow][selCol] = 10;
        lastKey = '';
        advanceCursor(); 
    }
    renderGrid();
}

const mobileInput = document.getElementById('mobile-input');

// 1. Event Listener KHUSUS INPUT TERSEMBUNYI (Menangani Ketikan Angka)
mobileInput.addEventListener('input', function(e) {
    if (currentMode !== 'editor') return;
    
    let val = this.value;
    if (val.length > 0) {
        let char = val[val.length - 1]; 
        processInput(char);
        this.value = ''; // Langsung kosongkan setelah diproses
    }
});

// 2. Event Listener KHUSUS INPUT TERSEMBUNYI (Navigasi & Hapus saat fokus)
mobileInput.addEventListener('keydown', function(e) {
    if (currentMode !== 'editor') return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
        if (this.value === '') {
            processInput('Backspace');
            e.preventDefault(); // Mencegah browser kembali ke halaman sebelumnya
        }
    } else if (e.key === 'ArrowRight') { selCol = Math.min(selCol + 1, 4); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowLeft') { selCol = Math.max(selCol - 1, 0); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowDown' || e.key === 'Enter') { selRow = Math.min(selRow + 1, 4); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowUp') { selRow = Math.max(selRow - 1, 0); e.preventDefault(); renderGrid(); }
    else if (e.key.toLowerCase() === 'x') {
        processInput('x');
        e.preventDefault();
    }
});

// 3. Event Listener GLOBAL (Hanya sebagai Fallback jika input tidak fokus)
document.addEventListener('keydown', (e) => {
    if (currentMode !== 'editor') return;
    
    // KUNCI PERBAIKAN: Jika event berasal dari mobile-input, ABAIKAN!
    // Karena sudah ditangani oleh listener di atas.
    if (document.activeElement === document.getElementById('mobile-input')) return;

    if (e.key === 'ArrowRight') { selCol = Math.min(selCol + 1, 4); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowLeft') { selCol = Math.max(selCol - 1, 0); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowDown' || e.key === 'Enter') { selRow = Math.min(selRow + 1, 4); e.preventDefault(); renderGrid(); }
    else if (e.key === 'ArrowUp') { selRow = Math.max(selRow - 1, 0); e.preventDefault(); renderGrid(); }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'x' || (e.key >= '0' && e.key <= '9')) {
        processInput(e.key);
    }
});

function clearBoard() {
    selRow = 0; selCol = 0; lastKey = ''; 
    activeRecommendation = null;
    initBoard(); 
    document.getElementById('status-text').textContent = "Papan berhasil dibersihkan.";
    document.getElementById('recommendation').innerHTML = "<h4>Menunggu Analisis...</h4><p>Isi papan terlebih dahulu, lalu klik tombol di atas.</p>";
    clearHighlights();
}

function clearHighlights() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('recommend-action');
    });
}

// --- LOGIKA GAME ---
function findClusters(b) {
    const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    const clusters = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (b[r][c] > 0 && !visited[r][c]) {
                const level = b[r][c];
                const cluster = [];
                const queue = [{ r, c }];
                visited[r][c] = true;
                while (queue.length > 0) {
                    const { r: currR, c: currC } = queue.shift();
                    cluster.push({ r: currR, c: currC });
                    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    for (const [dr, dc] of dirs) {
                        const nr = currR + dr;
                        const nc = currC + dc;
                        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                            if (!visited[nr][nc] && b[nr][nc] === level) {
                                visited[nr][nc] = true;
                                queue.push({ r: nr, c: nc });
                            }
                        }
                    }
                }
                if (cluster.length >= 3) clusters.push({ level, cells: cluster });
            }
        }
    }
    return clusters;
}

function applyGravity(b) {
    for (let c = 0; c < BOARD_SIZE; c++) {
        let writeIdx = BOARD_SIZE - 1;
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
            if (b[r][c] > 0) {
                b[writeIdx][c] = b[r][c];
                if (writeIdx !== r) b[r][c] = 0;
                writeIdx--;
            }
        }
        for (let r = writeIdx; r >= 0; r--) b[r][c] = 0;
    }
}

function resolveMerges(b) {
    let hasMerged = true;
    let totalMerges = 0;
    let mergeLogs = [];
    while (hasMerged) {
        hasMerged = false;
        const clusters = findClusters(b);
        if (clusters.length > 0) {
            hasMerged = true;
            for (const cluster of clusters) {
                b[cluster.cells[0].r][cluster.cells[0].c] = cluster.level + 1;
                for (let i = 1; i < cluster.cells.length; i++) b[cluster.cells[i].r][cluster.cells[i].c] = 0;
                totalMerges++;
                mergeLogs.push(`${cluster.cells.length}x Lv.${cluster.level} ➔ Lv.${cluster.level + 1}`);
            }
            applyGravity(b);
        }
    }
    return { total: totalMerges, logs: mergeLogs };
}

// --- AI SOLVER ---
function calculateScore(b) {
    let score = 0;
    let emptySpaces = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (b[r][c] > 0) score += Math.pow(2, b[r][c]); 
            else emptySpaces++;
        }
    }
    return score + (emptySpaces * 50);
}

function copyBoard(b) {
    return b.map(row => [...row]);
}

function findBestMove() {
    // Otomatis pindah ke Mode AI jika user belum di mode tersebut
    if (currentMode !== 'solve') {
        setMode('solve');
    }

    let bestScore = -Infinity;
    let bestMove = null;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] > 0 && board[r][c] < 10) {
                let simBoard = copyBoard(board);
                simBoard[r][c] += 1; 
                let mergeResult = resolveMerges(simBoard);
                let merges = mergeResult.total;
                let logs = mergeResult.logs;
                let score = calculateScore(simBoard);
                
                if (merges > 0) score += merges * 1000; 

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { type: 'upgrade', from: {r, c}, oldLevel: board[r][c], merges: merges, logs: logs };
                }
            }
        }
    }

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] > 0) {
                let simBoard = copyBoard(board);
                let discardedLevel = simBoard[r][c];
                
                simBoard[r][c] = 0; 
                applyGravity(simBoard); 
                
                let mergeResult = resolveMerges(simBoard);
                let merges = mergeResult.total;
                let logs = mergeResult.logs;
                let score = calculateScore(simBoard);
                
                if (merges > 0) score += merges * 1000;
                score -= Math.pow(2, discardedLevel) * 5; 

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { type: 'discard', from: {r, c}, level: discardedLevel, merges: merges, logs: logs };
                }
            }
        }
    }

    const recBox = document.getElementById('recommendation');
    clearHighlights();

    if (!bestMove) {
        recBox.innerHTML = `<h4>Tidak ada langkah valid.</h4><p>Papan kosong atau penuh dengan level MAX.</p>`;
        activeRecommendation = null;
        return;
    }

    activeRecommendation = bestMove;
    renderGrid(); 

    const coord = `${ROWS[bestMove.from.r]}${bestMove.from.c + 1}`;
    let textAction = "";

    if (bestMove.type === 'upgrade') {
        textAction = `Klik kotak <b>${coord}</b> untuk Upgrade dari Lv.${bestMove.oldLevel} ke Lv.${bestMove.oldLevel + 1}.`;
    } else if (bestMove.type === 'discard') {
        if (bestMove.merges === 0) {
            textAction = `Klik kotak <b>${coord}</b> untuk Discard (Buka Ruang).`;
        } else {
            textAction = `Klik kotak <b>${coord}</b> untuk Discard & memicu Merge.`;
        }
    }

    let mergeDetailsHtml = "";
    if (bestMove.merges > 0 && bestMove.logs && bestMove.logs.length > 0) {
        mergeDetailsHtml = `<div style="background:#222; padding:8px; border-radius:4px; margin-top:10px; border-left: 3px solid #2ecc71;">
            <p style="color:#f1c40f; font-weight:bold; margin-bottom:5px; font-size:0.9rem;">Detail Proses Merge:</p>
            <p style="color:#ddd; font-size:0.85rem; line-height:1.4;">• ${bestMove.logs.join('<br>• ')}</p>
        </div>`;
    }

    recBox.innerHTML = `
        <h4>Langkah Terbaik Ditemukan!</h4>
        <p style="color:#2ecc71; font-weight:bold; font-size:1rem; margin-bottom:10px;">${textAction}</p>
        ${mergeDetailsHtml}
        <p style="font-size:0.8rem; color:#f1c40f; margin-top:15px; font-style:italic;">*Klik kotak yang berkedip untuk mengeksekusi simulasi.</p>
    `;
}


function importFromText() {
    const text = document.getElementById('paste-input').value;
    
    // Ambil semua angka (termasuk 10) dari teks
    const numbers = text.match(/\d+/g);
    
    if (!numbers) {
        alert("Tidak ada angka yang ditemukan di dalam teks.");
        return;
    }

    if (numbers.length !== 25) {
        alert(`Jumlah angka harus tepat 25. Anda memasukkan ${numbers.length} angka.`);
        return;
    }

    let index = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            let val = parseInt(numbers[index]);
            // Ubah 0 menjadi 10 (sesuai aturan input kita)
            if (val === 0) val = 10;
            
            // Batasi level maksimal 10
            if (val > 10) val = 10;
            
            board[r][c] = val;
            index++;
        }
    }
    
    renderGrid();
    document.getElementById('status-text').textContent = "Berhasil mengimpor 25 angka dari teks!";
    document.getElementById('paste-input').value = ''; // Kosongkan textarea
}

// Mulai Game
initBoard();
