
// ============================================
// EXCEL ANALYTICS - COMPLETE JAVASCRIPT
// Maximum: 1000 rows x 500 columns
// Four charts with real category labels
// ============================================

const MAX_ROWS = 1000;
const MAX_COLUMNS = 500;

const PREVIEW_ROWS = 100;
const PREVIEW_COLUMNS = 30;

let data = [];
let headers = [];
let filteredIndexes = null;

let undoStack = [];
let redoStack = [];
let charts = {};

// ============================================
// HELPER FUNCTIONS
// ============================================

const $ = id => document.getElementById(id);

function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showMessage(id, message) {
    const element = $(id);
    if (element) element.textContent = message;
}

function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    const cleaned = String(value)
        .replace(/,/g, "")
        .replace(/[₹$€£%]/g, "")
        .trim();

    if (!cleaned) return null;

    const number = Number(cleaned);
    return Number.isFinite(number) ? number : null;
}

function formatNumber(value) {
    if (!Number.isFinite(value)) return "—";

    return Number(value.toFixed(2)).toLocaleString();
}

function getCurrentIndexes() {
    if (filteredIndexes === null) {
        return data.map((_, index) => index);
    }

    return filteredIndexes;
}

function getCurrentData() {
    return getCurrentIndexes().map(index => data[index]);
}

function getNumericValues(columnIndex) {
    return getCurrentData()
        .map(row => parseNumber(row[columnIndex]))
        .filter(value => value !== null);
}

function getFirstNumericColumn() {
    for (let column = 0; column < headers.length; column++) {
        const values = data
            .slice(0, 50)
            .map(row => parseNumber(row[column]))
            .filter(value => value !== null);

        if (values.length > 0) return column;
    }

    return 0;
}

function getFirstCategoryColumn() {
    for (let column = 0; column < headers.length; column++) {
        const values = data
            .slice(0, 50)
            .map(row => row[column])
            .filter(value => value !== "" && value !== null && value !== undefined);

        const numericCount = values.filter(value => parseNumber(value) !== null).length;

        if (values.length && numericCount < values.length) {
            return column;
        }
    }

    return 0;
}

function saveHistory() {
    undoStack.push({
        data: cloneData(data),
        headers: cloneData(headers)
    });

    if (undoStack.length > 8) {
        undoStack.shift();
    }

    redoStack = [];
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    $("undoBtn").disabled = undoStack.length === 0;
    $("redoBtn").disabled = redoStack.length === 0;
}

function clearFilter() {
    filteredIndexes = null;
}

// ============================================
// UNDO / REDO
// ============================================

function undo() {
    if (!undoStack.length) return;

    redoStack.push({
        data: cloneData(data),
        headers: cloneData(headers)
    });

    const previous = undoStack.pop();

    data = previous.data;
    headers = previous.headers;

    clearFilter();
    refresh();
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

    clearFilter();
    refresh();
}

$("undoBtn").addEventListener("click", undo);
$("redoBtn").addEventListener("click", redo);

// ============================================
// FILE UPLOAD - CSV / XLS / XLSX
// ============================================

$("uploadBtn").addEventListener("click", () => {
    const file = $("fileInput").files[0];

    if (!file) {
        alert("Please select an Excel or CSV file first.");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("Excel library could not load. Check your internet connection.");
        return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(extension)) {
        alert("Please upload a CSV, XLS or XLSX file.");
        return;
    }

    showMessage("uploadMessage", "Reading your file...");

    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const workbook = XLSX.read(event.target.result, {
                type: "array",
                raw: false,
                cellDates: true
            });

            if (!workbook.SheetNames.length) {
                throw new Error("No worksheet found.");
            }

            const firstSheet =
                workbook.Sheets[workbook.SheetNames[0]];

            const sheetData = XLSX.utils.sheet_to_json(firstSheet, {
                header: 1,
                defval: "",
                raw: false,
                blankrows: false
            });

            if (!sheetData.length) {
                throw new Error("The file is empty.");
            }

            const limits = getLimits();

            const selectedHeaders = sheetData[0]
                .slice(0, limits.cols);

            if (!selectedHeaders.length) {
                throw new Error("No columns found.");
            }

            const newHeaders = selectedHeaders.map((value, index) => {
                const name = String(value ?? "").trim();
                return name || `Column ${index + 1}`;
            });

            const newData = sheetData
                .slice(1, limits.rows + 1)
                .map(row => {
                    const selectedRow = row.slice(0, limits.cols);

                    while (selectedRow.length < newHeaders.length) {
                        selectedRow.push("");
                    }

                    return selectedRow;
                });

            saveHistory();

            headers = newHeaders;
            data = newData;
            clearFilter();

            refresh();

            showMessage(
                "uploadMessage",
                `Successfully uploaded ${data.length} rows and ${headers.length} columns.`
            );

            showMessage(
                "tableMessage",
                `Dataset loaded: ${data.length} rows × ${headers.length} columns.`
            );

        } catch (error) {
            console.error("File upload error:", error);

            showMessage(
                "uploadMessage",
                "Unable to read the file. Please check its format."
            );

            alert(
                "Unable to read this file. Please check that your CSV or Excel file is valid."
            );
        }
    };

    reader.onerror = function() {
        showMessage("uploadMessage", "Unable to access the selected file.");
        alert("Unable to read the selected file.");
    };

    reader.readAsArrayBuffer(file);
});

// ============================================
// ROW AND COLUMN LIMITS
// ============================================

function getLimits() {
    const rows = Math.max(
        1,
        Math.min(MAX_ROWS, Number($("rowCount").value) || 1)
    );

    const cols = Math.max(
        1,
        Math.min(MAX_COLUMNS, Number($("colCount").value) || 1)
    );

    $("rowCount").value = rows;
    $("colCount").value = cols;

    return { rows, cols };
}

$("applySelectionBtn").addEventListener("click", () => {
    if (!headers.length) {
        alert("Please upload a file or load sample data first.");
        return;
    }

    const limits = getLimits();

    saveHistory();

    data = data.slice(0, limits.rows);
    headers = headers.slice(0, limits.cols);

    data = data.map(row => {
        const newRow = row.slice(0, limits.cols);

        while (newRow.length < headers.length) {
            newRow.push("");
        }

        return newRow;
    });

    clearFilter();
    refresh();

    showMessage(
        "tableMessage",
        `Showing ${data.length} rows and ${headers.length} columns.`
    );
});

// ============================================
// SAMPLE DATA
// ============================================

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

    clearFilter();
    refresh();

    showMessage("uploadMessage", "Sample data loaded successfully.");
}

$("sampleBtn").addEventListener("click", loadSampleData);

// ============================================
// MANUAL TABLE CREATION
// ============================================

$("createBtn").addEventListener("click", () => {
    const rows = Math.max(
        1,
        Math.min(MAX_ROWS, Number($("manualRows").value) || 1)
    );

    const cols = Math.max(
        1,
        Math.min(MAX_COLUMNS, Number($("manualCols").value) || 1)
    );

    $("manualRows").value = rows;
    $("manualCols").value = cols;

    saveHistory();

    headers = Array.from(
        { length: cols },
        (_, index) => `Column ${index + 1}`
    );

    data = Array.from(
        { length: rows },
        () => Array(cols).fill("")
    );

    clearFilter();
    refresh();

    showMessage("dataMessage", "Blank table created successfully.");
});

// ============================================
// DROPDOWN MANAGEMENT
// ============================================

function fillDropdown(id, selectedValue, includeAll = true) {
    const select = $(id);
    if (!select) return;

    const previousValue = selectedValue ?? select.value;

    select.innerHTML = "";

    headers.forEach((header, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = header;
        select.appendChild(option);
    });

    if (headers.length) {
        const numericValue = Number(previousValue);

        if (
            previousValue !== "" &&
            Number.isInteger(numericValue) &&
            numericValue >= 0 &&
            numericValue < headers.length
        ) {
            select.value = numericValue;
        }
    }
}

function updateDropdowns() {
    const oldCategory = $("chartCategory").value;
    const oldValue = $("chartValue").value;
    const oldAnalysis = $("analysisColumn").value;

    [
        "sortColumn",
        "filterColumn",
        "searchColumn",
        "analysisColumn",
        "chartCategory",
        "chartValue"
    ].forEach(id => fillDropdown(id));

    if (headers.length) {
        if (oldAnalysis !== "" && Number(oldAnalysis) < headers.length) {
            $("analysisColumn").value = oldAnalysis;
        }

        if (oldCategory !== "" && Number(oldCategory) < headers.length) {
            $("chartCategory").value = oldCategory;
        } else {
            $("chartCategory").value = getFirstCategoryColumn();
        }

        if (oldValue !== "" && Number(oldValue) < headers.length) {
            $("chartValue").value = oldValue;
        } else {
            $("chartValue").value = getFirstNumericColumn();
        }
    }
}

// ============================================
// TABLE DISPLAY
// ============================================

function displayTable() {
    const tableArea = $("tableArea");

    if (!headers.length) {
        tableArea.innerHTML = `
            <p>No data available. Upload a file or create a table.</p>
        `;
        return;
    }

    const indexes = getCurrentIndexes();

    const searchText = $("columnSearch").value.trim().toLowerCase();
    const searchColumn = Number($("searchColumn").value || 0);

    let visibleIndexes = indexes;

    if (searchText) {
        visibleIndexes = indexes.filter(index =>
            String(data[index][searchColumn] ?? "")
                .toLowerCase()
                .includes(searchText)
        );
    }

    const visibleHeaders = headers.slice(0, PREVIEW_COLUMNS);
    const visibleRows = visibleIndexes.slice(0, PREVIEW_ROWS);

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Row</th>
    `;

    visibleHeaders.forEach(header => {
        html += `<th>${escapeHTML(header)}</th>`;
    });

    html += `
                </tr>
            </thead>
            <tbody>
    `;

    visibleRows.forEach(rowIndex => {
        const row = data[rowIndex];

        html += `<tr><td>${rowIndex + 1}</td>`;

        visibleHeaders.forEach((header, columnIndex) => {
            html += `
                <td>
                    <input
                        type="text"
                        value="${escapeHTML(row[columnIndex] ?? "")}"
                        data-row="${rowIndex}"
                        data-col="${columnIndex}"
                        aria-label="Row ${rowIndex + 1}, Column ${columnIndex + 1}"
                    >
                </td>
            `;
        });

        html += "</tr>";
    });

    html += `
            </tbody>
        </table>
    `;

    tableArea.innerHTML = html;

    const extraRows = Math.max(0, visibleIndexes.length - PREVIEW_ROWS);
    const extraColumns = Math.max(0, headers.length - PREVIEW_COLUMNS);

    if (extraRows || extraColumns) {
        tableArea.insertAdjacentHTML("beforeend", `
            <p class="preview-note">
                Preview shows up to ${PREVIEW_ROWS} rows and
                ${PREVIEW_COLUMNS} columns.
                ${extraRows ? `${extraRows} additional matching rows are stored. ` : ""}
                ${extraColumns ? `${extraColumns} additional columns are stored.` : ""}
            </p>
        `);
    }

    tableArea.querySelectorAll("td input").forEach(input => {
        input.addEventListener("change", function() {
            const rowIndex = Number(this.dataset.row);
            const colIndex = Number(this.dataset.col);

            if (!data[rowIndex]) return;
            if (String(data[rowIndex][colIndex] ?? "") === this.value) return;

            saveHistory();

            data[rowIndex][colIndex] = this.value;

            refresh();
        });
    });
}

$("columnSearch").addEventListener("input", displayTable);
$("searchColumn").addEventListener("change", displayTable);

// ============================================
// ADD ROW
// ============================================

$("addRowBtn").addEventListener("click", () => {
    if (!headers.length) {
        alert("Create or upload a table first.");
        return;
    }

    if (data.length >= MAX_ROWS) {
        alert("Maximum 1000 rows allowed.");
        return;
    }

    saveHistory();

    data.push(Array(headers.length).fill(""));

    clearFilter();
    refresh();
});

// ============================================
// ADD COLUMN
// ============================================

$("addColBtn").addEventListener("click", () => {
    if (!headers.length) {
        alert("Create or upload a table first.");
        return;
    }

    if (headers.length >= MAX_COLUMNS) {
        alert("Maximum 500 columns allowed.");
        return;
    }

    saveHistory();

    headers.push(`Column ${headers.length + 1}`);

    data.forEach(row => row.push(""));

    clearFilter();
    refresh();
});

// ============================================
// CLEAN EMPTY ROWS
// ============================================

$("cleanBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data available.");
        return;
    }

    saveHistory();

    const oldLength = data.length;

    data = data.filter(row =>
        row.some(value => String(value ?? "").trim() !== "")
    );

    clearFilter();
    refresh();

    showMessage(
        "tableMessage",
        `${oldLength - data.length} empty rows removed.`
    );
});

// ============================================
// REMOVE DUPLICATES
// ============================================

$("removeDuplicatesBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data available.");
        return;
    }

    saveHistory();

    const oldLength = data.length;
    const seen = new Set();

    data = data.filter(row => {
        const key = JSON.stringify(row);

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });

    clearFilter();
    refresh();

    showMessage(
        "tableMessage",
        `${oldLength - data.length} duplicate rows removed.`
    );
});

// ============================================
// SORT DATA
// ============================================

$("sortBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data available.");
        return;
    }

    const columnIndex = Number($("sortColumn").value);
    const order = $("sortOrder").value;

    saveHistory();

    data.sort((a, b) => {
        const valueA = a[columnIndex] ?? "";
        const valueB = b[columnIndex] ?? "";

        const numA = parseNumber(valueA);
        const numB = parseNumber(valueB);

        let result;

        if (numA !== null && numB !== null) {
            result = numA - numB;
        } else {
            result = String(valueA).localeCompare(String(valueB));
        }

        return order === "asc" ? result : -result;
    });

    clearFilter();
    refresh();

    showMessage("tableMessage", "Data sorted successfully.");
});

// ============================================
// FILTER DATA
// ============================================

$("filterBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data available.");
        return;
    }

    const columnIndex = Number($("filterColumn").value);
    const filterValue = $("filterValue").value.toLowerCase();

    filteredIndexes = [];

    data.forEach((row, index) => {
        const value = String(row[columnIndex] ?? "").toLowerCase();

        if (value.includes(filterValue)) {
            filteredIndexes.push(index);
        }
    });

    refresh();

    showMessage(
        "tableMessage",
        `${filteredIndexes.length} matching rows found.`
    );
});

// ============================================
// CLEAR FILTER
// ============================================

$("clearFilterBtn").addEventListener("click", () => {
    clearFilter();

    $("filterValue").value = "";
    $("columnSearch").value = "";

    refresh();

    showMessage("tableMessage", "Filters cleared.");
});

// ============================================
// STATISTICAL ANALYSIS
// ============================================

function calculateMode(values) {
    if (!values.length) return "—";

    const frequency = new Map();

    values.forEach(value => {
        frequency.set(value, (frequency.get(value) || 0) + 1);
    });

    const highestFrequency = Math.max(...frequency.values());

    return [...frequency.entries()]
        .filter(entry => entry[1] === highestFrequency)
        .map(entry => entry[0])
        .join(", ");
}

function analyzeData() {
    if (!headers.length) {
        $("countStat").textContent = "—";
        $("sumStat").textContent = "—";
        $("avgStat").textContent = "—";
        $("minStat").textContent = "—";
        $("maxStat").textContent = "—";

        $("insightsList").innerHTML =
            "<li>Load data to generate insights.</li>";

        return;
    }

    const columnIndex = Number($("analysisColumn").value || 0);
    const values = getNumericValues(columnIndex);

    if (!values.length) {
        $("countStat").textContent = "0";
        $("sumStat").textContent = "—";
        $("avgStat").textContent = "—";
        $("minStat").textContent = "—";
        $("maxStat").textContent = "—";

        $("insightsList").innerHTML =
            "<li>No numeric values found in this column. Select another column.</li>";

        return;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;

    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    const variance = values.reduce(
        (total, value) => total + Math.pow(value - average, 2),
        0
    ) / values.length;

    const standardDeviation = Math.sqrt(variance);
    const mode = calculateMode(values);

    $("countStat").textContent = values.length;
    $("sumStat").textContent = formatNumber(sum);
    $("avgStat").textContent = formatNumber(average);
    $("minStat").textContent = formatNumber(minimum);
    $("maxStat").textContent = formatNumber(maximum);

    $("insightsList").innerHTML = `
        <li>Selected column: <b>${escapeHTML(headers[columnIndex])}</b></li>
        <li>Total numeric values: <b>${values.length}</b></li>
        <li>Sum: <b>${formatNumber(sum)}</b></li>
        <li>Average: <b>${formatNumber(average)}</b></li>
        <li>Median: <b>${formatNumber(median)}</b></li>
        <li>Mode: <b>${escapeHTML(mode)}</b></li>
        <li>Minimum: <b>${formatNumber(minimum)}</b></li>
        <li>Maximum: <b>${formatNumber(maximum)}</b></li>
        <li>Standard deviation: <b>${formatNumber(standardDeviation)}</b></li>
    `;
}

$("analyzeBtn").addEventListener("click", analyzeData);
$("analysisColumn").addEventListener("change", analyzeData);

// ============================================
// CHART CONFIGURATION
// ============================================

const chartColors = [
    "#087f4b",
    "#48a878",
    "#8bc9a2",
    "#b6dfc2",
    "#d3ead9",
    "#5eaa7d",
    "#a2d5b2",
    "#347d55",
    "#6eaa8b",
    "#c2dfcc",
    "#3d8b65",
    "#91c9a7"
];

function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });

    charts = {};
}

function getChartRows() {
    const categoryIndex = Number($("chartCategory").value);
    const valueIndex = Number($("chartValue").value);

    return getCurrentData()
        .map((row, index) => {
            const value = parseNumber(row[valueIndex]);

            let category = String(row[categoryIndex] ?? "").trim();

            if (!category) {
                category = `Record ${index + 1}`;
            }

            return {
                category,
                value
            };
        })
        .filter(item => item.value !== null);
}

function createChartOptions(type) {
    const darkMode = document.body.classList.contains("dark-mode");
    const textColor = darkMode ? "#dce8df" : "#64736a";
    const gridColor = darkMode ? "#34483a" : "#e8eee9";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 500
        },
        plugins: {
            legend: {
                display: true,
                position: type === "pie" || type === "doughnut" ? "bottom" : "top",
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    padding: 16,
                    boxWidth: 10
                }
            },
            tooltip: {
                callbacks: {
                    title(items) {
                        return items[0]?.label || "";
                    },
                    label(context) {
                        const value = context.parsed.y ?? context.parsed;
                        const formatted = formatNumber(
                            typeof value === "number" ? value : Number(value)
                        );

                        if (type === "pie" || type === "doughnut") {
                            const total = context.dataset.data.reduce(
                                (sum, item) => sum + item,
                                0
                            );

                            const percentage = total
                                ? (context.raw / total) * 100
                                : 0;

                            return ` ${formatted} (${percentage.toFixed(1)}%)`;
                        }

                        return ` ${context.dataset.label}: ${formatted}`;
                    }
                }
            }
        }
    };

    if (type === "bar" || type === "line") {
        options.scales = {
            x: {
                ticks: {
                    color: textColor,
                    maxRotation: 50,
                    minRotation: 0
                },
                grid: {
                    color: gridColor
                },
                title: {
                    display: true,
                    text: headers[Number($("chartCategory").value)] || "Category",
                    color: textColor
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColor
                },
                grid: {
                    color: gridColor
                },
                title: {
                    display: true,
                    text: headers[Number($("chartValue").value)] || "Value",
                    color: textColor
                }
            }
        };
    }

    return options;
}

function createOneChart(canvasId, type, labels, values, datasetLabel) {
    const canvas = $(canvasId);

    if (!canvas) return;

    const isCircular = type === "pie" || type === "doughnut";

    const dataset = {
        label: datasetLabel,
        data: values,
        borderWidth: type === "line" ? 3 : 1,
        borderColor: type === "line" ? "#087f4b" : "#ffffff",
        backgroundColor: isCircular
            ? labels.map((_, index) => chartColors[index % chartColors.length])
            : type === "line"
                ? "rgba(8,127,75,0.12)"
                : "#48a878"
    };

    if (type === "line") {
        dataset.fill = true;
        dataset.tension = 0.35;
        dataset.pointRadius = 4;
        dataset.pointHoverRadius = 7;
        dataset.pointBackgroundColor = "#087f4b";
    }

    if (type === "bar") {
        dataset.borderRadius = 5;
        dataset.maxBarThickness = 45;
    }

    charts[canvasId] = new Chart(canvas, {
        type,
        data: {
            labels,
            datasets: [dataset]
        },
        options: createChartOptions(type)
    });
}

// ============================================
// PIE AND DOUGHNUT CATEGORY TOTALS
// ============================================

function getCategoryTotals(rows) {
    const totals = new Map();

    rows.forEach(item => {
        totals.set(
            item.category,
            (totals.get(item.category) || 0) + item.value
        );
    });

    let entries = [...totals.entries()]
        .filter(([category, value]) => value > 0)
        .sort((a, b) => b[1] - a[1]);

    if (entries.length > 12) {
        const topEntries = entries.slice(0, 11);
        const otherTotal = entries
            .slice(11)
            .reduce((sum, entry) => sum + entry[1], 0);

        topEntries.push(["Other categories", otherTotal]);
        entries = topEntries;
    }

    return {
        labels: entries.map(entry => entry[0]),
        values: entries.map(entry => entry[1])
    };
}

// ============================================
// DRAW ALL FOUR CHARTS
// ============================================

function drawCharts() {
    destroyCharts();

    if (typeof Chart === "undefined") {
        showMessage("chartMessage", "Chart library could not load. Check your internet connection.");
        return;
    }

    if (!headers.length || !data.length) {
        showMessage("chartMessage", "Upload data to create charts.");
        return;
    }

    const categoryIndex = Number($("chartCategory").value);
    const valueIndex = Number($("chartValue").value);

    if (
        !Number.isInteger(categoryIndex) ||
        !Number.isInteger(valueIndex) ||
        categoryIndex < 0 ||
        valueIndex < 0 ||
        categoryIndex >= headers.length ||
        valueIndex >= headers.length
    ) {
        showMessage("chartMessage", "Please select valid category and value columns.");
        return;
    }

    const rows = getChartRows();

    if (!rows.length) {
        showMessage(
            "chartMessage",
            "No numeric values found in the selected Value Column. Choose a numeric column."
        );
        return;
    }

    const labels = rows.map(item => item.category);
    const values = rows.map(item => item.value);

    const valueName = headers[valueIndex];

    // 1. BAR CHART
    createOneChart(
        "barChart",
        "bar",
        labels,
        values,
        valueName
    );

    // 2. LINE CHART
    createOneChart(
        "lineChart",
        "line",
        labels,
        values,
        valueName
    );

    // 3. PIE CHART
    const categoryTotals = getCategoryTotals(rows);

    if (categoryTotals.values.length) {
        createOneChart(
            "pieChart",
            "pie",
            categoryTotals.labels,
            categoryTotals.values,
            valueName
        );

        // 4. DOUGHNUT CHART
        createOneChart(
            "doughnutChart",
            "doughnut",
            categoryTotals.labels,
            categoryTotals.values,
            valueName
        );

        showMessage(
            "chartMessage",
            `Charts updated. ${rows.length} records plotted using "${headers[categoryIndex]}" and "${valueName}". Pie and Doughnut show category totals and percentages on hover.`
        );
    } else {
        showMessage(
            "chartMessage",
            "Bar and Line charts are ready. Pie and Doughnut need positive values to calculate proportions."
        );
    }
}

$("drawChartBtn").addEventListener("click", drawCharts);
$("chartCategory").addEventListener("change", drawCharts);
$("chartValue").addEventListener("change", drawCharts);

// ============================================
// DOWNLOAD EXCEL
// ============================================

$("downloadExcelBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to download.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Analyzed Data"
    );

    XLSX.writeFile(workbook, "Excel_Data_Analyzer.xlsx");
});

// ============================================
// DOWNLOAD CSV
// ============================================

$("downloadCSVBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to download.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Excel_Data_Analyzer.csv";
    link.click();

    URL.revokeObjectURL(url);
});

// ============================================
// DOWNLOAD PDF
// ============================================

$("downloadPDFBtn").addEventListener("click", () => {
    if (!data.length) {
        alert("No data to export.");
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library could not load. Check your internet connection.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape");

    pdf.text("Excel Data Analyzer Report", 14, 15);
    pdf.text(
        `Rows: ${data.length} | Columns: ${headers.length}`,
        14,
        22
    );

    if (typeof pdf.autoTable !== "function") {
        alert("PDF table plugin could not load.");
        return;
    }

    pdf.autoTable({
        head: [headers.slice(0, 10)],
        body: data.slice(0, 100).map(row => row.slice(0, 10)),
        startY: 30,
        styles: {
            fontSize: 7,
            cellPadding: 2
        }
    });

    pdf.save("Excel_Data_Analyzer_Report.pdf");
});

// ============================================
// DARK MODE
// ============================================

$("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    $("themeIcon").textContent = isDark ? "☀" : "☾";
    $("themeLabel").textContent = isDark ? "Light mode" : "Dark mode";

    drawCharts();
});

// ============================================
// REFRESH EVERYTHING
// ============================================

function refresh() {
    updateDropdowns();
    displayTable();
    analyzeData();
    drawCharts();
    updateUndoRedoButtons();
}

// ============================================
// INITIAL PAGE LOAD
// ============================================

updateUndoRedoButtons();
loadSampleData();
