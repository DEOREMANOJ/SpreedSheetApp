let spreadsheetData = [];
let selectedCells = [];
let dragStart = null;

// Initialize the spreadsheet
function initSpreadsheet(rows = 10, columns = 10) {
    const table = document.getElementById("spreadsheet");
    table.innerHTML = "";
    spreadsheetData = Array.from({ length: rows }, () => Array(columns).fill(''));

    const headerRow = table.insertRow();
    for (let i = 0; i < columns; i++) {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = String.fromCharCode(65 + i); // Column letters (A, B, ...)
        headerCell.style.fontWeight = "bold";
    }

    for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        const rowLabel = row.insertCell();
        rowLabel.textContent = i + 1; // Row numbers
        for (let j = 0; j < columns; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.setAttribute("draggable", "true");
            cell.addEventListener("input", (event) => handleCellChange(i, j, event.target.innerText));
            cell.addEventListener("click", () => selectCell(i, j));
            cell.addEventListener("dragstart", (e) => startDrag(e, i, j));
            cell.addEventListener("dragover", (e) => allowDrop(e));
            cell.addEventListener("drop", (e) => dropCell(e, i, j));
        }
    }
}

// Handle cell changes
function handleCellChange(row, col, value) {
    spreadsheetData[row][col] = value;
}

// Select or unselect a cell
function selectCell(row, col) {
    const cell = document.getElementById("spreadsheet").rows[row + 1].cells[col + 1];
    if (selectedCells.includes(cell)) {
        selectedCells = selectedCells.filter(c => c !== cell);
        cell.style.backgroundColor = "";
    } else {
        selectedCells.push(cell);
        cell.style.backgroundColor = "#dcdcdc"; // Highlight selection
    }
}

// Drag and drop functionality
function startDrag(e, row, col) {
    dragStart = { row, col };
    e.target.classList.add("cell-dragging");
}

function allowDrop(e) {
    e.preventDefault();
    e.target.classList.add("cell-drop");
}

function dropCell(e, row, col) {
    e.preventDefault();
    const targetCell = e.target;
    const sourceCell = document.getElementById("spreadsheet").rows[dragStart.row + 1].cells[dragStart.col + 1];

    targetCell.innerText = sourceCell.innerText;
    sourceCell.innerText = "";

    targetCell.classList.remove("cell-drop");
    sourceCell.classList.remove("cell-dragging");
}

// Clear selected cells
function clearSelection() {
    selectedCells.forEach(cell => (cell.style.backgroundColor = ""));
    selectedCells = [];
}

// Data Quality Functions
function trimCells() {
    selectedCells.forEach(cell => {
        cell.innerText = cell.innerText.trim();
    });
    alert("Whitespace removed from selected cells.");
}

function toUpper() {
    selectedCells.forEach(cell => {
        cell.innerText = cell.innerText.toUpperCase();
    });
    alert("Converted selected cells to uppercase.");
}

function toLower() {
    selectedCells.forEach(cell => {
        cell.innerText = cell.innerText.toLowerCase();
    });
    alert("Converted selected cells to lowercase.");
}

function removeDuplicates() {
    const rowsToCheck = [...new Set(selectedCells.map(cell => cell.parentElement.rowIndex))];
    const uniqueData = new Set();

    rowsToCheck.forEach(rowIndex => {
        const row = spreadsheetData[rowIndex];
        const rowString = JSON.stringify(row);
        if (!uniqueData.has(rowString)) {
            uniqueData.add(rowString);
        } else {
            document.getElementById("spreadsheet").deleteRow(rowIndex + 1);
        }
    });

    alert("Duplicates removed.");
}

function findAndReplace() {
    const findText = prompt("Enter the text to find:");
    const replaceText = prompt("Enter the text to replace:");

    if (!findText || replaceText === null) return;

    selectedCells.forEach(cell => {
        if (cell.innerText.includes(findText)) {
            cell.innerText = cell.innerText.replaceAll(findText, replaceText);
        }
    });

    alert(`Replaced all occurrences of "${findText}" with "${replaceText}".`);
}

// Mathematical Functions
function applyMathematicalFunction(func) {
    const values = selectedCells.map(cell => parseFloat(cell.innerText) || 0);
    let result;

    switch (func) {
        case "sum":
            result = values.reduce((acc, num) => acc + num, 0);
            break;
        case "average":
            result = values.reduce((acc, num) => acc + num, 0) / values.length;
            break;
        case "max":
            result = Math.max(...values);
            break;
        case "min":
            result = Math.min(...values);
            break;
        case "count":
            result = values.filter(v => !isNaN(v)).length;
            break;
    }

    alert(`${func.toUpperCase()}: ${result}`);
}

// Add rows and columns
function addRow() {
    const table = document.getElementById("spreadsheet");
    const cols = spreadsheetData[0].length;
    const row = table.insertRow();
    const rowIndex = table.rows.length - 1;
    const rowLabel = row.insertCell();
    rowLabel.textContent = rowIndex;

    for (let i = 0; i < cols; i++) {
        const cell = row.insertCell();
        cell.contentEditable = true;
        cell.addEventListener("input", (event) => handleCellChange(rowIndex - 1, i, event.target.innerText));
    }

    spreadsheetData.push(Array(cols).fill(""));
}

function addColumn() {
    const table = document.getElementById("spreadsheet");
    const rows = table.rows.length;
    const cols = spreadsheetData[0].length;

    for (let i = 0; i < rows; i++) {
        const cell = table.rows[i].insertCell();
        if (i === 0) {
            cell.textContent = String.fromCharCode(65 + cols);
        } else {
            cell.contentEditable = true;
            cell.addEventListener("input", (event) => handleCellChange(i - 1, cols, event.target.innerText));
        }
    }

    spreadsheetData.forEach(row => row.push(""));
}

// Initialize spreadsheet
initSpreadsheet();
