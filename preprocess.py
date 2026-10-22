"""Preprocess the MaintNet aviation maintenance dataset.

Reads `data/maintnet_aviation.csv`, applies abbreviation normalization
from `utils.normalizer` to `PROBLEM` and `ACTION` columns, creates a
combined text representation for hybrid search/retrieval, and saves
the output to `data/maintnet_aviation_normalized.csv`.
"""

from pathlib import Path
import pandas as pd
from utils.normalizer import normalize

ROOT_DIR = Path(__file__).resolve().parent
INPUT_PATH = ROOT_DIR / "data" / "maintnet_aviation.csv"
OUTPUT_PATH = ROOT_DIR / "data" / "maintnet_aviation_normalized.csv"


def preprocess() -> None:
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_PATH}")

    print(f"Loading raw dataset from {INPUT_PATH}...")
    df = pd.read_csv(INPUT_PATH)
    total_rows = len(df)
    print(f"Total records loaded: {total_rows}")

    # Fill NaN values with empty string for text processing
    df["PROBLEM"] = df["PROBLEM"].fillna("").astype(str)
    df["ACTION"] = df["ACTION"].fillna("").astype(str)

    print("Normalizing aviation abbreviations in 'PROBLEM' and 'ACTION'...")
    df["PROBLEM_NORMALIZED"] = df["PROBLEM"].apply(normalize)
    df["ACTION_NORMALIZED"] = df["ACTION"].apply(normalize)

    # Create a structured combined representation useful for dense/sparse retrieval
    df["COMBINED_NORMALIZED"] = (
        "Problem: " + df["PROBLEM_NORMALIZED"] + " | Action: " + df["ACTION_NORMALIZED"]
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Successfully saved normalized dataset to {OUTPUT_PATH}")
    print(f"Saved rows: {len(df)}, columns: {list(df.columns)}")

    # Preview sample changes
    print("\n--- Sample Before vs. After (First 3 Rows) ---")
    for idx, row in df.head(3).iterrows():
        print(f"\n[Record {row['IDENT']}]")
        print(f"  Raw Problem       : {row['PROBLEM']}")
        print(f"  Normalized Problem: {row['PROBLEM_NORMALIZED']}")
        print(f"  Raw Action        : {row['ACTION']}")
        print(f"  Normalized Action : {row['ACTION_NORMALIZED']}")


if __name__ == "__main__":
    preprocess()
