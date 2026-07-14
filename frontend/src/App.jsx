import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Theme toggle
  const [theme, setTheme] = useState("light");
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "1rem"
      }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>CSV Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Upload a CSV file to explore its contents and numeric summaries.
          </p>
        </div>
        <button onClick={toggleTheme} style={{
          background: "var(--surface-color)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>

      {!data ? (
        <FileUploader onData={setData} onError={setError} />
      ) : (
        <Dashboard data={data} onClear={() => setData(null)} />
      )}

      {error && (
        <div style={{ 
          marginTop: "1rem", 
          color: "var(--danger-color)", 
          background: "var(--danger-bg)", 
          padding: "1rem", 
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--danger-color)",
          fontWeight: 500
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
