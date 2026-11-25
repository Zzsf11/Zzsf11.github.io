import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import {
  asset,
  Cue,
  ease,
  gold,
  GuideText,
  ice,
  mix,
  Plate,
  Shade,
} from "./visuals";

const Cutaway = ({ file, progress }: { file: string; progress: number }) => {
  const left = mix(-25, 125, progress);
  return (
    <AbsoluteFill
      style={{
        clipPath: `polygon(0 0, ${left}% 0, ${left - 25}% 100%, 0 100%)`,
      }}
    >
      <Plate file={file} />
    </AbsoluteFill>
  );
};

const Reconstruct = () => {
  const frame = useCurrentFrame();
  const masked = ease(frame, 15, 51);
  const painted = ease(frame, 60, 105);
  return (
    <AbsoluteFill>
      <Plate file="inpaint-original.jpg" />
      <Cutaway file="inpaint-masked.jpg" progress={masked} />
      <Cutaway file="inpaint-reconstructed.jpg" progress={painted} />
      <Shade />
      <Cue
        captions={[
          {
            text: "Mask the instruments in a surgical frame.",
            startMs: 0,
            endMs: 2050,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Reconstruct the tissue behind them.",
            startMs: 2050,
            endMs: 3950,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

const Blend = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 42, 74);
  const settle = ease(frame, 72, 91);
  const point = ease(frame, 14, 33) * (1 - ease(frame, 37, 52));
  const cx = 719 * 0.58;
  const cy = -90 + 720 * 0.59;
  const tool: React.CSSProperties = {
    width: 720,
    height: 720,
    top: -90,
    left: 0,
  };
  return (
    <AbsoluteFill>
      <Plate file="blend-before.jpg" style={tool} />
      <Plate
        file="grasper.png"
        style={{
          ...tool,
          opacity: ease(frame, 41, 55) * (1 - settle),
          translate: `${mix(-238, 0, enter)}px ${mix(102, 0, enter)}px`,
          rotate: `${mix(-9, 0, enter)}deg`,
          transformOrigin: "18% 86%",
        }}
      />
      <Plate file="blend-after.jpg" style={{ ...tool, opacity: settle }} />
      <svg width={720} height={540} style={{ position: "absolute" }}>
        <path
          d={`M 413 91 L ${413 - point * 67} ${91 + point * 52} l ${-38 * point} 0`}
          fill="none"
          stroke={ice}
          strokeWidth={2.4}
          opacity={point}
        />
        <circle cx={413} cy={91} r={5} fill={ice} opacity={point} />
        <path
          d={`M ${cx} ${cy} l ${64 * settle} ${-29 * settle} h ${62 * settle}`}
          fill="none"
          stroke={gold}
          strokeWidth={2.4}
          opacity={settle * 0.9}
        />
        <circle cx={cx} cy={cy} r={5} fill={gold} opacity={settle} />
      </svg>
      <GuideText x={113} y={128} size={23} color={ice} opacity={point}>
        RETRACTOR
      </GuideText>
      <GuideText x={560} y={293} size={22} color={gold} opacity={settle}>
        GRASPER
      </GuideText>
      <Shade />
      <Cue
        captions={[
          {
            text: "The model confuses it with a grasper.",
            startMs: 0,
            endMs: 1320,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Blend both tools into one training image.",
            startMs: 1320,
            endMs: 3670,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

const Backdrop = () => (
  <>
    <Plate
      file="blend-after.jpg"
      style={{
        filter: "blur(11px) saturate(.65) brightness(.47)",
        transform: "scale(1.06)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 49% 42%, #36253546 1%, #110e19b3 100%)",
      }}
    />
  </>
);

const Train = () => {
  const frame = useCurrentFrame();
  const shrink = ease(frame, 61, 96);
  return (
    <AbsoluteFill style={{ background: "#1c111d" }}>
      <Backdrop />
      {[5, 3, 1].map((count, row) =>
        Array.from({ length: 5 }, (_, column) => {
          const existing = column < count;
          const enter = existing
            ? 1
            : ease(frame, 19 + column * 4 + row * 2, 36 + column * 4 + row * 2);
          const offset = (1 - enter) * 136;
          const left = mix(79 + 112 * column, 316 + 21 * column, shrink);
          const top = mix(69 + 119 * row, 198 + 50 * row, shrink);
          return (
            <div
              key={`${row}-${column}`}
              style={{
                width: mix(112, 23, shrink),
                height: mix(88, 30, shrink),
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
                position: "absolute",
                top,
                left: left - offset,
                opacity: enter,
                filter: `brightness(${existing ? 1.22 : mix(1.65, 1.25, enter)})`,
              }}
            >
              <Img
                src={asset(`instrument-${row}.png`)}
                style={{
                  width: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  opacity: 1 - shrink,
                  transform: `rotate(${[-7, 4, -5, 6, 2][column]}deg) scale(${[0.83, 0.89, 0.96, 0.84, 1][column]})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "81%",
                  borderRadius: 3,
                  background: ice,
                  opacity: shrink * 0.94,
                  boxShadow: "0 0 12px #a3f4ec45",
                }}
              />
            </div>
          );
        }),
      )}
      <Shade amount={0.59} />
      <Cue
        captions={[
          {
            text: "Make more examples of rare tools.",
            startMs: 0,
            endMs: 1580,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Retrain the head on balanced samples.",
            startMs: 1580,
            endMs: 3540,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

const BlendWeights = () => {
  const frame = useCurrentFrame();
  const separate = ease(frame, 1, 20);
  const select = ease(frame, 24, 45);
  const gather = ease(frame, 43, 67);
  const stable = ease(frame, 65, 83);
  const selected = [0, 2, 5];
  return (
    <AbsoluteFill style={{ background: "#1c111d" }}>
      <Backdrop />
      {["#f0af70", ice].map((color, row) => {
        const y = row === 0 ? mix(210, 168, separate) : mix(297, 343, separate);
        return (
          <div key={color} style={{ opacity: 1 - stable }}>
            <GuideText
              x={103}
              y={y - 59}
              size={25}
              opacity={separate}
              color={color}
            >
              {row === 0 ? "Original head" : "Rebalanced head"}
            </GuideText>
            {Array.from({ length: 7 }, (_, i) => {
              const active = selected.includes(i);
              const w = active ? mix(43, 23, gather) : 43;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: y - 17,
                    left: 104 + 53 * i,
                    width: w,
                    height: 34,
                    borderRadius: 4,
                    background: color,
                    opacity:
                      separate *
                      (active
                        ? mix(0.71, 1, select) * (1 - gather)
                        : 1 - 0.5 * select),
                    boxShadow: active
                      ? `0 0 ${15 * select}px ${color}40`
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        );
      })}
      {["#f0af70", ice].map((color, row) =>
        selected.map((i, j) => {
          const move = ease(frame, 41 + j * 2, 65 + j * 2);
          const startY = row === 0 ? 151 : 326;
          return (
            <div
              key={`${row}-${i}`}
              style={{
                position: "absolute",
                width: 43,
                height: mix(34, 42, move),
                borderRadius: 4,
                left: 104 + 53 * i,
                top: mix(startY, 226, move),
                opacity: ease(frame, 41, 48) * (1 - stable),
                background: color,
                mixBlendMode: "screen",
              }}
            />
          );
        }),
      )}
      {Array.from({ length: 7 }, (_, i) => {
        const updated = selected.includes(i);
        const move = updated ? 1 : ease(frame, 62 + i, 78 + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 43,
              height: 42,
              left: 104 + i * 53,
              top: mix(151, 226, move),
              background: updated ? "#ffd9bb" : "#f0af70",
              borderRadius: 4,
              opacity: updated ? stable : move * 0.7,
              boxShadow: updated ? "0 0 18px #f4d7b64b" : undefined,
            }}
          />
        );
      })}
      <GuideText x={103} y={178} size={25} opacity={stable} color="#ffd9bb">
        Fused head
      </GuideText>
      <Shade amount={0.55} />
      <Cue
        captions={[
          {
            text: "Keep both versions of the head.",
            startMs: 0,
            endMs: 1150,
            timestampMs: null,
            confidence: null,
          },
          {
            text: "Fuse the weights that changed most.",
            startMs: 1150,
            endMs: 3270,
            timestampMs: null,
            confidence: null,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

export const SurgCSS = () => (
  <AbsoluteFill style={{ background: "#24131f" }}>
    <Sequence durationInFrames={117} name="Inpainting · Recover clean tissue">
      <Reconstruct />
    </Sequence>
    <Sequence
      from={117}
      durationInFrames={109}
      name="Class-aware blending · Add the confused class"
    >
      <Blend />
    </Sequence>
    <Sequence
      from={226}
      durationInFrames={105}
      name="Balanced samples · Retune the head"
    >
      <Train />
    </Sequence>
    <Sequence
      from={331}
      durationInFrames={98}
      name="Dynamic weight fusion · Merge selective weights"
    >
      <BlendWeights />
    </Sequence>
  </AbsoluteFill>
);
