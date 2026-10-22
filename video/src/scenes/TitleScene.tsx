import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const subtitleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const badgesProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const pulse = Math.sin(frame / 10) * 0.15 + 0.85;

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
      {/* Top Telemetry Line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [0, 20], [-20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        <span
          style={{
            background: "rgba(14, 165, 233, 0.15)",
            border: "1px solid #0284c7",
            color: "#38bdf8",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            fontFamily: "monospace",
          }}
        >
          // NEXAIHACK 2026 // FLIGHT AIRWORTHINESS DIAGNOSTICS
        </span>
        <span
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid #059669",
            color: "#34d399",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1.5,
            fontFamily: "monospace",
          }}
        >
          SYSTEM STATUS: ONLINE
        </span>
      </div>

      {/* Main Title with Glow */}
      <div
        style={{
          transform: `scale(${titleProgress})`,
          opacity: titleProgress,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: "-1px",
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 20%, #38bdf8 60%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 ${40 * pulse}px rgba(56, 189, 248, 0.4)`,
          }}
        >
          AEROGRAPH COPILOT
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
          opacity: subtitleProgress,
          textAlign: "center",
          maxWidth: 1100,
          marginBottom: 44,
        }}
      >
        <p
          style={{
            fontSize: 30,
            color: "#94a3b8",
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Autonomous Knowledge-Graph & Hybrid RAG Diagnostic Engine
          <br />
          <span style={{ color: "#38bdf8", fontWeight: 600 }}>
            for Aircraft Maintenance, Repair & Overhaul (MRO)
          </span>
        </p>
      </div>

      {/* Badges Bar */}
      <div
        style={{
          display: "flex",
          gap: 24,
          opacity: badgesProgress,
          transform: `scale(${interpolate(badgesProgress, [0, 1], [0.85, 1])})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid #334155",
            borderLeft: "4px solid #38bdf8",
            borderRadius: 8,
            padding: "16px 24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>DATASET</div>
          <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>6,169 Verified Logs</div>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid #334155",
            borderLeft: "4px solid #10b981",
            borderRadius: 8,
            padding: "16px 24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>CORPUS FLEET</div>
          <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>UND Aviation Program</div>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid #334155",
            borderLeft: "4px solid #a855f7",
            borderRadius: 8,
            padding: "16px 24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>AIRWORTHINESS</div>
          <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>Zero-Hallucination Guardrail</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
