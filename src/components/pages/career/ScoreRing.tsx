const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// One coloured segment of a ring, from/to as fractions of the full circle
const RingArc = ({ from, to, color, width }: { from: number; to: number; color: string; width: number }) =>
  to > from ? (
    <circle
      cx="50"
      cy="50"
      r={RADIUS}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={`${CIRCUMFERENCE * (to - from)} ${CIRCUMFERENCE}`}
      strokeDashoffset={-CIRCUMFERENCE * from}
    />
  ) : null;

interface ScoreRingProps {
  value: number; // 0–100
  width?: number;
  // "score": orange for the first half, navy beyond (profile match design)
  // "progress": single arc in `color` (analysis progress, or a not-eligible score in red)
  variant?: "score" | "progress";
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

const ScoreRing = ({ value, width = 12, variant = "score", color = "#E8902F", className = "", children }: ScoreRingProps) => {
  const v = Math.max(0, Math.min(100, value)) / 100;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#E3E7EE" strokeWidth={width} />
        {variant === "progress" ? (
          <RingArc from={0} to={v} color={color} width={width} />
        ) : (
          <>
            <RingArc from={0} to={Math.min(v, 0.5)} color="#DE802B" width={width} />
            <RingArc from={0.5} to={v} color="#134698" width={width} />
          </>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
};

export default ScoreRing;
