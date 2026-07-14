import React, { useRef, useState } from "react";

export default function FileUploader({ onData, onError }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      onError("Please choose a .csv file.");
      return;
    }

    setLoading(true);
    onError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        onError(json.detail || "Upload failed.");
        return;
      }
      onData(json);
    } catch (err) {
      onError("Could not reach the server. Is the backend running on :8000?");
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e) {
    handleFile(e.target.files?.[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className="card"
      style={{
        border: `2px dashed ${dragOver ? "var(--primary-color)" : "var(--border-color)"}`,
        textAlign: "center",
        background: dragOver ? "var(--surface-color)" : "var(--bg-color)",
        cursor: "pointer",
        padding: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px"
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={onInputChange}
        style={{ display: "none" }}
      />
      {loading ? (
        <div style={{ color: "var(--primary-color)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            border: "3px solid var(--border-color)", borderTopColor: "var(--primary-color)",
            animation: "spin 1s linear infinite"
          }} />
          Processing…
        </div>
      ) : (
        <>
          <div style={{ 
            background: "var(--surface-color)", 
            padding: "1rem", 
            borderRadius: "50%", 
            marginBottom: "1rem",
            boxShadow: "var(--shadow-sm)",
            color: "var(--primary-color)"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem", color: "var(--text-primary)" }}>
            Drag & drop a CSV here, or click to browse
          </p>
          <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Only .csv files are supported
          </p>
        </>
      )}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
