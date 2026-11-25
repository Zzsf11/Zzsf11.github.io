import type { Caption } from "@remotion/captions";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const gold = "#ffce78";
export const ice = "#b6eeed";
export const mono = "'Menlo', 'DejaVu Sans Mono', monospace";

export const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.24, 0.73, 0.29, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const mix = (a: number, b: number, amount: number) =>
  a + (b - a) * amount;

export const asset = (name: string) => staticFile(`media/${name}`);

export const Plate = ({
  file,
  style,
}: {
  file: string;
  style?: CSSProperties;
}) => (
  <Img
    src={asset(file)}
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...style,
    }}
  />
);

export const Shade = ({ amount = 0.76 }: { amount?: number }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(transparent 60%, rgba(13, 11, 14, .18) 74%, rgba(9, 8, 10, ${amount}) 100%)`,
    }}
  />
);

export const Mark = ({
  x,
  y,
  width,
  height,
  color,
  draw,
  fill = 0,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  draw: number;
  fill?: number;
}) => {
  const length = Math.min(19, width * 0.24, height * 0.38) * draw;
  return (
    <svg
      width={720}
      height={540}
      style={{
        position: "absolute",
        pointerEvents: "none",
        filter: "drop-shadow(0 0 1.5px #2a1a10) drop-shadow(0 1px 1px #2a1a10)",
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        opacity={fill * draw}
      />
      <g
        fill="none"
        stroke={color}
        strokeWidth={3.65}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={draw}
      >
        <path
          d={`M ${x + length} ${y} H ${x} v ${length}
        M ${x + width - length} ${y} H ${x + width} v ${length}
        M ${x} ${y + height - length} v ${length} h ${length}
        M ${x + width - length} ${y + height} h ${length} v ${-length}`}
        />
      </g>
    </svg>
  );
};

export const Cue = ({ captions }: { captions: Caption[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const milliseconds = (frame * 1000) / fps;
  const cue = captions.find(
    ({ startMs, endMs }) => startMs <= milliseconds && milliseconds < endMs,
  );
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 29,
        right: 29,
        bottom: 45,
        textAlign: "center",
        color: "white",
        fontFamily:
          "'Arial Narrow', 'Liberation Sans Narrow', Arial, sans-serif",
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: 38,
        letterSpacing: "0.005em",
        lineHeight: 1.05,
        fontStretch: "condensed",
        WebkitTextStroke: ".4px #e7e4e2",
        paintOrder: "stroke fill",
        textShadow: "0 2px 2px #161114, 0 4px 9px #0b090b",
      }}
    >
      {cue.text}
    </div>
  );
};

export const GuideText = ({
  children,
  x,
  y,
  color,
  opacity = 1,
  size = 29,
}: {
  children: ReactNode;
  x: number;
  y: number;
  color: string;
  opacity?: number;
  size?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      color,
      fontFamily: mono,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1,
      textShadow: "0 2px 5px #181018",
      opacity,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
