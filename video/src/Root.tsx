import React from "react";
import { Composition } from "remotion";
import { AeroGraphShowcase } from "./AeroGraphShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AeroGraphShowcase"
        component={AeroGraphShowcase}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
