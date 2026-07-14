import React, { useState } from "react";
import ChartExplorer from "./ChartExplorer.jsx";
import DataTable from "./DataTable.jsx";
import AIAnalyst from "./AIAnalyst.jsx";

const PALETTE = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
];

export default function Dashboard({ data }) {
  const { columns, rows, rowCount, numericStats, filename } = data;
  const numericCols = Object.keys(numericStats || {});

  // Chart State
  const [xAxis, setXAxis] = useState(columns[0] || "");
  const [yAxis, setYAxis] = useState(numericCols[0] || columns[0] || "");
  const [chartType, setChartType] = useState("bar");

  const maxStat = numericCols.length ? Math.max(...numericCols.map((c) => numericStats[c].sum)) : 0;

  return (
    <div style={{ marginTop: "1rem" }}>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.25rem", marginTop: 0 }}>{filename}</h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          {rowCount} row{rowCount === 1 ? "" : "s"} · {columns.length} column{columns.length === 1 ? "" : "s"}
        </p>
      </div>

      {data.dataHealth && (
        <section className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", marginTop: 0, fontWeight: 600 }}>Data Health Profiler</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {columns.map(col => {
              const health = data.dataHealth[col];
              const missingPercent = rowCount > 0 ? (health.missing / rowCount) * 100 : 0;
              return (
                <div key={col} style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.95rem" }}>{col}</strong>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <div>Type: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{health.type}</span></div>
                    <div>Unique: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{health.unique}</span></div>
                    <div style={{ color: health.missing > 0 ? "var(--danger-color)" : "var(--success-color)", fontWeight: 500, marginTop: "0.25rem" }}>
                      Missing: {health.missing} ({missingPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {numericCols.length > 0 && (
        <section className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", marginTop: 0, fontWeight: 600 }}>Numeric Summaries</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {numericCols.map((col, i) => {
              const stat = numericStats[col];
              const width = maxStat > 0 ? (stat.sum / maxStat) * 100 : 0;
              return (
                <div key={col} style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{col}</strong>
                  </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "0.5rem", 
                    color: "var(--text-secondary)", 
                    fontSize: "0.85rem",
                    marginBottom: "1rem"
                  }}>
                    <div><span style={{opacity: 0.7}}>Sum:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.sum)}</span></div>
                    <div><span style={{opacity: 0.7}}>Avg:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.avg)}</span></div>
                    <div><span style={{opacity: 0.7}}>Min:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.min)}</span></div>
                    <div><span style={{opacity: 0.7}}>Max:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.max)}</span></div>
                  </div>
                  <div style={{ background: "var(--border-color)", borderRadius: 6, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${width}%`, height: "100%", background: PALETTE[i % PALETTE.length], borderRadius: 6 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <ChartExplorer
        data={data}
        xAxis={xAxis}
        setXAxis={setXAxis}
        yAxis={yAxis}
        setYAxis={setYAxis}
        chartType={chartType}
        setChartType={setChartType}
      />

      <AIAnalyst data={data} />

      <DataTable data={data} />
    </div>
  );
}

function fmt(n) {
  if (!isFinite(n)) return "—";
  if (Number.isInteger(n)) return n.toString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
