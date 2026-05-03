import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "../../(protected)/theme-toggle";

function WavyBackground() {
  const WAVES = [
    {
      y: 80,
      amplitude: 28,
      frequency: 2.2,
      phase: 0,
      glowColor: "rgba(168,85,247,0.9)",
      dur: 10,
      delay: 0,
      dir: "right",
    },
    {
      y: 155,
      amplitude: 22,
      frequency: 2.6,
      phase: 40,
      glowColor: "rgba(139,92,246,0.85)",
      dur: 13,
      delay: -3,
      dir: "left",
    },
    {
      y: 240,
      amplitude: 32,
      frequency: 1.9,
      phase: 80,
      glowColor: "rgba(192,132,252,0.9)",
      dur: 9,
      delay: -1,
      dir: "right",
    },
    {
      y: 330,
      amplitude: 20,
      frequency: 2.8,
      phase: 120,
      glowColor: "rgba(147,51,234,0.9)",
      dur: 14,
      delay: -5,
      dir: "left",
    },
    {
      y: 420,
      amplitude: 35,
      frequency: 1.7,
      phase: 160,
      glowColor: "rgba(168,85,247,0.85)",
      dur: 11,
      delay: -2,
      dir: "right",
    },
    {
      y: 510,
      amplitude: 25,
      frequency: 2.4,
      phase: 200,
      glowColor: "rgba(139,92,246,0.9)",
      dur: 8,
      delay: -4,
      dir: "left",
    },
    {
      y: 600,
      amplitude: 30,
      frequency: 2.0,
      phase: 240,
      glowColor: "rgba(192,132,252,0.85)",
      dur: 12,
      delay: -6,
      dir: "right",
    },
    {
      y: 690,
      amplitude: 18,
      frequency: 3.0,
      phase: 280,
      glowColor: "rgba(147,51,234,0.9)",
      dur: 10,
      delay: -1.5,
      dir: "left",
    },
    {
      y: 775,
      amplitude: 28,
      frequency: 2.3,
      phase: 320,
      glowColor: "rgba(168,85,247,0.9)",
      dur: 15,
      delay: -7,
      dir: "right",
    },
    {
      y: 860,
      amplitude: 22,
      frequency: 2.7,
      phase: 360,
      glowColor: "rgba(139,92,246,0.85)",
      dur: 9,
      delay: -3.5,
      dir: "left",
    },
    {
      y: 940,
      amplitude: 32,
      frequency: 1.8,
      phase: 400,
      glowColor: "rgba(192,132,252,0.9)",
      dur: 11,
      delay: -2.5,
      dir: "right",
    },
  ];

  const DASH_SEGMENT = 180;
  const DASH_GAP = 2000;
  const TOTAL = DASH_SEGMENT + DASH_GAP;

  function buildWavePath(
    y: number,
    amplitude: number,
    frequency: number,
    phase: number,
  ): string {
    const WIDTH = 1600;
    const STEPS = 200;
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * WIDTH;
      const radians =
        (i / STEPS) * frequency * 2 * Math.PI + (phase * Math.PI) / 180;
      const yPos =
        y +
        Math.sin(radians) * amplitude +
        Math.sin(radians * 1.7 + 1) * amplitude * 0.15;
      points.push(
        i === 0
          ? `M ${x.toFixed(2)},${yPos.toFixed(2)}`
          : `L ${x.toFixed(2)},${yPos.toFixed(2)}`,
      );
    }
    return points.join(" ");
  }

  return (
    <svg
      className="wavy-canvas"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow-base" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-strong" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="12" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {WAVES.map((wave, i) => {
        const d = buildWavePath(
          wave.y,
          wave.amplitude,
          wave.frequency,
          wave.phase,
        );
        return (
          <g key={i}>
            <path d={d} className="wave-path" filter="url(#glow-base)" />
            <path
              d={d}
              fill="none"
              stroke={wave.glowColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray={`${DASH_SEGMENT} ${DASH_GAP}`}
              strokeDashoffset={wave.dir === "right" ? TOTAL : -TOTAL}
              filter="url(#glow-strong)"
              style={{
                animation: `${wave.dir === "right" ? "travelRight" : "travelLeft"} ${wave.dur}s linear infinite`,
                animationDelay: `${wave.delay}s`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function Page() {
  return (
    <div className="aurora-bg flex min-h-screen flex-col bg-background">
      <WavyBackground />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link
          href="/"
          className="text-lg font-bold text-foreground transition-colors hover:text-primary"
        >
          Athena
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered SignUp */}
      <div className="relative z-20 flex flex-1 items-center justify-center px-6 py-12">
        <SignUp />
      </div>
    </div>
  );
}
