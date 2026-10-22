import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12 } });

  const pillars = [
    {
      step: "01",
      title: "Domain Normalizer",
      subtitle: "Lexicon + Regex Expansion",
      detail: "Expands shorthand (R&R -> removed & replaced), cylinder notations (#2 -> cyl 2), and stems morphological forms.",
      color: "#38bdf8",
      delay: 10,
    },
    {
      step: "02",
      title: "Hybrid Search + RRF",
      subtitle: "BM25 + Semantic Vectors",
      detail: "BM25 exact part recall + dense/sublinear semantic N-grams fused via Reciprocal Rank Fusion (k=60).",
      color: "#34d399",
      delay: 20,
    },
    {
      step: "03",
      title: "Empirical Refusal Gate",
      subtitle: "Mathematical Safety Anchor",
      detail: "Requires token coverage >= 0.32 & confidence >= 0.35. Strictly refuses unseen/out-of-domain queries.",
      color: "#f59e0b",
      delay: 30,
    },
    {
      step: "04",
      title: "Causal GraphRAG",
      subtitle: "NetworkX 4-Tier Ontology",
      detail: "Traverses System -> Component -> Symptom -> Action with intersected edge record IDs for 100% ground-truth.",
      color: "#a855f7",
      delay: 40,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 80px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Scene Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 44,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            color: "#38bdf8",
            fontFamily: "monospace",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 8,
          }}
        >
          ENGINEERED FOR FLIGHT SAFETY
        </div>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          The AeroGraph 4-Pillar Pipeline
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          width: "100%",
        }}
      >
        {pillars.map((p, idx) => {
          const cardProgress = spring({
            frame: frame - p.delay,
            fps,
            config: { damping: 14, mass: 0.7 },
          });

          return (
            <div
              key={idx}
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid #1e293b",
                borderTop: `4px solid ${p.color}`,
                borderRadius: 12,
                padding: "28px 22px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                opacity: cardProgress,
                transform: `translateY(${interpolate(cardProgress, [0, 1], [40, 0])}px) scale(${interpolate(cardProgress, [0, 1], [0.92, 1])})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 28,
                    fontWeight: 900,
                    color: p.color,
                  }}
                >
                  {p.step}
                </span>
                <span
                  style={{
                    background: `${p.color}20`,
                    border: `1px solid ${p.color}60`,
                    color: p.color,
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontFamily: "monospace",
                  }}
                >
                  ACTIVE
                </span>
              </div>

              <h4
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  margin: "0 0 4px 0",
                }}
              >
                {p.title}
              </h4>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: p.color,
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                {p.subtitle}
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  margin: 0,
                  flex: 1,
                }}
              >
                {p.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* End-to-End Pipeline Ribbon */}
      <div
        style={{
          marginTop: 40,
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "monospace",
          fontSize: 13,
          color: "#94a3b8",
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ color: "#38bdf8", fontWeight: 700 }}>PIPELINE:</span>
        <span>Raw Squelch</span>
        <span style={{ color: "#64748b" }}>➔</span>
        <span style={{ color: "#38bdf8" }}>Lexicon Normalizer</span>
        <span style={{ color: "#64748b" }}>➔</span>
        <span style={{ color: "#34d399" }}>Hybrid BM25 + TF-IDF RRF</span>
        <span style={{ color: "#64748b" }}>➔</span>
        <span style={{ color: "#f59e0b" }}>Refusal Gate</span>
        <span style={{ color: "#64748b" }}>➔</span>
        <span style={{ color: "#a855f7" }}>Causal GraphRAG</span>
        <span style={{ color: "#64748b" }}>➔</span>
        <span style={{ color: "#38bdf8" }}>Grounded [IDENT] Citations</span>
      </div>
    </AbsoluteFill>
  );
};
