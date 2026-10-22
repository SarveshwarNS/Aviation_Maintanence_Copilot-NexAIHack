"""Aviation maintenance abbreviation and grammar normalizer.

Loads dynamic datasets:
  - Aviation_Abbreviation_Dataset.csv -> AVIATION_ABBREVIATIONS
  - Aviation_grammar_Dataset.csv      -> GRAMMAR_MAPPINGS / Lemmatization

Provides:
  - `normalize_text(text: str) -> str`
  - `normalize(text: str) -> str`
  - `load_abbreviations(path)`
  - `load_grammar_mappings(path)`
"""

from __future__ import annotations

import csv
import re
from pathlib import Path
from typing import Dict

# Locate project and data directory
_MODULE_DIR = Path(__file__).resolve().parent
_PROJECT_DIR = _MODULE_DIR.parent
_DATA_DIR = _PROJECT_DIR / "data"

ABBREVIATIONS_CSV = _DATA_DIR / "Aviation_Abbreviation_Dataset.csv"
GRAMMAR_CSV = _DATA_DIR / "Aviation_grammar_Dataset.csv"

# Baseline maintenance abbreviations ensuring coverage of standard logbook shorthand
DEFAULT_ABBREVIATIONS: dict[str, str] = {
    "acft": "aircraft",
    "hyd": "hydraulic",
    "press": "pressure",
    "insp": "inspection",
    "eng": "engine",
    "repl": "replaced",
    "chk": "checked",
    "alt": "alternator",
    "sys": "system",
}


def load_abbreviations(csv_path: Path | str | None = None) -> dict[str, str]:
    """Dynamically load aviation abbreviations from CSV dataset.

    Merges with DEFAULT_ABBREVIATIONS to guarantee complete logbook coverage.
    """
    abbr_dict = dict(DEFAULT_ABBREVIATIONS)
    target_path = Path(csv_path) if csv_path else ABBREVIATIONS_CSV

    if not target_path.exists():
        # Fallback to local data dir or current working dir if path differs
        alt_path = Path.cwd() / "data" / "Aviation_Abbreviation_Dataset.csv"
        if alt_path.exists():
            target_path = alt_path

    if target_path.exists():
        with open(target_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_abbr = (row.get("Abbreviated") or "").strip().lower()
                raw_desc = (row.get("Standard_Description") or "").strip().lower()
                if raw_abbr and raw_desc:
                    # Clean trailing whitespace or redundant punctuation
                    desc = re.sub(r"\s+", " ", raw_desc)
                    abbr_dict[raw_abbr] = desc

    return abbr_dict


def load_grammar_mappings(csv_path: Path | str | None = None) -> dict[str, str]:
    """Dynamically load word forms, lemmatizations, and morphosyntactic variants from CSV."""
    grammar_dict: dict[str, str] = {}
    target_path = Path(csv_path) if csv_path else GRAMMAR_CSV

    if not target_path.exists():
        alt_path = Path.cwd() / "data" / "Aviation_grammar_Dataset.csv"
        if alt_path.exists():
            target_path = alt_path

    if target_path.exists():
        with open(target_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                word = (row.get("Word") or "").strip().lower()
                lemma = (row.get("Lemma") or "").strip().lower()
                compound = (row.get("Compound") or "").strip().lower()

                # Clean whitespace
                word = re.sub(r"\s+", " ", word)
                lemma = re.sub(r"\s+", " ", lemma)

                if word and lemma and word != lemma:
                    grammar_dict[word] = lemma

                # Handle spelling or compound standardization
                if compound and compound != "-":
                    # map hyphenated compound to standard spaced form if hyphenated
                    clean_compound = compound.replace("-", " ")
                    if clean_compound != compound:
                        grammar_dict[compound] = clean_compound

    # Additional standard aviation logbook inflection mappings
    grammar_dict.setdefault("assystant", "assistant")
    grammar_dict.setdefault("replacing", "replace")
    grammar_dict.setdefault("checking", "check")
    grammar_dict.setdefault("inspecting", "inspection")
    grammar_dict.setdefault("leaking", "leak")
    grammar_dict.setdefault("loosened", "loose")

    return grammar_dict


# Load dynamic mappings
AVIATION_ABBREVIATIONS: dict[str, str] = load_abbreviations()
# Backward-compatibility alias
ABBREVIATIONS = AVIATION_ABBREVIATIONS

GRAMMAR_MAPPINGS: dict[str, str] = load_grammar_mappings()


def _build_regex(mapping: dict[str, str]) -> re.Pattern:
    """Compile a whole-word matching regex with longest keys first."""
    sorted_keys = sorted(mapping.keys(), key=len, reverse=True)
    pattern = r"\b(" + "|".join(re.escape(k) for k in sorted_keys if k) + r")\b"
    return re.compile(pattern, flags=re.IGNORECASE)


_ABBR_PATTERN = _build_regex(AVIATION_ABBREVIATIONS)
_GRAMMAR_PATTERN = _build_regex(GRAMMAR_MAPPINGS)


def reload_mappings() -> None:
    """Reload abbreviations and grammar mappings dynamically."""
    global AVIATION_ABBREVIATIONS, ABBREVIATIONS, GRAMMAR_MAPPINGS, _ABBR_PATTERN, _GRAMMAR_PATTERN
    AVIATION_ABBREVIATIONS = load_abbreviations()
    ABBREVIATIONS = AVIATION_ABBREVIATIONS
    GRAMMAR_MAPPINGS = load_grammar_mappings()
    _ABBR_PATTERN = _build_regex(AVIATION_ABBREVIATIONS)
    _GRAMMAR_PATTERN = _build_regex(GRAMMAR_MAPPINGS)


def normalize_text(text: str) -> str:
    """Normalize aviation maintenance text through abbreviation expansion and lemmatization.

    Workflow:
      1. Expand aviation abbreviations (e.g., 'eng' -> 'engine', 'hyd' -> 'hydraulic')
      2. Standardize morphosyntactic variations & lemmas (e.g., 'replacement' -> 'replace',
         'increasing' -> 'increase', 'inoperable' -> 'inoperate')
      3. Clean whitespace.

    Parameters
    ----------
    text : str
        Input maintenance description, fault record, or technician log.

    Returns
    -------
    str
        Standardized, lemmatized text.
    """
    if not isinstance(text, str) or not text.strip():
        return "" if text is None else text

    # Step 1: Expand abbreviations
    expanded = _ABBR_PATTERN.sub(
        lambda m: AVIATION_ABBREVIATIONS.get(m.group().lower(), m.group()),
        text,
    )

    # Step 2: Apply grammar lemmatization and morphosyntactic standardization
    lemmatized = _GRAMMAR_PATTERN.sub(
        lambda m: GRAMMAR_MAPPINGS.get(m.group().lower(), m.group()),
        expanded,
    )

    # Step 3: Normalize excessive whitespace
    normalized = re.sub(r"\s+", " ", lemmatized).strip()
    return normalized


# Direct alias for normalize_text
normalize = normalize_text
