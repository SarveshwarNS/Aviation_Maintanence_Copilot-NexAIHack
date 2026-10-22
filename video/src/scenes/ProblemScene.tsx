import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const card1Progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14 },
  });

  const card2Progress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 100px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Scene Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: headerProgress,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            color: "#f87171",
            fontFamily: "monospace",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 8,
          }}
        >
          CRITICAL AIRWORTHINESS RISK
        </div>
        <h2
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Why Generic LLMs & Naive Vector RAG Fail
        </h2>
      </div>

      {/* 2-Column Comparison Layout */}
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: 40,
          justifyContent: "center",
        }}
      >
        {/* Left Column: The MRO Logbook Reality */}
        <div
          style={{
            flex: 1,
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #334155",
            borderTop: "5px solid #38bdf8",
            borderRadius: 12,
            padding: "36px 32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            opacity: card1Progress,
            transform: `translateY(${interpolate(card1Progress, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              color: "#38bdf8",
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            REAL-WORLD MRO REALITY
          </div>
          <h3 style={{ fontSize: 28, color: "#f1f5f9", marginTop: 0, marginBottom: 20 }}>
            Telegraphic & Non-Standard Shorthand
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: "#080d1a",
                padding: "14px 18px",
                borderRadius: 8,
                border: "1px solid #1e293b",
                fontFamily: "monospace",
                fontSize: 16,
                color: "#e2e8f0",
              }}
            >
              <span style={{ color: "#f59e0b" }}>LOG 100004:</span> HAD ENG CHOKE &amp; BRIEFLY LOSE POWER ON DEPARTURE.
            </div>

            <div
              style={{
                background: "#080d1a",
                padding: "14px 18px",
                borderRadius: 8,
                border: "1px solid #1e293b",
                fontFamily: "monospace",
                fontSize: 16,
                color: "#e2e8f0",
              }}
            >
              <span style={{ color: "#f59e0b" }}>LOG 100892:</span> L/H MAGNETO HAD DROP OF 300 RPM ON RUN UP. LEANED.
            </div>

            <div
              style={{
                background: "#080d1a",
                padding: "14px 18px",
                borderRadius: 8,
                border: "1px solid #1e293b",
                fontFamily: "monospace",
                fontSize: 16,
                color: "#e2e8f0",
              }}
            >
              <span style={{ color: "#f59e0b" }}>LOG 100147:</span> #2 &amp; 4 CYL ROCKER COVER GASKETS LEAKING. R&amp;R W/ NEW.
            </div>
          </div>
        </div>

        {/* Right Column: The Fatal Risks of Standard AI */}
        <div
          style={{
            flex: 1,
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #7f1d1d",
            borderTop: "5px solid #ef4444",
            borderRadius: 12,
            padding: "36px 32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            opacity: card2Progress,
            transform: `translateY(${interpolate(card2Progress, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              color: "#f87171",
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            THE STANDARD RAG FAILURE MODES
          </div>
          <h3 style={{ fontSize: 28, color: "#f1f5f9", marginTop: 0, marginBottom: 20 }}>
            Hallucination Under Uncertainty
          </h3>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ color: "#ef4444", fontSize: 20, fontWeight: "bold" }}>✕</span>
              <div>
                <strong style={{ color: "#fca5a5", fontSize: 18 }}>Vector Semantic Drift:</strong>
                <p style={{ color: "#94a3b8", fontSize: 15, margin: "4px 0 0" }}>
                  Dense embeddings falsely cluster non-existent failure modes with generic engine parts.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ color: "#ef4444", fontSize: 20, fontWeight: "bold" }}>✕</span>
              <div>
                <strong style={{ color: "#fca5a5", fontSize: 18 }}>Invented Repair Procedures:</strong>
                <p style={{ color: "#94a3b8", fontSize: 15, margin: "4px 0 0" }}>
                  Standard LLMs fabricate plausible-sounding torque specs &amp; clearances when uncertain.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ color: "#ef4444", fontSize: 20, fontWeight: "bold" }}>✕</span>
              <div>
                <strong style={{ color: "#fca5a5", fontSize: 18 }}>Zero Airworthiness Traceability:</strong>
                <p style={{ color: "#94a3b8", fontSize: 15, margin: "4px 0 0" }}>
                  Opaque black-box answers without verified logbook citations violate FAA/EASA protocols.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </AbsoluteFill>
  );
};
