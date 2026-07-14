import React, { useState } from "react";
import ChartExplorer from "./ChartExplorer.jsx";
import DataTable from "./DataTable.jsx";
import AIAnalyst from "./AIAnalyst.jsx";

const PALETTE = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
];

export default function Dashboard({ data, onClear }) {
  const { columns, rows, rowCount, numericStats, filename } = data;
  const numericCols = Object.keys(numericStats || {});

  // Chart State
  const [xAxis, setXAxis] = useState(columns[0] || "");
  const [yAxis, setYAxis] = useState(numericCols[0] || columns[0] || "");
  const [chartType, setChartType] = useState("bar");

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  const maxStat = numericCols.length ? Math.max(...numericCols.map((c) => numericStats[c].sum)) : 0;

  function fmt(n) {
    if (!isFinite(n)) return "—";
    if (Number.isInteger(n)) return n.toString();
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 4rem)", marginTop: "1rem", gap: "2rem" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ 
        width: "280px", 
        flexShrink: 0, 
        display: "flex", 
        flexDirection: "column", 
        gap: "1.5rem",
        overflowY: "auto",
        paddingRight: "0.5rem"
      }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0", wordBreak: "break-all" }}>{filename}</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
            {rowCount.toLocaleString()} rows · {columns.length} columns
          </p>
          <button 
            onClick={onClear} 
            style={{ 
              marginTop: "1rem", 
              width: "100%", 
              background: "var(--surface-color)", 
              color: "var(--text-primary)", 
              border: "1px solid var(--border-color)",
              padding: "0.4rem"
            }}
          >
            ← Upload new file
          </button>
        </div>

        {data.dataHealth && (
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 600 }}>Data Health</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {columns.map(col => {
                const health = data.dataHealth[col];
                const missingPercent = rowCount > 0 ? (health.missing / rowCount) * 100 : 0;
                return (
                  <div key={col} style={{ 
                    background: "var(--bg-color)", 
                    padding: "0.75rem", 
                    borderRadius: "var(--radius-md)", 
                    border: "1px solid var(--border-color)" 
                  }}>
                    <strong style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis" }}>{col}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <div>Type: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{health.type}</span></div>
                      <div>Unique: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{health.unique}</span></div>
                      <div style={{ color: health.missing > 0 ? "var(--danger-color)" : "var(--success-color)", fontWeight: 500, marginTop: "0.15rem" }}>
                        Missing: {health.missing} ({missingPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* TABS */}
        <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
          <button 
            onClick={() => setActiveTab("overview")}
            style={{
              background: "transparent",
              color: activeTab === "overview" ? "var(--primary-color)" : "var(--text-secondary)",
              border: "none",
              borderBottom: activeTab === "overview" ? "2px solid var(--primary-color)" : "2px solid transparent",
              borderRadius: 0,
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("raw")}
            style={{
              background: "transparent",
              color: activeTab === "raw" ? "var(--primary-color)" : "var(--text-secondary)",
              border: "none",
              borderBottom: activeTab === "raw" ? "2px solid var(--primary-color)" : "2px solid transparent",
              borderRadius: 0,
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Raw Data
          </button>
        </div>

        {/* TAB CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
          
          {activeTab === "overview" && (
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Numeric Summaries (Left Column) */}
              {numericCols.length > 0 && (
                <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ margin: "0", fontSize: "1.1rem", fontWeight: 600 }}>Numeric Summaries</h3>
                  {numericCols.map((col, i) => {
                    const stat = numericStats[col];
                    const width = maxStat > 0 ? (stat.sum / maxStat) * 100 : 0;
                    return (
                      <div key={col} className="card" style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <strong style={{ fontSize: "0.95rem" }}>{col}</strong>
                        </div>
                        <div style={{ 
                          display: "grid", 
                          gridTemplateColumns: "1fr 1fr", 
                          gap: "0.5rem", 
                          color: "var(--text-secondary)", 
                          fontSize: "0.85rem",
                          marginBottom: "0.75rem"
                        }}>
                          <div><span style={{opacity: 0.7}}>Sum:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.sum)}</span></div>
                          <div><span style={{opacity: 0.7}}>Avg:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.avg)}</span></div>
                          <div><span style={{opacity: 0.7}}>Min:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.min)}</span></div>
                          <div><span style={{opacity: 0.7}}>Max:</span> <span style={{color: "var(--text-primary)", fontWeight: 500}}>{fmt(stat.max)}</span></div>
                        </div>
                        <div style={{ background: "var(--border-color)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${width}%`, height: "100%", background: PALETTE[i % PALETTE.length], borderRadius: 6 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chart Explorer (Right Column) */}
              <div style={{ flex: 1, minWidth: "400px" }}>
                <ChartExplorer
                  data={data}
                  xAxis={xAxis}
                  setXAxis={setXAxis}
                  yAxis={yAxis}
                  setYAxis={setYAxis}
                  chartType={chartType}
                  setChartType={setChartType}
                />
              </div>
            </div>
          )}

          {activeTab === "raw" && (
             <DataTable data={data} />
          )}

        </div>
      </div>

      {/* Floating AI Widget */}
      <AIAnalyst data={data} />
    </div>
  );
}
