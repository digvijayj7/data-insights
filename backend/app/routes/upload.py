import io
from typing import Any, Dict

import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile, File

router = APIRouter()


def _dataframe_to_records(df: pd.DataFrame) -> list[dict]:
    """Convert a DataFrame to a list of records safe for JSON.

    Pandas types (int64, float64, Timestamp, NaN) are not JSON-serializable
    on their own, so we normalize each value to a native Python type and
    turn NaN/NaT into None.
    """
    records = []
    for _, row in df.iterrows():
        record = {}
        for col in df.columns:
            value = row[col]
            # pd.isna covers NaN, NaT, and None — but raises on arrays.
            try:
                if pd.isna(value):
                    record[col] = None
                elif hasattr(value, "isoformat"):
                    # datetime / Timestamp -> ISO string
                    record[col] = value.isoformat()
                else:
                    record[col] = value.item() if hasattr(value, "item") else value
            except (TypeError, ValueError):
                record[col] = str(value)
        records.append(record)
    return records


def _numeric_summary(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    """Return {column: {min, max, mean, sum}} for every numeric column."""
    numeric = df.select_dtypes(include="number")
    if numeric.empty:
        return {}

    summary: Dict[str, Dict[str, float]] = {}
    for col in numeric.columns:
        summary[col] = {
            "min": float(numeric[col].min()),
            "max": float(numeric[col].max()),
            "avg": float(numeric[col].mean()),
            "sum": float(numeric[col].sum()),
        }
    return summary


def _data_health(df: pd.DataFrame) -> Dict[str, Dict[str, Any]]:
    """Return data quality metrics for every column."""
    health = {}
    for col in df.columns:
        dtype_str = str(df[col].dtype)
        if "int" in dtype_str:
            inferred_type = "Integer"
        elif "float" in dtype_str:
            inferred_type = "Float"
        elif "datetime" in dtype_str:
            inferred_type = "Date"
        elif "bool" in dtype_str:
            inferred_type = "Boolean"
        else:
            inferred_type = "Text/String"
            
        health[col] = {
            "missing": int(df[col].isna().sum()),
            "unique": int(df[col].nunique()),
            "type": inferred_type
        }
    return health

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        df = pd.read_csv(io.BytesIO(raw), on_bad_lines='warn')
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The CSV file appears to be empty.")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {exc}")

    columns = df.columns.tolist()

    # First 5 rows as a list of records — used for the preview table.
    preview = _dataframe_to_records(df.head(5))

    # Summary statistics for numeric columns (min, max, mean).
    summary = _numeric_summary(df)
    
    # Data Health check
    health = _data_health(df)

    # Full dataset as records — used for charting on the frontend.
    full_data = _dataframe_to_records(df)

    return {
        "filename": file.filename,
        "columns": columns,
        "rowCount": len(df),
        "preview": preview,
        "numericStats": summary,
        "dataHealth": health,
        "rows": full_data,
    }
