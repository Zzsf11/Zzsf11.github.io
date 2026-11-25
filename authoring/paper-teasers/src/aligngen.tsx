import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cue, Plate, Shade, ease, mix } from "./visuals";

export const alignGenFrames = 360;
const source = (name: string) => `aligngen/${name}.webp`;
const mint = "#b8efca";
const pale = "#f4f1dd";
const orange = "#ffac5b";

// The reference and all three generated images are embedded photographs/artwork
// extracted separately from Fig. 1. The moving links illustrate Fig. 4.
const alignCaptions = [
  [0, 32, "Start with a reference."],
  [33, 73, "Add a token before “frog”."],
  [74, 122, "Visual features update the token."],
  [123, 154, "Mask unrelated prompt words."],
  [164, 221, "Playing guitar by a moonlit pond."],
  [231, 276, "From moonlight to cyberpunk."],
  [285, 332, "With transparent wings."],
  [345, 360, "Start with a reference."],
] as const;

const captions = alignCaptions.map(([from, to, text]) => ({
  startMs: (from * 1000) / 30,
  endMs: (to * 1000) / 30,
  text,
  timestampMs: null,
  confidence: null,
}));

const Prompt = () => {
  const frame = useCurrentFrame();
  const insert = ease(frame, 63, 85);
  const select = ease(frame, 115, 138);
  const update = ease(frame, 83, 113);
  const lines = ["playing guitar", "by a moonlit pond."];
  return (
    <AbsoluteFill
      style={{ color: pale, fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <div
        style={{
          position: "absolute",
          top: 152,
          left: 354,
          height: 66,
          fontSize: 56,
          lineHeight: 1,
          opacity: ease(frame, 39, 57),
        }}
      >
        <span style={{ opacity: 1 - select * 0.57 }}>A</span>
        <span
          style={{
            position: "absolute",
            left: 46,
            top: 7,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 39,
            color: update > 0.65 ? orange : mint,
            whiteSpace: "nowrap",
            opacity: insert,
            transform: `translateY(${mix(-22, 0, insert)}px)`,
          }}
        >
          S<sup style={{ fontSize: 23 }}>*</sup>
        </span>
        <span
          style={{
            position: "absolute",
            top: 0,
            left: mix(48, 98, insert),
            color: select > 0.3 ? mint : pale,
            fontStyle: "italic",
          }}
        >
          frog
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 58,
              width: `${select * 100}%`,
              height: 3,
              backgroundColor: mint,
            }}
          />
        </span>
      </div>
      {lines.map((line, index) => {
        const show = ease(frame, 46 + index * 5, 66 + index * 5);
        return (
          <div
            key={line}
            style={{
              position: "absolute",
              top: 229 + index * 46,
              left: 355,
              fontSize: 38,
              letterSpacing: "-1.6px",
              opacity: show * (1 - select * 0.53),
              whiteSpace: "nowrap",
              transform: `translateX(${mix(19, 0, show)}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Points are on the original reference at its final, square presentation.
// The three curved paths are illustrative. They are not measured attention.
const details = [
  { x: 160, y: 219, bend: 109, color: "#ff973a" },
  { x: 254, y: 217, bend: 141, color: "#ffcd79" },
  { x: 119, y: 277, bend: 70, color: "#87b8ed" },
];

const FeatureLinks = () => {
  const frame = useCurrentFrame();
  const reveal = ease(frame, 76, 86);
  const disconnect = 1 - ease(frame, 115, 125);
  const select = ease(frame, 117, 139);
  return (
    <svg width="720" height="540" style={{ position: "absolute", inset: 0 }}>
      {details.map(({ x, y, bend, color }, index) => {
        const arrival = ease(frame, 80 + index * 3, 106 + index * 3);
        const u = 1 - arrival;
        const cx = u * u * x + 2 * u * arrival * 320 + arrival * arrival * 414;
        const cy = u * u * y + 2 * u * arrival * bend + arrival * arrival * 173;
        return (
          <g key={x} opacity={reveal * disconnect}>
            <path
              d={`M${x},${y} Q320,${bend} 414,173`}
              pathLength={1}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={1 - arrival}
              opacity={0.83}
            />
            <circle
              cx={x}
              cy={y}
              r={mix(4, 8, arrival)}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
            <circle cx={cx} cy={cy} r={5.5} fill={color} />
          </g>
        );
      })}
      <path
        d="M 256 205 C 300 99, 428 93, 487 143"
        fill="none"
        stroke={mint}
        strokeWidth={3}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - select}
        opacity={select}
      />
      <circle cx={256} cy={205} r={6} fill={mint} opacity={select} />
      <circle cx={487} cy={143} r={5} fill={mint} opacity={select} />
    </svg>
  );
};

const ReferenceAndPrompt = () => {
  const frame = useCurrentFrame();
  const dock = ease(frame, 27, 60);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 15% 22%, #375447 0%, #213a32 42%, #132821 77%, #0b1f1c 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: mix(0, 17, dock),
          top: mix(0, 102, dock),
          width: mix(720, 308, dock),
          height: mix(540, 308, dock),
          borderRadius: 3 * dock,
          overflow: "hidden",
        }}
      >
        <Plate
          file={source("reference")}
          style={{ objectPosition: "center 49%" }}
        />
      </div>
      <Prompt />
      <FeatureLinks />
    </AbsoluteFill>
  );
};

const Results = () => {
  const frame = useCurrentFrame();
  const open = ease(frame, 0, 24);
  const split = ease(frame, 67, 90);
  const wing = ease(frame, 121, 148);
  const revealReference = ease(frame, 176, 202);
  // The expanding window begins at the subject word, and reveals a published
  // output rather than synthesizing a denoising trajectory.
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${open * 860}px at 486px 185px)`,
        background: "#081d22",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          right: mix(0, 389, split),
          overflow: "hidden",
        }}
      >
        <Plate file={source("guitar")} style={{ objectPosition: "38% 61%" }} />
      </div>
      {split > 0 && (
        <div
          style={{
            position: "absolute",
            left: mix(720, 331, split),
            top: 0,
            bottom: 0,
            width: 389,
            overflow: "hidden",
          }}
        >
          <Plate
            file={source("cyberpunk")}
            style={{ objectPosition: "57% 63%" }}
          />
        </div>
      )}
      {wing > 0 && (
        <AbsoluteFill
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${-16 + 138 * wing}%, 0 ${138 * wing}%)`,
          }}
        >
          <Plate file={source("wings")} style={{ objectPosition: "48% 44%" }} />
        </AbsoluteFill>
      )}
      {revealReference > 0 && (
        <AbsoluteFill
          style={{
            clipPath: `circle(${revealReference * 860}px at 526px 212px)`,
          }}
        >
          <Plate
            file={source("reference")}
            style={{ objectPosition: "center 49%" }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const AlignGen = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#132821" }}>
      <Sequence
        name="Reference and prompt alignment"
        durationInFrames={185}
        premountFor={fps}
      >
        <ReferenceAndPrompt />
      </Sequence>
      <Sequence
        name="Published AlignGen outputs"
        from={154}
        durationInFrames={alignGenFrames - 154}
        premountFor={fps}
      >
        <Results />
      </Sequence>
      <Shade amount={0.83} />
      <Cue captions={captions} />
    </AbsoluteFill>
  );
};
