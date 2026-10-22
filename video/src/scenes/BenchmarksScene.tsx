import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const BenchmarksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12 } });

  const metrics = [
    {
      value: "100.0%",
      label: "Retrieval Hit@5",
      sub: "15 of 15 Subsystems (12 @ Rank 1)",
      color: "#34d399",
      delay: 10,
    },
    {
      value: "100.0%",
      label: "Refusal Accuracy",
      sub: "10/10 Adversarial Near-Miss Refusals",
      color: "#38bdf8",
      delay: 20,
    },
    {
      value: "100.0%",
      label: "Citation Precision",
      sub: "Verifiable [IDENT: XXXXXX] Logs",
      color: "#a855f7",
      delay: 30,
    },
    {
      value: "REAL-TIME",
      label: "Chronic Defect Detection",
      sub: "Fleet-Wide Failure Pattern Ranking",
      color: "#f59e0b",
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
        padding: "40px 90px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Scene Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            color: "#34d399",
            fontFamily: "monospace",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 8,
          }}
        >
          EVALUATED &amp; EMPIRICALLY VERIFIED
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
          Zero Hallucination. 100% Truthful Citations.
        </h2>
      </div>

      {/* 4 Large Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          width: "100%",
        }}
      >
        {metrics.map((m, idx) => {
          const cardProgress = spring({
            frame: frame - m.delay,
            fps,
            config: { damping: 14, mass: 0.6 },
          });

          return (
            <div
              key={idx}
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: "36px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                opacity: cardProgress,
                transform: `scale(${interpolate(cardProgress, [0, 1], [0.85, 1])})`,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  fontFamily: "monospace",
                  color: m.color,
                  marginBottom: 10,
                  textShadow: `0 0 25px ${m.color}50`,
                }}
              >
                {m.value}
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  marginBottom: 8,
                }}
              >
                {m.label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#94a3b8",
                  lineHeight: 1.4,
                }}
              >
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div
        style={{
          marginTop: 48,
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
          AIRWORTHINESS PRINCIPLE:
        </span>
        <span style={{ color: "#cbd5e1", fontSize: 14 }}>
          When evidence is insufficient, refusing to answer is infinitely safer than guessing.
        </span>
      </div>
    </AbsoluteFill>
  );
};
