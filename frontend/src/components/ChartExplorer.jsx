import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PALETTE = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
];

export default function ChartExplorer({ data, xAxis, setXAxis, yAxis, setYAxis, chartType, setChartType }) {
  const { columns, rows, numericStats } = data;
  const numericCols = Object.keys(numericStats || {});

  // Limit data to 1000 points for performance
  const chartData = rows.slice(0, 1000);

  return (
    <section className="card" style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Data Insight Explorer</h3>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* X-Axis Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>X-AXIS (Category)</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              style={{ 
                padding: "0.5rem", 
                borderRadius: "var(--radius-md)", 
                border: "1px solid var(--border-color)", 
                background: "var(--bg-color)",
                color: "var(--text-primary)",
                minWidth: "140px"
              }}
            >
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          {/* Y-Axis Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>Y-AXIS (Numeric)</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              style={{ 
                padding: "0.5rem", 
                borderRadius: "var(--radius-md)", 
                border: "1px solid var(--border-color)", 
                background: "var(--bg-color)",
                color: "var(--text-primary)",
                minWidth: "140px"
              }}
            >
              {numericCols.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          {/* Chart Type Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>VISUALIZATION</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ 
                padding: "0.5rem", 
                borderRadius: "var(--radius-md)", 
                border: "1px solid var(--border-color)", 
                background: "var(--bg-color)",
                color: "var(--text-primary)",
                minWidth: "140px"
              }}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey={xAxis} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-md)" }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20 }} />
              <Bar dataKey={yAxis} fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey={xAxis} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-md)" }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20 }} />
              <Line type="monotone" dataKey={yAxis} stroke={PALETTE[0]} strokeWidth={3} dot={{ r: 2, fill: PALETTE[0] }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey={xAxis} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-md)" }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20 }} />
              <Area type="monotone" dataKey={yAxis} stroke={PALETTE[0]} fill={PALETTE[0]} fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          ) : (
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-md)" }} />
              <Legend verticalAlign="bottom" />
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
