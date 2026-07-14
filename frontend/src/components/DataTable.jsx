import React, { useState, useMemo } from "react";

export default function DataTable({ data }) {
  const { columns, rows } = data;
  const [filterQuery, setFilterQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" }); // "asc", "desc", "none"
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

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

  // Reset pagination when filter or sort changes
  useMemo(() => setCurrentPage(1), [filterQuery, sortConfig]);

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "none" };
      return { key: null, direction: "none" };
    });
  }

  // Calculate pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Raw Data</h3>
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

      <div style={{ 
        flex: 1, 
        overflow: "auto", 
        borderRadius: "var(--radius-md)", 
        border: "1px solid var(--border-color)",
        background: "var(--surface-color)",
        position: "relative"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", color: "var(--text-primary)" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg-color)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid var(--border-color)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    userSelect: "none",
                    color: sortConfig.key === col ? "var(--primary-color)" : "var(--text-secondary)",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--border-color)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
            {paginatedRows.map((row, r) => (
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
        {paginatedRows.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            No matching data found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Showing {sortedRows.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length} entries
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            style={{ 
              background: "var(--bg-color)", 
              color: currentPage === 1 ? "var(--text-secondary)" : "var(--text-primary)", 
              border: "1px solid var(--border-color)",
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              padding: "0.4rem 0.75rem"
            }}
          >
            Previous
          </button>
          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", padding: "0 0.5rem" }}>
            Page {currentPage} of {Math.max(1, totalPages)}
          </div>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            style={{ 
              background: "var(--bg-color)", 
              color: (currentPage === totalPages || totalPages === 0) ? "var(--text-secondary)" : "var(--text-primary)", 
              border: "1px solid var(--border-color)",
              opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1,
              cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
              padding: "0.4rem 0.75rem"
            }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
