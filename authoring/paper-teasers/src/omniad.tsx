import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import {
  asset,
  Cue,
  ease,
  gold,
  GuideText,
  ice,
  Mark,
  mix,
  Plate,
  Shade,
} from "./visuals";

const Locate = () => {
  const frame = useCurrentFrame();
  const find = ease(frame, 11, 39);
  const trace = ease(frame, 38, 62);
  return (
    <AbsoluteFill>
      <Plate file="cashew.jpg" />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 48% 49%, transparent 42%, #100c0a66 100%)",
        }}
      />
      <Mark
        x={232}
        y={354}
        width={70}
        height={40}
        color={gold}
        draw={find}
        fill={0.09}
      />
      <svg
        width={720}
        height={540}
        style={{ position: "absolute", opacity: 1 - ease(frame, 62, 83) }}
      >
        <path
          d={`M 232 ${mix(354, 394, trace)} h 70`}
          stroke={gold}
          strokeWidth={2}
          opacity={find * 0.72}
        />
      </svg>
      <Shade />
      <Cue
        captions={[
          {
            text: "What is wrong with this cashew?",
            startMs: 0,
            endMs: 1530,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Mark the surface defect.",
            startMs: 1530,
            endMs: 3200,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

const patches = [
  { id: 0 },
  { id: 1 },
  { id: 2, group: "point" },
  { id: 3 },
  { id: 6, group: "run" },
  { id: 7, group: "run" },
  { id: 8, group: "run" },
  { id: 9 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
];

const Encoding = () => {
  const frame = useCurrentFrame();
  const mark = ease(frame, 21, 43);
  const isolate = ease(frame, 55, 84);
  const condense = ease(frame, 87, 112);
  const pointText = ease(frame, 105, 121);
  const rangeText = ease(frame, 120, 136);
  const size = 137;
  return (
    <AbsoluteFill style={{ background: "#201b1c" }}>
      <Plate
        file="patch-8.jpg"
        style={{
          opacity: 0.22,
          filter: "blur(32px) brightness(.60)",
          transform: "scale(1.18)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 24%, #17131abe 95%)",
        }}
      />
      {patches.map(({ id, group }, i) => {
        const x = 86 + (i % 4) * size;
        const y = 20 + Math.floor(i / 4) * size;
        const isPoint = group === "point";
        const targetX = isPoint ? 134 : 134 + (i - 4) * 72;
        const targetY = isPoint ? 131 : 256;
        const shift = i % 4 < 2 ? -1 : 1;
        const distance = 170 + 45 * (i % 3);
        const opacity = group ? 1 : 1 - isolate;
        const edge = isPoint ? gold : ice;
        const gap = mix(2, 8, mark) * (1 - condense);
        const width = group ? mix(size - gap, 72, condense) : size - gap;
        const left = group
          ? mix(x, targetX, condense)
          : x + shift * distance * isolate;
        const top = group
          ? mix(y, targetY, condense)
          : y + (i < 4 ? -74 : 90) * isolate;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              width,
              height: width,
              top,
              left,
              opacity,
              overflow: "hidden",
              filter: group ? undefined : `brightness(${mix(1, 0.28, mark)})`,
            }}
          >
            <Img
              src={asset(`patch-${id}.jpg`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {group && (
              <AbsoluteFill
                style={{
                  boxShadow: `inset 0 0 0 3px ${edge}`,
                  background: `${edge}26`,
                  opacity: mark * (group === "run" ? 1 - condense : 0.9),
                }}
              />
            )}
          </div>
        );
      })}
      <Mark
        x={134}
        y={131}
        width={72}
        height={72}
        color={gold}
        draw={pointText}
      />
      <Mark
        x={134}
        y={256}
        width={216}
        height={72}
        color={ice}
        draw={rangeText}
      />
      <svg width={720} height={540} style={{ position: "absolute" }}>
        <path
          d={`M 207 167 h ${54 * pointText}`}
          stroke={gold}
          strokeWidth={2}
          opacity={1}
        />
        <path
          d={`M 350 292 h ${54 * rangeText}`}
          stroke={ice}
          strokeWidth={2}
          opacity={1}
        />
      </svg>
      <GuideText x={278} y={152} color={gold} opacity={pointText}>
        (2,4)
      </GuideText>
      <GuideText x={419} y={277} color={ice} opacity={rangeText}>
        (3,2)–(3,4)
      </GuideText>
      <Shade amount={0.57} />
      <Cue
        captions={[
          {
            text: "A separate encoding example.",
            startMs: 0,
            endMs: 1700,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Keep only the marked patches.",
            startMs: 1700,
            endMs: 3150,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Write neighboring patches as a range.",
            startMs: 3150,
            endMs: 5667,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

const Explain = () => {
  const frame = useCurrentFrame();
  const find = ease(frame, 10, 35);
  const compare = ease(frame, 37, 64);
  return (
    <AbsoluteFill>
      <Plate file="cashew-detail.jpg" />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 45% 40%, transparent 18%, #29191070 98%)",
          opacity: compare,
        }}
      />
      <Mark x={183} y={233} width={150} height={101} color={gold} draw={find} />
      <svg width={720} height={540} style={{ position: "absolute" }}>
        <path
          d={`M 337 283 H ${337 + compare * 97} L ${337 + compare * 121} ${283 - compare * 23}`}
          stroke={gold}
          strokeWidth={2}
          opacity={compare * 0.75}
          fill="none"
        />
        <circle
          cx={458}
          cy={260}
          r={3.5 * compare}
          fill={gold}
          opacity={compare * 0.75}
        />
      </svg>
      <Shade />
      <Cue
        captions={[
          {
            text: "Use the location to reason about the defect.",
            startMs: 0,
            endMs: 1860,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "It disrupts texture and color.",
            startMs: 1860,
            endMs: 3650,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

export const OmniAD = () => (
  <AbsoluteFill style={{ background: "#201b1c" }}>
    <Sequence durationInFrames={94} name="Cashew · Localize the defect">
      <Locate />
    </Sequence>
    <Sequence
      from={94}
      durationInFrames={167}
      name="Independent encoding example"
    >
      <Encoding />
    </Sequence>
    <Sequence
      from={261}
      durationInFrames={108}
      name="Cashew · Explain the defect"
    >
      <Explain />
    </Sequence>
  </AbsoluteFill>
);
