
const MAX_ROWS = 500;
const MAX_COLUMNS = 1000;

let data = [];
let headers = [];
let filteredData = null;

let undoStack = [];
let redoStack = [];

let charts = {};
let selectedColumn = 0;

// -------------------- BASIC HELPERS --------------------

function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
}

function getCurrentData() {
    return filteredData === null ? data : filteredData;
}

function saveHistory() {
    undoStack.push({
        data: cloneData(data),
        headers: cloneData(headers)
    });

    if (undoStack.length > 20) undoStack.shift();
    redoStack = [];

    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    document.getElementById("undoBtn").disabled = undoStack.length === 0;
    document.getElementById("redoBtn").disabled = redoStack.length === 0;
}

function undo() {
    if (!undoStack.length) return;

    redoStack.push({
        data: cloneData(data),
        headers: cloneData(headers)
    });

    const previous = undoStack.pop();
    data = previous.data;
    headers = previous.headers;
    filteredData = null;

    refresh();
    updateUndoRedoButtons();
}

function redo() {
    if (!redoStack.length) return;

    undoStack.push({
        data: cloneData(data),
        headers: cloneData(headers)
    });

    const next = redoStack.pop();
    data = next.data;
    headers = next.headers;
    filteredData = null;

    refresh();
    updateUndoRedoButtons();
}

function getNumericValues(columnIndex) {
    return getCurrentData()
        .map(row => Number(row[columnIndex]))
        .filter(value => Number.isFinite(value) && rowValueNotEmpty(value));
}

function rowValueNotEmpty(value) {
    return value !== null && value !== undefined && value !== "";
}

function formatNumber(value) {
    if (!Number.isFinite(value)) return "N/A";
    return Number(value.toFixed(3)).toLocaleString();
}

function limitInputs() {
    const rows = Math.max(
        1,
        Math.min(MAX_ROWS, parseInt(document.getElementById("rowCount").value) || 1)
    );

    const cols = Math.max(
        1,
        Math.min(MAX_COLUMNS, parseInt(document.getElementById("colCount").value) || 1)
    );

    document.getElementById("rowCount").value = rows;
    document.getElementById("colCount").value = cols;

    return { rows, cols };
}

// -------------------- SAMPLE DATA --------------------

function loadSampleData() {
    saveHistory();

    headers = ["Name", "Age", "Marks", "Attendance", "Salary"];

    data = [
        ["Aman", 20, 85, 90, 25000],
        ["Riya", 21, 92, 95, 30000],
        ["Rahul", 19, 70, 80, 22000],
        ["Priya", 22, 88, 85, 28000],
        ["Karan", 20, 65, 75, 20000],
        ["Neha", 21, 95, 98, 35000],
        ["Arjun", 23, 78, 82, 26000],
        ["Simran", 20, 82, 88, 27000],
        ["Anjali", 22, 90, 93, 32000],
        ["Vikas", 19, 60, 70, 18000]
    ];

    filteredData = null;
    document.getElementById("uploadMessage").textContent = "Sample data loaded.";
    refresh();
}

// -------------------- FILE UPLOAD --------------------

document.getElementById("uploadBtn").addEventListener("click", () => {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please select an Excel or CSV file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const workbook = XLSX.read(event.target.result, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const sheetData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: ""
            });

            if (!sheetData.length) {
                alert("The file is empty.");
                return;
            }

            saveHistory();

            const limits = limitInputs();

            headers = sheetData[0]
                .slice(0, limits.cols)
                .map((value, index) => String(value || `Column ${index + 1}`));

            data = sheetData
                .slice(1, limits.rows + 1)
                .map(row => {
                    const selectedRow = row.slice(0, limits.cols);

                    while (selectedRow.length < headers.length) {
                        selectedRow.push("");
                    }

                    return selectedRow;
                });

            filteredData = null;

            document.getElementById("uploadMessage").textContent =
                `Uploaded ${data.length} rows and ${headers.length} columns.`;

            refresh();
        } catch (error) {
            alert("Unable to read file. Please check your Excel/CSV file.");
            console.error(error);
        }
    };

    reader.readAsArrayBuffer(file);
});

// -------------------- APPLY ROW / COLUMN SELECTION --------------------

document.getElementById("applySelectionBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("Upload a file or load sample data first.");
        return;
    }

    const limits = limitInputs();

    saveHistory();

    data = data.slice(0, limits.rows);

    headers = headers.slice(0, limits.cols);

    data = data.map(row => {
        row = row.slice(0, limits.cols);

        while (row.length < headers.length) {
            row.push("");
        }

        return row;
    });

    filteredData = null;

    document.getElementById("tableMessage").textContent =
        `Showing ${data.length} rows and ${headers.length} columns.`;

    refresh();
});

// -------------------- MANUAL TABLE --------------------

document.getElementById("createBtn").addEventListener("click", () => {
    const rows = Math.max(
        1,
        Math.min(MAX_ROWS, parseInt(document.getElementById("manualRows").value) || 1)
    );

    const cols = Math.max(
        1,
        Math.min(MAX_COLUMNS, parseInt(document.getElementById("manualCols").value) || 1)
    );

    saveHistory();

    headers = Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);

    data = Array.from({ length: rows }, () =>
        Array(cols).fill("")
    );

    filteredData = null;
    refresh();
});

// -------------------- DISPLAY TABLE --------------------

function displayTable() {
    const tableArea = document.getElementById("tableArea");

    if (!headers.length) {
        tableArea.innerHTML = "<p>No data available.</p>";
        return;
    }

    const currentData = getCurrentData();

    let html = "<table><thead><tr>";

    headers.forEach((header, columnIndex) => {
        html += `<th>${escapeHTML(header)}</th>`;
    });

    html += "</tr></thead><tbody>";

    currentData.forEach((row, rowIndex) => {
        html += "<tr>";

        headers.forEach((header, columnIndex) => {
            const value = row[columnIndex] ?? "";

            html += `
                <td>
                    <input
                        type="text"
                        value="${escapeHTML(value)}"
                        data-row="${rowIndex}"
                        data-col="${columnIndex}"
                        aria-label="Row ${rowIndex + 1}, Column ${columnIndex + 1}"
                    >
                </td>
            `;
        });

        html += "</tr>";
    });

    html += "</tbody></table>";

    tableArea.innerHTML = html;

    tableArea.querySelectorAll("td input").forEach(input => {
        input.addEventListener("change", function() {
            saveHistory();

            const rowIndex = Number(this.dataset.row);
            const colIndex = Number(this.dataset.col);

            if (filteredData !== null) {
                filteredData[rowIndex][colIndex] = this.value;
            } else {
                data[rowIndex][colIndex] = this.value;
            }

            analyzeData();
        });
    });

    updateDropdowns();
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// -------------------- DROPDOWNS --------------------

function updateDropdowns() {
    const dropdownIds = [
        "sortColumn",
        "filterColumn",
        "searchColumn",
        "columnSelect"
    ];

    dropdownIds.forEach(id => {
        const select = document.getElementById(id);

        select.innerHTML = "";

        headers.forEach((header, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = header;
            select.appendChild(option);
        });
    });
}

// -------------------- ADD ROW / COLUMN --------------------

document.getElementById("addRowBtn").addEventListener("click", () => {
    if (data.length >= MAX_ROWS) {
        alert("Maximum 500 rows allowed.");
        return;
    }

    saveHistory();

    data.push(Array(headers.length).fill(""));
    filteredData = null;

    refresh();
});

document.getElementById("addColBtn").addEventListener("click", () => {
    if (headers.length >= MAX_COLUMNS) {
        alert("Maximum 1000 columns allowed.");
        return;
    }

    saveHistory();

    headers.push(`Column ${headers.length + 1}`);

    data.forEach(row => row.push(""));

    filteredData = null;

    refresh();
});

// -------------------- CLEAN EMPTY CELLS --------------------

document.getElementById("cleanBtn").addEventListener("click", () => {
    saveHistory();

    data = data.map(row =>
        row.map(value => value === null || value === undefined ? "" : value)
    );

    filteredData = null;

    refresh();
});

// -------------------- REMOVE DUPLICATES --------------------

document.getElementById("removeDuplicatesBtn").addEventListener("click", () => {
    saveHistory();

    const originalLength = data.length;

    const seen = new Set();

    data = data.filter(row => {
        const key = JSON.stringify(row);

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });

    filteredData = null;

    document.getElementById("tableMessage").textContent =
        `${originalLength - data.length} duplicate rows removed.`;

    refresh();
});

// -------------------- SORTING --------------------

document.getElementById("sortBtn").addEventListener("click", () => {
    const columnIndex = Number(document.getElementById("sortColumn").value);
    const order = document.getElementById("sortOrder").value;

    saveHistory();

    data.sort((a, b) => {
        const valueA = a[columnIndex] ?? "";
        const valueB = b[columnIndex] ?? "";

        const numA = Number(valueA);
        const numB = Number(valueB);

        let result;

        if (valueA !== "" && valueB !== "" &&
            Number.isFinite(numA) && Number.isFinite(numB)) {
            result = numA - numB;
        } else {
            result = String(valueA).localeCompare(String(valueB));
        }

        return order === "asc" ? result : -result;
    });

    filteredData = null;
    refresh();
});

// -------------------- FILTERING --------------------

document.getElementById("filterBtn").addEventListener("click", () => {
    const columnIndex = Number(document.getElementById("filterColumn").value);
    const filterValue = document.getElementById("filterValue").value.toLowerCase();

    filteredData = data.filter(row =>
        String(row[columnIndex] ?? "").toLowerCase().includes(filterValue)
    );

    displayTable();
    analyzeData();

    document.getElementById("tableMessage").textContent =
        `${filteredData.length} matching rows found.`;
});

document.getElementById("clearFilterBtn").addEventListener("click", () => {
    filteredData = null;
    refresh();
});

// -------------------- COLUMN SEARCH --------------------

document.getElementById("searchColumnBtn").addEventListener("click", () => {
    const columnIndex = Number(document.getElementById("searchColumn").value);
    const searchValue = document.getElementById("searchValue").value.toLowerCase();

    const results = getCurrentData().filter(row =>
        String(row[columnIndex] ?? "").toLowerCase().includes(searchValue)
    );

    let html = `<p><b>${results.length}</b> matching records found.</p>`;

    if (results.length) {
        html += "<div class='table-area'><table><thead><tr>";

        headers.forEach(header => {
            html += `<th>${escapeHTML(header)}</th>`;
        });

        html += "</tr></thead><tbody>";

        results.slice(0, 100).forEach(row => {
            html += "<tr>";

            headers.forEach((header, index) => {
                html += `<td>${escapeHTML(row[index] ?? "")}</td>`;
            });

            html += "</tr>";
        });

        html += "</tbody></table></div>";
    }

    document.getElementById("columnSearchResult").innerHTML = html;
});

// -------------------- STATISTICS --------------------

function calculateMode(values) {
    if (!values.length) return "N/A";

    const frequency = {};

    values.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
    });

    const maxFrequency = Math.max(...Object.values(frequency));

    return Object.keys(frequency)
        .filter(value => frequency[value] === maxFrequency)
        .join(", ");
}

function analyzeData() {
    const columnIndex = Number(document.getElementById("columnSelect").value);

    if (headers.length === 0) return;

    const values = getNumericValues(columnIndex);

    if (!values.length) {
        document.getElementById("statsArea").innerHTML =
            "<p>No numeric data found in this column.</p>";

        document.getElementById("insightsArea").innerHTML = "";
        document.getElementById("summaryArea").innerHTML = "";

        drawCharts([]);
        return;
    }

    const sorted = [...values].sort((a, b) => a - b);

    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / values.length;

    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const variance = values.reduce(
        (total, value) => total + Math.pow(value - mean, 2), 0
    ) / values.length;

    const standardDeviation = Math.sqrt(variance);

    const stats = {
        Count: values.length,
        Sum: sum,
        Mean: mean,
        Median: median,
        Mode: calculateMode(values),
        Minimum: Math.min(...values),
        Maximum: Math.max(...values),
        Variance: variance,
        "Standard Deviation": standardDeviation
    };

    let html = "";

    Object.entries(stats).forEach(([name, value]) => {
        html += `
            <div class="stat-box">
                <h4>${name}</h4>
                <p>${typeof value === "number" ? formatNumber(value) : escapeHTML(value)}</p>
            </div>
        `;
    });

    document.getElementById("statsArea").innerHTML = html;

    document.getElementById("insightsArea").innerHTML = `
        <h3>💡 Automatic Insights</h3>
        <p>• The selected column is <b>${escapeHTML(headers[columnIndex])}</b>.</p>
        <p>• Average value is <b>${formatNumber(mean)}</b>.</p>
        <p>• Maximum value is <b>${formatNumber(Math.max(...values))}</b>.</p>
        <p>• Minimum value is <b>${formatNumber(Math.min(...values))}</b>.</p>
        <p>• Standard deviation is <b>${formatNumber(standardDeviation)}</b>.</p>
        <p>• ${values.length} numeric values were analyzed.</p>
    `;

    createSummaryTable();
    drawCharts(values);
}

document.getElementById("analyzeBtn").addEventListener("click", analyzeData);

// -------------------- SUMMARY TABLE --------------------

function createSummaryTable() {
    let html = "<h3>📋 Column Summary</h3><div class='table-area'><table>";
    html += "<thead><tr><th>Column</th><th>Count</th><th>Numeric Count</th><th>Sum</th><th>Mean</th></tr></thead><tbody>";

    headers.forEach((header, index) => {
        const values = getNumericValues(index);
        const sum = values.reduce((total, value) => total + value, 0);
        const mean = values.length ? sum / values.length : 0;

        html += `
            <tr>
                <td>${escapeHTML(header)}</td>
                <td>${getCurrentData().length}</td>
                <td>${values.length}</td>
                <td>${formatNumber(sum)}</td>
                <td>${formatNumber(mean)}</td>
            </tr>
        `;
    });

    html += "</tbody></table></div>";

    document.getElementById("summaryArea").innerHTML = html;
}

// -------------------- CHARTS --------------------

function drawCharts(values) {
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    if (!values.length) return;

    const labels = values.map((value, index) => `Record ${index + 1}`);

    const chartData = {
        labels,
        datasets: [{
            label: headers[Number(document.getElementById("columnSelect").value)],
            data: values,
            borderWidth: 2
        }]
    };

    const createChart = (id, type, data, options = {}) => {
        const ctx = document.getElementById(id);

        charts[id] = new Chart(ctx, {
            type,
            data: cloneData(data),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                ...options
            }
        });
    };

    createChart("barChart", "bar", chartData);

    createChart("lineChart", "line", chartData);

    createChart("avgChart", "bar", {
        labels: ["Mean", "Median", "Minimum", "Maximum"],
        datasets: [{
            label: "Statistical Values",
            data: [
                values.reduce((a, b) => a + b, 0) / values.length,
                [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)],
                Math.min(...values),
                Math.max(...values)
            ]
        }]
    });

    const frequency = {};

    values.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
    });

    const uniqueLabels = Object.keys(frequency).slice(0, 20);
    const uniqueValues = uniqueLabels.map(label => frequency[label]);

    createChart("pieChart", "pie", {
        labels: uniqueLabels,
        datasets: [{ label: "Frequency", data: uniqueValues }]
    });

    createChart("doughnutChart", "doughnut", {
        labels: uniqueLabels,
        datasets: [{ label: "Frequency", data: uniqueValues }]
    });

    createChart("scatterChart", "scatter", {
        datasets: [{
            label: "Scatter Plot",
            data: values.map((value, index) => ({ x: index + 1, y: value }))
        }]
    });

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 10;
    const binSize = (max - min) / binCount || 1;

    const bins = Array(binCount).fill(0);

    values.forEach(value => {
        let binIndex = Math.floor((value - min) / binSize);
        binIndex = Math.min(binCount - 1, Math.max(0, binIndex));
        bins[binIndex]++;
    });

    createChart("histogramChart", "bar", {
        labels: bins.map((value, index) => {
            const start = min + index * binSize;
            const end = start + binSize;
            return `${formatNumber(start)} - ${formatNumber(end)}`;
        }),
        datasets: [{
            label: "Frequency",
            data: bins
        }]
    });
}

// -------------------- EXCEL DOWNLOAD --------------------

document.getElementById("excelDownloadBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to download.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analyzed Data");

    XLSX.writeFile(workbook, "Excel_Data_Analyzer.xlsx");
});

// -------------------- CSV DOWNLOAD --------------------

document.getElementById("csvDownloadBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to download.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Excel_Data_Analyzer.csv";
    link.click();

    URL.revokeObjectURL(url);
});

// -------------------- PDF REPORT --------------------

document.getElementById("pdfReportBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to export.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape");

    pdf.text("Excel Data Analyzer Report", 14, 15);

    pdf.text(`Rows: ${data.length} | Columns: ${headers.length}`, 14, 22);

    pdf.autoTable({
        head: [headers.slice(0, 10)],
        body: data.slice(0, 100).map(row => row.slice(0, 10)),
        startY: 30,
        styles: {
            fontSize: 7
        }
    });

    pdf.save("Excel_Data_Analyzer_Report.pdf");
});

// -------------------- DARK MODE --------------------

document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    document.getElementById("darkModeBtn").textContent =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// -------------------- UNDO / REDO BUTTONS --------------------

document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);

// -------------------- REFRESH --------------------

function refresh() {
    displayTable();
    analyzeData();
    updateUndoRedoButtons();
}

// -------------------- INITIAL LOAD --------------------

document.getElementById("sampleBtn").addEventListener("click", loadSampleData);

loadSampleData();
