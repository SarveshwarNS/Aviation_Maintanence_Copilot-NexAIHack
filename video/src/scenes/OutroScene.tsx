import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12 } });
  const contentProgress = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  const pulse = Math.sin(frame / 8) * 0.2 + 0.8;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 80px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: titleProgress,
          transform: `scale(${titleProgress})`,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            color: "#38bdf8",
            fontFamily: "monospace",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 12,
          }}
        >
          // GLASS COCKPIT MRO COPILOT
        </div>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 900,
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 30%, #38bdf8 80%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 ${35 * pulse}px rgba(56, 189, 248, 0.4)`,
          }}
        >
          AEROGRAPH COPILOT
        </h2>
      </div>

      <div
        style={{
          opacity: contentProgress,
          transform: `translateY(${interpolate(contentProgress, [0, 1], [30, 0])}px)`,
          textAlign: "center",
          maxWidth: 900,
          marginBottom: 40,
        }}
      >
        <p style={{ fontSize: 26, color: "#94a3b8", margin: "0 0 24px 0", lineHeight: 1.4 }}>
          Human-in-the-Loop Diagnostic Verification
          <br />
          <span style={{ color: "#34d399", fontWeight: 700 }}>
            Every Recommendation Cites Real Historical Records
          </span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <span
            style={{
              background: "rgba(14, 165, 233, 0.15)",
              border: "1px solid #0284c7",
              color: "#38bdf8",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Verbatim Evidence Cards
          </span>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #059669",
              color: "#34d399",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Visual Causal Subgraphs
          </span>
          <span
            style={{
              background: "rgba(168, 85, 247, 0.15)",
              border: "1px solid #9333ea",
              color: "#c084fc",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Step-by-Step Tool Trace
          </span>
        </div>
      </div>

      {/* GitHub Repository Bar */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid #334155",
          borderRadius: 8,
          padding: "16px 36px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>GitHub:</span>
        <span style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: 16, fontWeight: 600 }}>
          shyam-shankar/Aviation_Maintanence_Copilot-NexAIHack
        </span>
      </div>
    </AbsoluteFill>
  );
};
