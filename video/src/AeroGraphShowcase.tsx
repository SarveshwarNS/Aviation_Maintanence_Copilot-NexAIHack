import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { BenchmarksScene } from "./scenes/BenchmarksScene";
import { OutroScene } from "./scenes/OutroScene";

export const AeroGraphShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080d1a",
        color: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Cockpit Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: `${(frame * 0.4) % 60}px ${(frame * 0.4) % 60}px`,
          pointerEvents: "none",
        }}
      />

      {/* Radial Vignette & Cockpit Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative Radar Ring in Top-Right */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px dashed rgba(56, 189, 248, 0.15)",
          transform: `rotate(${frame * 0.3}deg)`,
          pointerEvents: "none",
        }}
      />

      {/* Scene 1: Title & Hero Hook (0s - 4.67s) */}
      <Sequence from={0} durationInFrames={140}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: The Aviation Problem (4.67s - 9.33s) */}
      <Sequence from={140} durationInFrames={140}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: The 4-Pillar Pipeline Architecture (9.33s - 15.0s) */}
      <Sequence from={280} durationInFrames={170}>
        <ArchitectureScene />
      </Sequence>

      {/* Scene 4: Quantitative Benchmark Proof (15.0s - 19.67s) */}
      <Sequence from={450} durationInFrames={140}>
        <BenchmarksScene />
      </Sequence>

      {/* Scene 5: Outro & Glass Cockpit UI (19.67s - 24.0s) */}
      <Sequence from={590} durationInFrames={130}>
        <OutroScene />
      </Sequence>

      {/* Persistent Bottom Telemetry Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: 12,
          color: "#475569",
          borderTop: "1px solid rgba(51, 65, 85, 0.4)",
          paddingTop: 12,
        }}
      >
        <span>AEROGRAPH // MRO MaintNet Fleet Engine (2012–2017)</span>
        <span>FRAME: {frame} / 720</span>
        <span>AIRWORTHINESS PROTOCOL: ACTIVE</span>
      </div>
    </AbsoluteFill>
  );
};
