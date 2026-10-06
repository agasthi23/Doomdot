import { sound } from '../utils/audio.ts';
import DotSphere from './DotSphere.tsx';
import { RobotAnchor } from './RobotCompanion.tsx';

const LIME = '#B8E351';

interface HeroNeonProps {
  onOpenTerminal: () => void;
}

export default function HeroNeon({ onOpenTerminal }: HeroNeonProps) {
  return (
    <section
      id="about"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#040704] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(55% 60% at 72% 50%, rgba(184,227,81,0.18), transparent 70%),
            radial-gradient(45% 45% at 5% 100%, rgba(20,130,60,0.28), transparent 70%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap text-center font-black leading-none tracking-[-0.04em] select-none text-[19vw] sm:text-[20vw] lg:text-[22vw]"
        style={{
          background: `linear-gradient(180deg, rgba(184,227,81,0.30), rgba(184,227,81,0.025))`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 'min(16vw, 28rem)',
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        DOOMDOT
      </div>

      <div className="pointer-events-none absolute right-[-28%] top-[18%] z-0 h-[66vh] w-[100vw] opacity-50 sm:right-[-20%] sm:w-[82vw] lg:right-0 lg:top-0 lg:h-full lg:w-[65%] lg:opacity-100">
        <DotSphere />
        <RobotAnchor x="50%" y="50%" scale={1} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <div
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border px-3.5 py-2 font-mono text-[10px] text-[#B8E351] backdrop-blur-md sm:text-xs"
            style={{ borderColor: `${LIME}55`, background: 'rgba(184,227,81,0.06)' }}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: LIME, boxShadow: `0 0 10px ${LIME}` }}
            />
            <span>DOOMDOT // ONLINE · 4/4 FOUNDING ARCHITECTS ACTIVE</span>
          </div>

          <h1
            className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{
              background: `linear-gradient(180deg, #ffffff 30%, ${LIME})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Building tomorrow, with technology
            <span
              aria-hidden="true"
              className="inline-block"
              style={{ color: LIME, WebkitTextFillColor: LIME, textShadow: `0 0 24px ${LIME}` }}
            >
              .
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            We turn bold ideas into high-performance digital products, combining creativity,
            engineering and the power of emerging technology.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="#services"
              onClick={() => sound.playConfirm()}
              className="inline-flex items-center rounded-xl px-5 py-3.5 text-sm font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6"
              style={{ background: LIME, boxShadow: `0 0 30px ${LIME}66` }}
            >
              EXPLORE SERVICES <span aria-hidden="true" className="ml-2">→</span>
            </a>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenTerminal();
              }}
              className="inline-flex items-center rounded-xl border px-5 py-3.5 font-mono text-sm text-[#B8E351] transition hover:bg-[#B8E351]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E351] sm:px-6"
              style={{ borderColor: `${LIME}66` }}
            >
              {'>_ Launch CLI'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
