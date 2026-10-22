# Aviation Maintenance RAG Copilot - Benchmark Evaluation Report

**Generated:** 2026-10-22 14:22:35  
**Evaluation Scope:** Normalization, Entity Extraction, Hybrid Retrieval (BM25 vs FAISS vs RRF), Refusal Guardrails, and E2E Agent Citations.

---

## 1. Executive Summary

| Component | Metric | Score | Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Abbreviation & Grammar** | Normalization Accuracy | **100.0%** | >= 90% | ✅ PASSED |
| **Domain Entity Extractor** | Extraction Hit Rate | **100.0%** | >= 80% | ✅ PASSED |
| **Retrieval Engine (RRF)** | Hit@5 (Recall@5) | **84.0%** | >= 80% | ✅ PASSED |
| **Retrieval Engine (RRF)** | Mean Reciprocal Rank (MRR@5) | **0.538** | >= 0.50 | ✅ PASSED |
| **Refusal Gate** | Specificity (Out-of-Domain Refusal) | **100.0%** | >= 90% | ✅ PASSED |
| **Refusal Gate** | Sensitivity (In-Domain Acceptance) | **100.0%** | >= 80% | ✅ PASSED |
| **Refusal Gate** | Overall F1-Score | **1.0** | >= 0.85 | ✅ PASSED |

---

## 2. Retrieval Comparison: BM25 vs FAISS vs Hybrid RRF

*Evaluated against ground-truth maintenance logs (Sample size: 25 records)*

| Method | Hit@1 | Hit@3 | Hit@5 | Avg Latency |
| :--- | :--- | :--- | :--- | :--- |
| **BM25 Alone** | 40.0% | 68.0% | 76.0% | ~2 ms |
| **FAISS Alone (Dense)** | 36.0% | 52.0% | 56.0% | ~15 ms |
| **Hybrid RRF (Fusion)** | **36.0%** | **68.0%** | **84.0%** | **269.02 ms** |

> **Finding:** Hybrid Reciprocal Rank Fusion combines exact keyword matching with semantic vector understanding, providing superior retrieval coverage over either single modality.

---

## 3. Refusal Threshold & Safety Guardrail Performance

- **Safety Threshold:** Match Score < 0.35 -> Immediate Refusal
- **Refusal Message:** *"Insufficient evidence in historical logbooks to provide a confident fix."*

### Confusion Matrix
- **True Positives (In-Domain Accepted):** 10
- **True Negatives (Out-of-Domain Refused):** 10
- **False Positives (Hallucination Risk Accepted):** 0
- **False Negatives (Valid Query Refused):** 0

**Out-of-Domain Zero-Hallucination Specificity:** **100.0%**

---

## 4. End-to-End Agent Performance
- **Average Agent Response Time:** 6.22 s
- **Citation Consistency:** 100% of accepted technical guidance explicitly cites retrieved logbook record IDs (e.g. `[Record #ID]`).
