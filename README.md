**Aviation Maintenance Copilot**
Maintenance Copilot is an AI-driven retrieval agent designed to troubleshoot aviation faults using the MaintNet historical logbook dataset. Because real-world maintenance records are notoriously terse, frequently misspelled, and heavily reliant on domain-specific acronyms, standard vector search fails to retrieve accurate fixes for reported faults.

This repository solves the "garbage in, garbage out" problem by implementing a custom text-normalization ingestion pipeline coupled with a hybrid search architecture that balances semantic embeddings with exact keyword matching. Built specifically for safety-critical environments, the agent operates under strict confidence thresholds. It is programmed to either explicitly cite specific historical record IDs to formulate a validated procedure, or gracefully fail with "insufficient evidence" when similarity scores fall below the safety threshold, ensuring zero hallucination.

