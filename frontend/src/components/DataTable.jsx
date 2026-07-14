import React, { useState, useMemo } from "react";

export default function DataTable({ data }) {
  const { columns, rows } = data;
  const [filterQuery, setFilterQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" }); // "asc", "desc", "none"

  // 1. Filter rows based on query
  const filteredRows = useMemo(() => {
    if (!filterQuery) return rows;
    const q = filterQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q))
    );
  }, [rows, filterQuery, columns]);

  // 2. Sort rows based on config
  const sortedRows = useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === "none") return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Handle numeric vs string sorting
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      const isNumeric = !isNaN(aNum) && !isNaN(bNum);

      if (isNumeric) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      } else {
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return sortConfig.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      }
    });
  }, [filteredRows, sortConfig]);

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "none" };
      return { key: null, direction: "none" };
    });
  }

  return (
    <section className="card" style={{ overflowX: "auto", marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Data Preview</h3>
        <input
          type="text"
          placeholder="Search in data..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-color)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            width: "300px",
            maxWidth: "100%"
          }}
        />
      </div>

      <div style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", background: "var(--surface-color)", color: "var(--text-primary)" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    borderBottom: "2px solid var(--border-color)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: "var(--bg-color)",
                    color: sortConfig.key === col ? "var(--primary-color)" : "var(--text-secondary)",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--border-color)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {col}
                    {sortConfig.key === col && (
                      <span style={{ fontSize: "0.7rem", color: "var(--primary-color)" }}>
                        {sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.slice(0, 100).map((row, r) => (
              <tr key={r} style={{ background: r % 2 ? "var(--bg-color)" : "var(--surface-color)" }}>
                {columns.map((col) => (
                  <td key={col} style={{
                    padding: "0.6rem 1rem",
                    borderBottom: "1px solid var(--border-color)",
                    whiteSpace: "nowrap",
                    maxWidth: 300,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {row[col] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedRows.length > 100 && (
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "1rem" }}>
          Showing first 100 of {sortedRows.length} matching rows.
        </p>
      )}
      {sortedRows.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          No matching data found.
        </div>
      )}
    </section>
  );
}
