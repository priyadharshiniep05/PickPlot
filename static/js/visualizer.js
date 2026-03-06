// ============================================
// PickPlot Visualizer - Enhanced Examples
// ============================================

// Multiple asymmetric example grids — each has EXACTLY ONE target
const examples = [
    // Example 0: 6x7 warehouse grid
    {
        name: "6×7 Warehouse Floor",
        grid: [
            [0, 0, 1, 0, 0, 0, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 0],
            [1, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 1],
            [0, 1, 0, 0, 0, 0, 2]
        ],
        start: [0, 0],
        targets: [[5, 6]]
    },
    // Example 1: 2x3 compact grid
    {
        name: "2×3 Quick Pick",
        grid: [
            [0, 0, 0],
            [0, 1, 2]
        ],
        start: [0, 0],
        targets: [[1, 2]]
    },
    // Example 2: 4x5 medium grid
    {
        name: "4×5 Storage Zone",
        grid: [
            [0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [1, 1, 0, 0, 1],
            [0, 0, 0, 0, 2]
        ],
        start: [0, 0],
        targets: [[3, 4]]
    },
    // Example 3: 3x6 narrow aisle
    {
        name: "3×6 Narrow Aisle",
        grid: [
            [0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 2, 0]
        ],
        start: [0, 0],
        targets: [[2, 4]]
    },
    // Example 4: 5x4 tall layout
    {
        name: "5×4 Vertical Stack",
        grid: [
            [0, 0, 1, 0],
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 2]
        ],
        start: [0, 0],
        targets: [[4, 3]]
    },
    // Example 5: 7x3 wide corridor
    {
        name: "7×3 Wide Corridor",
        grid: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
            [1, 0, 1],
            [0, 0, 0],
            [0, 1, 0],
            [2, 0, 0]
        ],
        start: [0, 0],
        targets: [[6, 0]]
    },
    // Example 6: 4x8 large warehouse
    {
        name: "4×8 Distribution Hub",
        grid: [
            [0, 0, 1, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 1, 0, 2]
        ],
        start: [0, 0],
        targets: [[3, 7]]
    },
    // Example 7: 5x3 compact warehouse
    {
        name: "5×3 Mini Depot",
        grid: [
            [0, 0, 0],
            [1, 1, 0],
            [0, 0, 0],
            [0, 1, 1],
            [2, 0, 0]
        ],
        start: [0, 2],
        targets: [[4, 0]]
    },
    // Example 8: 3x8 long aisle
    {
        name: "3×8 Long Aisle",
        grid: [
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 2, 0]
        ],
        start: [0, 0],
        targets: [[2, 6]]
    },
    // Example 9: 6x4 dense obstacles
    {
        name: "6×4 Obstacle Course",
        grid: [
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [1, 0, 1, 0],
            [0, 0, 0, 0],
            [0, 1, 0, 2]
        ],
        start: [0, 0],
        targets: [[5, 3]]
    }
];

let currentExampleIndex = -1;
let currentPathTimeoutId = null;

// ============================================
// Toast Notification System
// ============================================
function showToast(message, type = 'info') {
    // Remove any existing toast
    const existingToast = document.getElementById('pickplot-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'pickplot-toast';
    toast.className = `toast-notification toast-${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: '💡',
        warning: '⚠️',
        example: '🗺️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '💡'}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================
// Initialize on load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadNextExample();
});

// ============================================
// Load next example (cycles through all)
// ============================================
function loadNextExample() {
    currentExampleIndex = (currentExampleIndex + 1) % examples.length;
    const example = examples[currentExampleIndex];

    // Build a clean object without the name for JSON display
    const jsonData = {
        grid: example.grid,
        start: example.start,
        targets: example.targets
    };

    const jsonStr = JSON.stringify(jsonData, null, 2);
    document.getElementById('jsonInput').value = jsonStr;
    renderInitialGrid(jsonData);

    const rows = example.grid.length;
    const cols = example.grid[0].length;
    showToast(`Loaded: ${example.name} (${rows}×${cols} grid)`, 'example');

    // Update the example counter badge
    const badge = document.getElementById('exampleBadge');
    if (badge) {
        badge.textContent = `${currentExampleIndex + 1} / ${examples.length}`;
    }
}

// ============================================
// Parse JSON input
// ============================================
function parseInput() {
    try {
        const val = document.getElementById('jsonInput').value;
        return JSON.parse(val);
    } catch (e) {
        showToast("Invalid JSON format in the input.", 'error');
        return null;
    }
}

// ============================================
// Render grid visualization
// ============================================
function renderInitialGrid(data) {
    if (!data.grid || !data.grid.length) return;

    const container = document.getElementById('gridDisplay');
    container.innerHTML = '';

    // Clear old timeouts
    if (currentPathTimeoutId) clearTimeout(currentPathTimeoutId);

    const rows = data.grid.length;
    const cols = data.grid[0].length;

    // Dynamically size cells based on grid size
    const maxCellSize = 52;
    const minCellSize = 28;
    const maxGridWidth = 520;
    const cellSize = Math.max(minCellSize, Math.min(maxCellSize, Math.floor(maxGridWidth / cols)));

    container.style.setProperty('--cell-size', `${cellSize}px`);

    // Create grid elements with staggered entrance animation
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        for (let c = 0; c < cols; c++) {
            const cellVal = data.grid[r][c];
            const cellDiv = document.createElement('div');
            cellDiv.id = `cell-${r}-${c}`;

            const isStart = data.start && data.start[0] === r && data.start[1] === c;
            const isTarget = cellVal === 2;

            // Only apply entrance animation to normal cells (not start/target)
            if (isStart || isTarget) {
                cellDiv.className = 'grid-cell';
            } else {
                cellDiv.className = 'grid-cell cell-enter';
                cellDiv.style.animationDelay = `${(r * cols + c) * 25}ms`;
            }

            if (cellVal === 1) cellDiv.classList.add('cell-obstacle');
            else if (isTarget) cellDiv.classList.add('cell-target');
            else cellDiv.classList.add('cell-walkable');

            // Mark start point
            if (isStart) {
                cellDiv.classList.add('cell-start');
                cellDiv.classList.remove('cell-walkable');
                cellDiv.innerHTML = '<span class="cell-icon">🚀</span>';
            }

            // Mark target point with icon
            if (isTarget) {
                cellDiv.innerHTML = '<span class="cell-icon">📦</span>';
            }

            // Hover tooltip with coordinates
            cellDiv.title = `Row ${r}, Col ${c}`;

            rowDiv.appendChild(cellDiv);
        }
        container.appendChild(rowDiv);
    }

    // Add coordinate labels
    addCoordinateLabels(container, rows, cols, cellSize);
}

// ============================================
// Add row/col coordinate labels
// ============================================
function addCoordinateLabels(container, rows, cols, cellSize) {
    // Column labels on top
    const colLabelRow = document.createElement('div');
    colLabelRow.className = 'grid-row coord-row';
    colLabelRow.style.marginBottom = '2px';
    for (let c = 0; c < cols; c++) {
        const label = document.createElement('div');
        label.className = 'coord-label';
        label.textContent = c;
        colLabelRow.appendChild(label);
    }
    container.insertBefore(colLabelRow, container.firstChild);
}

// ============================================
// Calculate route
// ============================================
async function calculateRoute() {
    const requestData = parseInput();
    if (!requestData) return;

    // UI Update
    const btn = document.getElementById('calculateBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Calculating...';
    btn.classList.add('btn-calculating');

    document.getElementById('aiLoading').classList.remove('d-none');
    document.getElementById('aiInsights').innerText = 'Analyzing route and generating insights...';

    // Reset grid cleanly
    renderInitialGrid(requestData);

    showToast('Calculating optimal route...', 'info');

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const resultData = await response.json();

        // Populate Outputs
        document.getElementById('outputJson').innerText = JSON.stringify(resultData, null, 2);

        if (response.ok) {
            document.getElementById('statSteps').innerText = resultData.total_steps;
            document.getElementById('statTime').innerText = resultData.execution_time_ms;
            document.getElementById('aiInsights').innerText =
                resultData.reasoning ||
                (resultData.ai_powered
                    ? "AI reasoning applied successfully."
                    : "Using BFS Fallback. No AI reasoning available.");

            // Animate Path
            if (resultData.path && resultData.path.length > 0) {
                animatePath(resultData.path, requestData);
                showToast(`Route found! ${resultData.total_steps} steps in ${resultData.execution_time_ms}ms`, 'success');
            } else {
                showToast('No path found between start and target.', 'warning');
            }
        } else {
            showToast('Error calculating route: ' + resultData.error, 'error');
        }

    } catch (error) {
        showToast('Network error — is the server running?', 'error');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '⚡ Calculate Optimal Route';
        btn.classList.remove('btn-calculating');
        document.getElementById('aiLoading').classList.add('d-none');
    }
}

// ============================================
// Animate path step-by-step
// ============================================
function animatePath(pathCoords, initialData) {
    let step = 0;

    function drawNextStep() {
        if (step >= pathCoords.length) return;

        const coord = pathCoords[step];
        const r = coord[0];
        const c = coord[1];
        const cell = document.getElementById(`cell-${r}-${c}`);

        if (cell) {
            const isStart = (initialData.start[0] === r && initialData.start[1] === c);
            const isTarget = initialData.targets.some(t => t[0] === r && t[1] === c);

            if (!isStart && !isTarget) {
                cell.className = 'grid-cell cell-path path-anim';
                cell.innerHTML = `<span class="step-number">${step}</span>`;
            }
        }

        step++;
        currentPathTimeoutId = setTimeout(drawNextStep, 120);
    }

    drawNextStep();
}

// ============================================
// Copy JSON output
// ============================================
function copyJSON() {
    const text = document.getElementById('outputJson').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('JSON copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy — try selecting manually.', 'error');
    });
}
