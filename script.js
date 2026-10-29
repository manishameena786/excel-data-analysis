
let data = [];
let uploadedData = null;

let barChart = null;
let lineChart = null;
let avgChart = null;

const rowInput = document.getElementById("rowCount");
const colInput = document.getElementById("colCount");
const fileInput = document.getElementById("fileInput");

const sampleData = [
    ["Student", "Python", "Java", "DBMS"],
    ["A", 80, 70, 90],
    ["B", 60, 85, 75],
    ["C", 90, 95, 80]
];

// ---------- Upload Excel or CSV ----------

document.getElementById("uploadBtn").addEventListener("click", function () {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an Excel or CSV file first.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("File size must be 10 MB or less.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const workbook = XLSX.read(event.target.result, {
                type: "array"
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            uploadedData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: ""
            });

            if (uploadedData.length === 0) {
                throw new Error("The selected sheet is empty.");
            }

            const columnCount = uploadedData.reduce(function (max, row) {
                return Math.max(max, row.length);
            }, 0);

            if (uploadedData.length > 5001 || columnCount > 100) {
                uploadedData = null;
                throw new Error("Maximum allowed: 5000 data rows and 100 columns.");
            }

            document.getElementById("uploadMessage").textContent =
                "File uploaded! Enter the rows and columns you want, then click Apply Selection.";

            document.getElementById("tableMessage").textContent =
                "The selected portion of your Excel sheet will appear here.";

        } catch (error) {
            document.getElementById("uploadMessage").textContent =
                error.message || "Unable to read this file.";
        }
    };

    reader.onerror = function () {
        alert("Unable to read the selected file.");
    };

    reader.readAsArrayBuffer(file);
});

// ---------- Apply selected rows and columns ----------

document.getElementById("applySelectionBtn").addEventListener("click", function () {
    if (!uploadedData || uploadedData.length === 0) {
        alert("Please upload an Excel file or load sample data first.");
        return;
    }

    const rows = Number(rowInput.value);
    const cols = Number(colInput.value);

    if (!Number.isInteger(rows) || rows < 1 || rows > 5000 ||
        !Number.isInteger(cols) || cols < 1 || cols > 100) {
        alert("Enter 1-5000 rows and 1-100 columns.");
        return;
    }

    const availableColumns = uploadedData.reduce(function (max, row) {
        return Math.max(max, row.length);
    }, 0);

    if (cols > availableColumns) {
        alert("The Excel sheet has only " + availableColumns + " columns.");
        return;
    }

    // Select only the requested columns.
    const selectedColumns = uploadedData.map(function (row) {
        return row.slice(0, cols);
    });

    // Row 1 is the header; rows means data rows below the header.
    data = selectedColumns.slice(0, rows + 1);

    document.getElementById("tableMessage").textContent =
        "Showing " + Math.max(0, data.length - 1) +
        " data rows and " + cols + " columns.";

    displayTable();
    analyzeData();
});

// ---------- Load sample data ----------

document.getElementById("sampleBtn").addEventListener("click", function () {
    uploadedData = sampleData.map(function (row) {
        return [...row];
    });

    rowInput.value = 3;
    colInput.value = 4;

    document.getElementById("uploadMessage").textContent =
        "Sample data loaded. Change the selection and click Apply Selection if needed.";

    document.getElementById("applySelectionBtn").click();
});

// ---------- Create an empty manual table ----------

document.getElementById("createBtn").addEventListener("click", function () {
    const rows = Number(rowInput.value);
    const cols = Number(colInput.value);

    if (!Number.isInteger(rows) || rows < 1 || rows > 5000 ||
        !Number.isInteger(cols) || cols < 1 || cols > 100) {
        alert("Enter 1-5000 rows and 1-100 columns.");
        return;
    }

    uploadedData = null;

    data = [];

    const headers = [];

    for (let c = 0; c < cols; c++) {
        headers.push("Column " + (c + 1));
    }

    data.push(headers);

    for (let r = 0; r < rows; r++) {
        data.push(Array(cols).fill(""));
    }

    document.getElementById("uploadMessage").textContent =
        "Manual table created.";

    document.getElementById("tableMessage").textContent =
        "Enter your data in the editable cells.";

    displayTable();
    analyzeData();
});

// ---------- Display editable table ----------

function displayTable() {
    const tableArea = document.getElementById("tableArea");
    tableArea.innerHTML = "";

    if (data.length === 0) {
        tableArea.textContent = "No data available.";
        return;
    }

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");

    data[0].forEach(function (heading) {
        const th = document.createElement("th");
        th.textContent = heading === "" ? "(blank header)" : heading;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    for (let r = 1; r < data.length; r++) {
        const tr = document.createElement("tr");

        for (let c = 0; c < data[r].length; c++) {
            const td = document.createElement("td");
            const input = document.createElement("input");

            input.type = "text";
            input.value = data[r][c] ?? "";
            input.setAttribute("aria-label", "Row " + r + ", Column " + (c + 1));

            input.addEventListener("input", function () {
                data[r][c] = input.value;
            });

            td.appendChild(input);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableArea.appendChild(table);
}

// ---------- Add a row ----------

document.getElementById("addRowBtn").addEventListener("click", function () {
    if (data.length === 0) {
        alert("Load data or create a table first.");
        return;
    }

    if (data.length >= 5001) {
        alert("Maximum 5000 data rows allowed.");
        return;
    }

    data.push(Array(data[0].length).fill(""));

    rowInput.value = data.length - 1;

    displayTable();
    analyzeData();
});

// ---------- Add a column ----------

document.getElementById("addColBtn").addEventListener("click", function () {
    if (data.length === 0) {
        alert("Load data or create a table first.");
        return;
    }

    if (data[0].length >= 100) {
        alert("Maximum 100 columns allowed.");
        return;
    }

    const newColumn = data[0].length + 1;
    data[0].push("Column " + newColumn);

    for (let r = 1; r < data.length; r++) {
        data[r].push("");
    }

    colInput.value = newColumn;

    displayTable();
    analyzeData();
});

// ---------- Analyze button ----------

document.getElementById("analyzeBtn").addEventListener("click", function () {
    analyzeData();
});

// ---------- Get numeric values from a column ----------

function getColumnNumbers(columnIndex) {
    const values = [];

    for (let r = 1; r < data.length; r++) {
        const value = data[r][columnIndex];

        if (value === "" || value === null || value === undefined) {
            continue;
        }

        const number = Number(value);

        if (Number.isFinite(number)) {
            values.push(number);
        }
    }

    return values;
}

// ---------- Calculate statistics ----------

function getStatistics(values) {
    if (values.length === 0) {
        return null;
    }

    const sorted = [...values].sort(function (a, b) {
        return a - b;
    });

    const count = values.length;
    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / count;

    let median;

    if (count % 2 === 0) {
        median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    } else {
        median = sorted[Math.floor(count / 2)];
    }

    const frequencies = {};

    values.forEach(function (value) {
        frequencies[value] = (frequencies[value] || 0) + 1;
    });

    const highestFrequency = Math.max(...Object.values(frequencies));

    const modes = Object.keys(frequencies)
        .filter(key => frequencies[key] === highestFrequency)
        .map(Number);

    const mode = highestFrequency === 1
        ? "No mode"
        : modes.join(", ");

    const min = Math.min(...values);
    const max = Math.max(...values);

    const variance = values.reduce(function (total, value) {
        return total + Math.pow(value - mean, 2);
    }, 0) / count;

    const standardDeviation = Math.sqrt(variance);

    return {
        count,
        sum,
        mean,
        median,
        mode,
        min,
        max,
        variance,
        standardDeviation
    };
}

// ---------- Main analysis ----------

function analyzeData() {
    const statsArea = document.getElementById("statsArea");
    const summaryArea = document.getElementById("summaryArea");
    const columnSelect = document.getElementById("columnSelect");

    statsArea.innerHTML = "";
    summaryArea.innerHTML = "";

    if (data.length < 2 || data[0].length === 0) {
        statsArea.textContent = "Add at least one data row to analyze.";
        updateColumnOptions([]);
        destroyCharts();
        return;
    }

    const numericColumns = [];

    for (let c = 0; c < data[0].length; c++) {
        const values = getColumnNumbers(c);

        if (values.length > 0) {
            numericColumns.push({
                index: c,
                name: String(data[0][c] || "Column " + (c + 1)),
                values: values,
                stats: getStatistics(values)
            });
        }
    }

    if (numericColumns.length === 0) {
        statsArea.textContent = "No numeric data found. Enter numbers in the table.";
        summaryArea.textContent = "";
        updateColumnOptions([]);
        destroyCharts();
        return;
    }

    const selectedIndex = Number(columnSelect.value);
    const chosen = numericColumns.find(item => item.index === selectedIndex)
        || numericColumns[0];

    // Show statistics for the selected numeric column.
    const s = chosen.stats;

    const cards = [
        ["Column", chosen.name],
        ["Count", s.count],
        ["Sum", s.sum],
        ["Mean / Average", s.mean.toFixed(2)],
        ["Median", s.median],
        ["Mode", s.mode],
        ["Minimum", s.min],
        ["Maximum", s.max],
        ["Variance", s.variance.toFixed(2)],
        ["Standard Deviation", s.standardDeviation.toFixed(2)]
    ];

    cards.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "stat-card";

        const heading = document.createElement("h3");
        heading.textContent = item[0];

        const value = document.createElement("p");
        value.textContent = item[1];

        card.appendChild(heading);
        card.appendChild(value);
        statsArea.appendChild(card);
    });

    // Summary table for all numeric columns.
    const summaryTable = document.createElement("table");
    summaryTable.innerHTML = `
        <thead>
            <tr>
                <th>Column</th>
                <th>Count</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Minimum</th>
                <th>Maximum</th>
                <th>Std. Deviation</th>
            </tr>
        </thead>
    `;

    const summaryBody = document.createElement("tbody");

    numericColumns.forEach(function (item) {
        const row = document.createElement("tr");

        [
            item.name,
            item.stats.count,
            item.stats.mean.toFixed(2),
            item.stats.median,
            item.stats.min,
            item.stats.max,
            item.stats.standardDeviation.toFixed(2)
        ].forEach(function (value) {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        summaryBody.appendChild(row);
    });

    summaryTable.appendChild(summaryBody);
    summaryArea.appendChild(summaryTable);

    updateColumnOptions(numericColumns);
    drawSelectedCharts(chosen);
    drawAverageChart(numericColumns);
}

// ---------- Update numeric column dropdown ----------

function updateColumnOptions(numericColumns) {
    const select = document.getElementById("columnSelect");
    const oldValue = select.value;

    select.innerHTML = "";

    if (numericColumns.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No numeric column";
        select.appendChild(option);
        return;
    }

    numericColumns.forEach(function (item) {
        const option = document.createElement("option");
        option.value = item.index;
        option.textContent = item.name;
        select.appendChild(option);
    });

    const oldOptionExists = numericColumns.some(
        item => String(item.index) === oldValue
    );

    if (oldOptionExists) {
        select.value = oldValue;
    } else {
        select.value = String(numericColumns[0].index);
    }
}

// ---------- Redraw when a different column is selected ----------

document.getElementById("columnSelect").addEventListener("change", function () {
    analyzeData();
});

// ---------- Destroy old graphs ----------

function destroyCharts() {
    if (barChart) {
        barChart.destroy();
        barChart = null;
    }

    if (lineChart) {
        lineChart.destroy();
        lineChart = null;
    }

    if (avgChart) {
        avgChart.destroy();
        avgChart = null;
    }
}

// ---------- Draw bar and line charts ----------

function drawSelectedCharts(chosen) {
    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();

    const values = chosen.values;

    const labels = [];

    for (let i = 1; i < data.length; i++) {
        labels.push(String(data[i][0] || "Row " + i));
    }

    const chartLabels = values.map(function (_, index) {
        return labels[index] || "Row " + (index + 1);
    });

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: chartLabels,
            datasets: [{
                label: chosen.name,
                data: values
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: chartLabels,
            datasets: [{
                label: chosen.name,
                data: values,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// ---------- Average chart for numeric columns ----------

function drawAverageChart(numericColumns) {
    if (avgChart) avgChart.destroy();

    avgChart = new Chart(document.getElementById("avgChart"), {
        type: "bar",
        data: {
            labels: numericColumns.map(item => item.name),
            datasets: [{
                label: "Average",
                data: numericColumns.map(item => item.stats.mean)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// ---------- Start with sample data ----------

document.getElementById("sampleBtn").click();
