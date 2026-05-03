import Link from "next/link";
import { ArrowRight, Github, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./(protected)/theme-toggle";

// ─── Wave configuration ───────────────────────────────────────────────────────
// Each wave is defined by:
//   y         – vertical centre of the wave (% of 1000-unit viewBox height)
//   amplitude – how tall the wave peaks are (px in viewBox units)
//   frequency – number of full cycles across the 1600-unit-wide viewBox
//   phase     – horizontal offset in degrees so waves don't all peak together
//   glowColor – the travelling highlight colour
//   dur       – seconds for one full pass of the travelling highlight
//   delay     – start delay so waves light up at different times
//   dir       – "right" | "left" travel direction

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

// Build an SVG path "d" attribute for a sine-like wave across the full width.
// viewBox is 1600 × 1000. We sample many points for a smooth curve.
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
    // sine wave with slight harmonic for organic feel
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

// ─── WavyBackground component ─────────────────────────────────────────────────
function WavyBackground() {
  // Total dash-array length that's longer than the path — makes the travelling
  // "lit segment" effect. dasharray = [visible segment, gap before next repeat]
  const DASH_SEGMENT = 180; // length of the glowing highlight
  const DASH_GAP = 2000; // effectively hides the rest of the dashes

  return (
    <svg
      className="wavy-canvas"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for the base dim lines */}
        <filter id="glow-base" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stronger glow for the travelling highlight */}
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
        const totalDash = DASH_SEGMENT + DASH_GAP;

        return (
          <g key={i}>
            {/* Dim base line — always visible */}
            <path d={d} className="wave-path" filter="url(#glow-base)" />

            {/* Travelling glow highlight */}
            <path
              d={d}
              fill="none"
              stroke={wave.glowColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray={`${DASH_SEGMENT} ${DASH_GAP}`}
              strokeDashoffset={wave.dir === "right" ? totalDash : -totalDash}
              filter="url(#glow-strong)"
              style={{
                animation: `${wave.dir === "right" ? "travelRight" : "travelLeft"} ${wave.dur}s linear infinite`,
                animationDelay: `${wave.delay}s`,
                ["--dur" as string]: `${wave.dur}s`,
                ["--delay" as string]: `${wave.delay}s`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Home() {
  return (
    <div className="aurora-bg flex min-h-screen flex-col bg-background">
      {/* Wavy animated background */}
      <WavyBackground />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-md">
        <div />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-6xl font-bold text-foreground">Athena</h1>
            <p className="mb-4 text-2xl text-muted-foreground">
              Understand your code with AI
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Connect your GitHub repositories and leverage semantic search
              powered by vector embeddings to ask questions about your code, get
              intelligent summaries, and explore commit history in one unified
              interface.
            </p>

            <Link href="/dashboard">
              <Button className="bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90">
                Connect your Repo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-lg border border-border bg-card/80 p-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex justify-center">
                <Github className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Connect Repo
              </h3>
              <p className="text-sm text-muted-foreground">
                Link your GitHub repository to index your codebase
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-border bg-card/80 p-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Ask Questions
              </h3>
              <p className="text-sm text-muted-foreground">
                Query your codebase using natural language
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-border bg-card/80 p-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Get Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive AI-powered answers about your code
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
