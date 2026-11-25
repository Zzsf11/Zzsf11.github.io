import { Composition } from "remotion";
import { AlignGen, alignGenFrames } from "./aligngen";
import { OmniAD } from "./omniad";
import { StateFlow, stateFlowFrames } from "./stateflow";
import { SurgCSS } from "./surgcss";

export const RemotionRoot = () => (
  <>
    <Composition
      id="OmniAD"
      component={OmniAD}
      width={720}
      height={540}
      fps={30}
      durationInFrames={369}
    />
    <Composition
      id="SurgCSS"
      component={SurgCSS}
      width={720}
      height={540}
      fps={30}
      durationInFrames={429}
    />
    <Composition
      id="StateFlow"
      component={StateFlow}
      width={720}
      height={540}
      fps={30}
      durationInFrames={stateFlowFrames}
    />
    <Composition
      id="AlignGen"
      component={AlignGen}
      width={720}
      height={540}
      fps={30}
      durationInFrames={alignGenFrames}
    />
  </>
);
