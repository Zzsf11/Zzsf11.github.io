import type { Caption } from "@remotion/captions";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { asset, Cue, ease, Plate, Shade } from "./visuals";

export const stateFlowFrames = 320;

const plates = {
  reference: "stateflow/demo_amusement_ref.jpg",
  layout: "stateflow/demo_amusement_render.mp4",
  film: "stateflow/demo_amusement_final.mp4",
};

const captions: Caption[] = [
  {
    text: "Build a 3D park from a reference.",
    startMs: 0,
    endMs: 2833,
    timestampMs: null,
    confidence: null,
  },
  {
    text: "Animate the ice cream truck.",
    startMs: 2833,
    endMs: 6200,
    timestampMs: null,
    confidence: null,
  },
  {
    text: "Reframe the balloon.",
    startMs: 6200,
    endMs: 8167,
    timestampMs: null,
    confidence: null,
  },
  {
    text: "Render the final shot.",
    startMs: 8167,
    endMs: 10667,
    timestampMs: null,
    confidence: null,
  },
];

const cover = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "50% 50%",
} as const;

const reveal = (amount: number) => {
  const rightEdge = amount * 115;
  return `polygon(0 0, ${rightEdge}% 0, ${rightEdge - 15}% 100%, 0 100%)`;
};

const Layout = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ clipPath: reveal(ease(frame, 0, 32)) }}>
      <OffthreadVideo src={asset(plates.layout)} muted style={cover} />
    </AbsoluteFill>
  );
};

const FinalFilm = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ clipPath: reveal(ease(frame, 0, 23)) }}>
      {/* The authors' 6 s film follows the 10 s 3D preview. Match their shot clocks. */}
      <OffthreadVideo
        src={asset(plates.film)}
        trimBefore={121}
        playbackRate={0.6}
        muted
        style={cover}
      />
    </AbsoluteFill>
  );
};

export const StateFlow = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#bccdd2" }}>
      <Sequence name="Amusement park reference" durationInFrames={53}>
        <Plate file={plates.reference} />
      </Sequence>
      <Sequence
        name="3D layout, vehicle motion and camera"
        from={20}
        durationInFrames={226}
        premountFor={fps}
      >
        <Layout />
      </Sequence>
      <Sequence
        name="Video-enhanced shot"
        from={222}
        durationInFrames={98}
        premountFor={fps}
      >
        <FinalFilm />
      </Sequence>
      <Sequence name="Return to the reference" from={308} durationInFrames={12}>
        <AbsoluteFill style={{ opacity: ease(frame, 308, 319) }}>
          <Plate file={plates.reference} />
        </AbsoluteFill>
      </Sequence>
      <Shade amount={0.56} />
      <AbsoluteFill
        style={{ opacity: ease(frame, 0, 7) * (1 - ease(frame, 303, 315)) }}
      >
        <Cue captions={captions} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
