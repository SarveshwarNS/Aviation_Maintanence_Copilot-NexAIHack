# AeroGraph Copilot // Remotion Video Showcase

Programmatic 1080p 60fps/30fps product showcase video for **AeroGraph Copilot** built with [Remotion](https://www.remotion.dev/) (React).

---

## Video Specifications

- **Output Video:** [`out/aerograph_copilot_showcase.mp4`](out/aerograph_copilot_showcase.mp4)
- **Resolution:** 1920x1080 (Full HD, 16:9)
- **Framerate:** 30 FPS
- **Duration:** 24.0 Seconds (720 Frames)
- **Codec:** H.264 / MP4

---

## Scene Breakdown

1. **Scene 1: Title & Hero Hook (0s – 4.7s / Frames 0–140)**
   - AeroGraph Copilot branding with glowing cockpit HUD aesthetics.
   - Highlights 6,169 verified UND maintenance flight logs and the zero-hallucination mandate.
2. **Scene 2: The Aviation MRO Challenge (4.7s – 9.3s / Frames 140–280)**
   - Real-world telegraphic logbook squelches vs. the dangers of generic AI (semantic vector drift, fabricated torque specs).
3. **Scene 3: The 4-Pillar Pipeline Architecture (9.3s – 15.0s / Frames 280–450)**
   - Domain Normalizer $\to$ Hybrid BM25 + TF-IDF RRF $\to$ Multi-Gate Refusal Guardrail $\to$ Causal GraphRAG.
4. **Scene 4: Quantitative Benchmark Proof (15.0s – 19.7s / Frames 450–590)**
   - 100.0% Retrieval Hit@5 across 15 aircraft subsystems.
   - 100.0% Refusal Accuracy on 10 adversarial near-miss queries.
   - 100.0% Citation Precision with verifiable `[IDENT]` logs.
   - Real-time fleet chronic defect detection.
5. **Scene 5: Glass Cockpit UI & Outro (19.7s – 24.0s / Frames 590–720)**
   - Visual causal subgraphs, verbatim evidence cards, and human-in-the-loop explainability.
   - GitHub repository attribution.

---

## Quickstart & Commands

```bash
cd video

# Install dependencies (if not already installed)
npm install

# Launch interactive Remotion Studio in your browser
npm run studio

# Render the MP4 video
npm run render
```
