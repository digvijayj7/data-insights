import React, { useState } from "react";

export default function AIAnalyst({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([
    { role: "ai", text: "Hello! I am your local AI Analyst. Ask me questions about your data, like 'What is the sum of Sales?' or 'Are there missing values?'" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: "user", text: query };
    setHistory(prev => [...prev, userMsg]);
    setQuery("");
    setIsTyping(true);

    // Simple rule-based local query
    setTimeout(() => {
      const q = userMsg.text.toLowerCase();
      let response = "I couldn't quite understand that. Try asking about 'missing values', 'columns', 'rows', or specific stats like 'sum of [column]'.";

      if (q.includes("missing") || q.includes("null")) {
        const missingCols = Object.keys(data.dataHealth).filter(c => data.dataHealth[c].missing > 0);
        if (missingCols.length > 0) {
          response = `Yes, the following columns have missing values: ${missingCols.join(", ")}.`;
        } else {
          response = "Great news! Your dataset has absolutely no missing values.";
        }
      } else if (q.includes("sum of") || q.includes("average of") || q.includes("min of") || q.includes("max of")) {
        const type = q.includes("sum") ? "sum" : q.includes("average") ? "avg" : q.includes("min") ? "min" : "max";
        const targetCol = Object.keys(data.numericStats).find(c => q.includes(c.toLowerCase()));
        
        if (targetCol) {
          response = `The ${type} of ${targetCol} is ${data.numericStats[targetCol][type].toLocaleString(undefined, {maximumFractionDigits: 2})}.`;
        } else {
          response = `I couldn't find a numeric column matching your query. Available numeric columns: ${Object.keys(data.numericStats).join(", ")}.`;
        }
      } else if (q.includes("row") || q.includes("size") || q.includes("count")) {
        response = `The dataset has ${data.rowCount} rows and ${data.columns.length} columns.`;
      } else if (q.includes("column") || q.includes("field")) {
        response = `The columns in this dataset are: ${data.columns.join(", ")}.`;
      }

      setHistory(prev => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 600);
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end"
    }}>
      {/* CHAT WINDOW */}
      {isOpen && (
        <section className="card" style={{ 
          width: "350px", 
          height: "450px", 
          marginBottom: "1rem", 
          display: "flex", 
          flexDirection: "column",
          padding: "1rem",
          boxShadow: "var(--shadow-lg)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>🤖 AI Analyst</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-secondary)", padding: "0.2rem" }}>
              ✕
            </button>
          </div>
          
          <div style={{ 
            flex: 1, 
            overflowY: "auto", 
            background: "var(--bg-color)", 
            borderRadius: "var(--radius-md)", 
            padding: "1rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem",
            border: "1px solid var(--border-color)",
            marginBottom: "1rem"
          }}>
            {history.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "var(--primary-color)" : "var(--surface-color)",
                color: msg.role === "user" ? "white" : "var(--text-primary)",
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--radius-md)",
                maxWidth: "85%",
                border: msg.role === "ai" ? "1px solid var(--border-color)" : "none",
                boxShadow: "var(--shadow-sm)",
                lineHeight: 1.4,
                fontSize: "0.9rem"
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: "flex-start", color: "var(--text-secondary)", fontSize: "0.85rem", fontStyle: "italic" }}>
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-color)",
                color: "var(--text-primary)",
                fontSize: "0.9rem"
              }}
            />
            <button type="submit" style={{ padding: "0.6rem 1rem" }}>Send</button>
          </form>
        </section>
      )}

      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-lg)",
            fontSize: "1.5rem"
          }}
        >
          ✨
        </button>
      )}
    </div>
  );
}
