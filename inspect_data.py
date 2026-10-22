"""Inspect the MaintNet aviation dataset.

Prints:
  • Total row count
  • Column names
  • First 3 sample rows
"""

import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent / "data" / "maintnet_aviation.csv"

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

print(f"Total rows : {len(df)}")
print(f"Total cols : {len(df.columns)}")
print(f"\nColumn names:\n  {list(df.columns)}")
print(f"\n--- First 3 sample rows ---")
print(df.head(3).to_string(index=False))
