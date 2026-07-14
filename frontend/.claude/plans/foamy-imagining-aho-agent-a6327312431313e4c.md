# Implementation Plan: Path A - The Data Scientist Upgrades

## Overview
Upgrade the CSV Dashboard to provide interactive data exploration capabilities, including dynamic charting and an enhanced data table with filtering and sorting.

## 1. Component Architecture

### Components to Create/Modify
- **`Dashboard.jsx` (Modify)**: 
    - Act as the state orchestrator.
    - Manage state for axis selection, chart type, table filtering, and sorting.
    - Coordinate data flow between the `ChartExplorer` and `DataTable`.
- **`ChartExplorer.jsx` (New)**:
    - Provide UI for selecting X-axis (any column) and Y-axis (numeric columns only).
    - Provide a toggle/dropdown to switch between `BarChart` and `LineChart`.
    - Render the selected Recharts component.
    - Implement data sampling/limiting to prevent performance degradation with large datasets.
- **`DataTable.jsx` (New)**:
    - Provide a search input for global row filtering.
    - Render the data table with clickable headers for sorting.
    - Display a count of filtered rows.

## 2. State Management Strategy

State will be managed in `Dashboard.jsx` using `useState` and `useMemo`:

- `xAxis`: `string` - The column selected for the chart X-axis.
- `yAxis`: `string` - The column selected for the chart Y-axis (must be in `numericStats`).
- `chartType`: `'bar' | 'line'` - Current chart visualization type.
- `filterQuery`: `string` - The current search term for the table.
- `sortConfig`: `{ key: string, direction: 'asc' | 'desc' } | null` - Current sort state.

**Data Pipelines (useMemo):**
- `filteredRows`: `rows` $\to$ filter by `filterQuery`.
- `sortedRows`: `filteredRows` $\to$ sort by `sortConfig`.
- `chartData`: `rows` $\to$ sample/aggregate $\to$ format for Recharts.

## 3. Detailed Implementation Steps

### Phase 1: Chart Explorer
1. **Setup Axis Selection**:
    - Map `columns` to the X-axis dropdown.
    - Map `Object.keys(numericStats)` to the Y-axis dropdown.
2. **Implement Chart Rendering**:
    - Import `BarChart`, `LineChart`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `Bar`, `Line`, `ResponsiveContainer` from `recharts`.
    - Create a wrapper that switches between `Bar` and `Line` based on `chartType`.
3. **Handle Large Datasets**:
    - Limit chart data to the first 1,000 rows or the top 50 unique X-axis categories to ensure responsiveness.

### Phase 2: Enhanced Data Table
1. **Implement Filtering**:
    - Add a text input.
    - Use a case-insensitive search that checks if `filterQuery` exists in any value of the row.
2. **Implement Sorting**:
    - Add `onClick` handlers to `<th>` elements.
    - Implement a sorting function that handles both numeric and string comparisons.
    - Cycle sorting order: `asc` $\to$ `desc` $\to$ `null`.

### Phase 3: UI/UX Improvements
1. **Layout**:
    - Wrap the "Chart Explorer" in a professional section with a light gray background or border to separate it from summaries and the table.
    - Use a responsive grid or flex layout for the controls.
2. **Styling**:
    - Align with the existing `PALETTE` and minimal aesthetic.

## 4. Data Type & Charting Logic
- **Categorical X-Axis**: Treat values as strings.
- **Numeric Y-Axis**: Ensure values are cast to numbers for Recharts.
- **Aggregation**: If the number of unique X values is low but total rows are high, implement a simple "Sum" aggregation for the bar chart to make it more meaningful.

## 5. Verification Plan

| Feature | Test Case | Expected Result |
| :--- | :--- | :--- |
| **Axis Selection** | Select a non-numeric column for Y-axis | Should be impossible (not in dropdown). |
| **Chart Update** | Change X or Y axis selection | Chart updates instantly without page reload. |
| **Chart Type** | Switch Bar $\to$ Line | Visualization changes while maintaining data. |
| **Table Filter** | Enter "abc" in search | Only rows containing "abc" in any cell are shown. |
| **Table Sort** | Click "Price" column header | Rows sort by price ascending, then descending on second click. |
| **Performance** | Upload 10k row CSV | UI remains responsive; chart uses sampled data. |

### Critical Files for Implementation
- `src/components/Dashboard.jsx`
- `src/components/ChartExplorer.jsx` (to be created)
- `src/components/DataTable.jsx` (to be created)
