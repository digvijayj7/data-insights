# CSV Dashboard

Upload a CSV, see a preview plus numeric summaries (sum / avg / min / max) with simple bar visualizations.

## Structure

```
csv-dashboard/
├── backend/      FastAPI service (parses CSV, returns columns/rows/stats)
└── frontend/     React + Vite dashboard (upload, preview, charts)
```

## Setup

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs at http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173 (proxies `/api` → backend on :8000)

## How it works
- Drag & drop or browse a `.csv` in the UI.
- Frontend POSTs it as `multipart/form-data` to `/api/upload`.
- Backend parses headers + rows, infers numeric columns, and returns JSON.
- Dashboard renders a preview table (first 100 rows) + labeled bars for each numeric column's sum.

## API
`POST /api/upload` — form field `file` →
```json
{
  "filename": "data.csv",
  "columns": ["id", "amount"],
  "rows": [["1", "100"], ...],
  "rowCount": 1,
  "numericStats": { "amount": { "sum": 100, "min": 100, "max": 100, "avg": 100, "count": 1 } }
}
```

🚀 Let's make it "Even Better"

  If we want to move from a "basic utility" to a "wow" app, we
  need to move beyond just showing a table and a few bars.

  Here are three "Vibe Paths" we can take. Which one sounds most
  exciting to you?

  Path A: The "Data Scientist" (Visual Power)

  Instead of simple colored bars, we integrate a real charting
  library (like Recharts or Chart.js).
  - The Vibe: Professional analytics dashboard.
  - Features:
    - Actual Line/Bar/Pie charts.
    - Ability to pick which column to plot on the X and Y axis.
    - Data filtering and sorting directly in the browser.

  Path B: The "AI Analyst" (The Magic Path)

  We connect the backend to an LLM (like Claude).
  - The Vibe: "Chat with your Data."
  - Features:
    - A chat box where you ask: "Who were the top 5 customers by
  spend?" or "Is there a correlation between age and purchase
  volume?"
    - The AI analyzes the CSV and gives you the answer (or even
  generates the chart for you).

  Path C: The "SaaS Product" (UX/UI Overhaul)

  We move away from basic CSS and go full Modern Web.
  - The Vibe: A polished, high-end product like Airtable or
  Notion.
  - Features:
    - Dark mode/Light mode.
    - Beautiful drag-and-drop animations.
    - A "Data Health" report (detecting missing values,
  outliers, or formatting errors automatically).

  Which path should we start with? Or do you have a completely
  different "vibe" in mind? Tell me what you're dreaming of and
  I'll start writing the code!