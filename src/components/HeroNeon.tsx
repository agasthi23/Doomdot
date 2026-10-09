import { COLORS } from '../theme';
import DotSphere from './DotSphere.tsx';
import HeroText from './HeroText.tsx';
import { RobotAnchor } from './RobotCompanion.tsx';

const LIME = COLORS.primary;

interface HeroNeonProps {
  onOpenTerminal?: () => void;
}

export default function HeroNeon({}: HeroNeonProps) {
  return (
    <section
      id="about"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#040704] text-white flex items-center"
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

      {/* Adjusted padding: Removed pt-28 and added pt-16 to perfectly align beneath the fixed navbar */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pt-16 sm:px-8 lg:px-12">
        <HeroText />
      </div>
    </section>
  );
}