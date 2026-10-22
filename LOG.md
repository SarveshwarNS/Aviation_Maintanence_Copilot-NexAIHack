# ✈️ Aviation Maintenance Copilot — Project & Progress Log

**Repository:** [shyam-shankar/Aviation_Maintanence_Copilot-NexAIHack](https://github.com/shyam-shankar/Aviation_Maintanence_Copilot-NexAIHack.git)  
**Dataset:** MaintNet Aviation Maintenance Logbooks (6,169 records, 2012–2017)  
**Current Phase:** Phase 2 — Hybrid Retrieval & GraphRAG Agent Integration  
**Last Updated:** 2026-10-22

---

## 📌 Executive Summary

The **Aviation Maintenance Copilot** is an empirical, safety-critical diagnostic assistant designed for aircraft technicians. Aviation maintenance logs are notoriously unstructured, full of non-standard abbreviations (e.g., `R&R`, `A/C`, `CYL #2`, `INOP`), and highly domain-specific. 

This project solves this through:
1. **Domain-Specific Text Normalization:** Expanding technical abbreviations and regularizing cylinder and part notations.
2. **Hybrid Retrieval (BM25 + Dense/TF-IDF RRF):** Combining keyword precision for part numbers with semantic matching for fault concepts.
3. **Knowledge Graph Subgraph Traversal (GraphRAG):** Mapping faults across Systems $\rightarrow$ Components $\rightarrow$ Symptoms $\rightarrow$ Actions.
4. **Safety-Critical Refusal Gate:** Bounding LLM generation; refusing queries with insufficient evidence to prevent hallucinations.
5. **Full Verbatim Traceability:** Every recommendation is tied directly to raw historical record IDs (`[IDENT: XXXXXX]`).

---

## 🏗️ Architecture & Component Comparison

| Component | Remote Baseline (`origin/main`) | Local Enhanced Engine (`NexAIHack`) | Status / Notes |
| :--- | :--- | :--- | :--- |
| **Ingestion & Normalizer** | `utils/normalizer.py` (MaintNet dict lookup) | `normalizer.py` (MaintNet + operational shorthand + cylinder `#N` regex) | ✅ Production Ready |
| **Search Engine** | `search_engine.py` (BM25 + FAISS via Ollama `nomic-embed-text`) | `indexer.py` (BM25Okapi + TF-IDF n-grams + Reciprocal Rank Fusion) | ✅ Zero external C++ dependency |
| **Knowledge Graph** | None (Flat vector retrieval) | `graph_builder.py` (NetworkX MultiDiGraph, 19 components, 14 symptoms, 8 action types, cached `aviation_kg.json`) | ✅ DOT graph visualization integrated |
| **Agent Core** | `agent.py` (LangGraph `ChatOllama` / `qwen2.5:3b`, `@tool` bindings) | `agent.py` (`MaintenanceCopilotAgent` with query rewrite, GraphRAG traversal, refusal gate, Gemma 4 synthesis & deterministic fallback) | ✅ Dual-mode (Deterministic + LLM) |
| **User Interface** | `ui.py` (Streamlit dual-column) + `app.py` (FastAPI backend) | `app.py` (Self-contained Streamlit cockpit UI with live DOT Graphviz rendering, verbatim evidence cards, tool trace) | ✅ Active on `http://localhost:8501` |
| **Evaluation Suite** | None | `eval.py` (15 ground-truth query Hit@5, 5 out-of-domain refusal tests, citation precision) | ✅ Benchmark operational |

---

## 📊 Evaluation & Verification Metrics

Automated test suite results recorded from [`eval.py`](eval.py):

| Metric | Target | Result | Verification Notes |
| :--- | :---: | :---: | :--- |
| **Retrieval Hit@5** | $\ge 70.0\%$ | **73.3%** (11/15) | Validated against technician query pairs (rocker covers, baffles, cowl mounts, etc.) |
| **Refusal Accuracy** | $100.0\%$ | **100.0%** (5/5) | Correctly refused out-of-domain queries (Boeing toilet, Tesla battery, galley espresso) |
| **Citation Precision** | $100.0\%$ | **100.0%** | All generated citations verified to exist in MaintNet logbook with valid action records |
| **UI Startup & Health** | HTTP 200 | **PASS** | Streamlit running on port 8501 without runtime errors |

---

## 📋 Milestone Tracker

- [x] **Milestone 1: Domain-Specific Normalization**
  - MaintNet lexicon parsing
  - Custom aviation maintenance shorthand mapping (`r&r`, `a/c`, `inop`, `cyl`, `egt`, `alt`, etc.)
  - Cylinder number regex normalization (`#2` $\rightarrow$ `cylinder 2`)
- [x] **Milestone 2: Hybrid Indexing & Retrieval**
  - BM25Okapi token scoring
  - TF-IDF sublinear vectorizer with bigrams
  - Reciprocal Rank Fusion (RRF with $k=60$)
  - Empirical refusal gate with confidence scoring
- [x] **Milestone 3: Aviation Knowledge Graph (GraphRAG)**
  - Extraction rules for 19 Systems/Components, 14 Symptoms, 8 Clearing Actions
  - NetworkX graph construction and serialization to `aviation_kg.json`
  - Dynamic DOT visual graph generator
- [x] **Milestone 4: Agent Reasoning & Safety Guardrails**
  - Conversational query rewriting (Gemma 4 via Ollama)
  - Calibrated refusal on low confidence
  - Deterministic GraphRAG synthesis fallback
  - Verifiable citation formatting `[IDENT: XXXXXX]`
- [x] **Milestone 5: Interactive Web UI**
  - Dual-panel layout (Assessment vs. Evidence Cards)
  - Interactive DOT visual graph display
  - Tool execution trace inspection
  - 1-click test query presets (both positive and refusal cases)
- [x] **Milestone 6: Automated Evaluation Suite**
  - Hit@5, Refusal Rate, and Citation Precision automated tests
- [ ] **Milestone 7: Repository Unification & Remote Sync**
  - Merge local GraphRAG enhancements with remote FastAPI/LangGraph structure
  - Configure CI/CD test runner for `eval.py`
  - Update repository documentation and quickstart instructions

---

## 📝 Activity & Progress Changelog

### Entry: 2026-10-22 — Sprint: Engine Benchmarking & Progress Setup
- **Work Performed:**
  1. Verified local Streamlit instance running on port 8501 (`.venv/bin/streamlit run app.py --server.port 8501`).
  2. Analyzed uncertainty characteristics of LLM involvement (Gemma 4 query rewriting & synthesis vs. deterministic retrieval & template fallback).
  3. Inspected remote GitHub repository (`shyam-shankar/Aviation_Maintanence_Copilot-NexAIHack`).
  4. Compared the remote architecture (FastAPI + LangGraph + FAISS + Nomic embeddings) with the local enhanced engine (Streamlit + GraphRAG + Scikit-Learn TF-IDF + BM25 + DOT graph visualization).
  5. Configured local Git tracking against `origin/main` and added standard `.gitignore`.
  6. Created centralized `LOG.md` for team progress, milestone tracking, and benchmark records.
- **Key Decisions:**
  - Preserved both the remote FastAPI/LangGraph pipeline and the local self-contained GraphRAG engine so the project can be run either as a microservice API or as an all-in-one local Streamlit application.
  - Implemented low-temperature (`0.1` / `0.2`) and deterministic fallback options to control LLM stochastic uncertainty.
- **Current Status:** Stable and verified.

---

## 🔮 Next Steps & Action Items

1. **Model Parameter Tuning:**
   - Add toggle for strict deterministic decoding (`temperature: 0.0` with fixed seed) in `agent.py` to allow technicians to select between creative synthesis vs. zero-variance extraction.
2. **Knowledge Graph Enrichment:**
   - Expand component extraction rules for avionics (GPS, VOR, Autopilot) and hydraulics.
3. **Git Synchronization:**
   - Create a feature branch (e.g., `feature/graphrag-enhanced-engine`) to stage and commit the local GraphRAG, evaluation suite, and UI improvements for a pull request into `main`.
4. **API Endpoint Integration:**
   - Wire the new GraphRAG engine into the FastAPI backend (`app.py` from remote) so external services can query the graph representation over REST.
