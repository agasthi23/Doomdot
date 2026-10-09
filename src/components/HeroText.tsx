import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { COLORS } from '../theme';

const LIME = COLORS.primary;
const MONO = "ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace";
const DISPLAY = "var(--font-display, 'Orbitron', 'Michroma', ui-sans-serif, system-ui, sans-serif)";

const line: CSSProperties = { display: 'block' };

export default function HeroText() {
  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, padding: '0 6vw', paddingTop: '14vh' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 28px',
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: '0.04em',
          color: LIME,
        }}
      >
        <span>[ 01 / CODE STREAM: ACTIVE ]</span>
        <span>ENGINEERING THE NEXT DIGITAL ERA</span>
      </div>

      <h1
        style={{
          margin: '22px 0 0',
          fontFamily: DISPLAY,
          fontWeight: 900,
          textTransform: 'uppercase',
          color: '#fff',
          fontSize: 'clamp(1.8rem, 3.5vw, 3.3rem)',
          lineHeight: 1.14,
          letterSpacing: '0.01em',
        }}
      >
        <span style={line}>Doomdot //</span>
        <span style={line}>Leveling Up</span>
        <span style={line}>Digital Builds</span>
      </h1>

      <p
        style={{
          margin: '24px 0 0',
          maxWidth: 500,
          color: 'rgba(255,255,255,0.82)',
          fontSize: 18,
          lineHeight: 1.55,
        }}
      >
        From wild concepts to precise digital machines. We design, engineer, and ship what comes next.
      </p>

      <div style={{ marginTop: 34, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <a
          href="#contact"
          style={{
            background: LIME,
            color: '#000',
            fontWeight: 700,
            fontSize: 15,
            padding: '14px 22px',
            borderRadius: 12,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>Contact Doomdot</span>
          <ArrowUpRight size={17} />
        </a>
        <a
          href="#team"
          style={{
            color: '#fff',
            fontSize: 13,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '14px 22px',
            borderRadius: 12,
            textDecoration: 'none',
            border: `1px solid ${LIME}66`,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Explore Team 
        </a>
      </div>

      <div
        style={{
          marginTop: 44,
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: '0.08em',
          color: LIME,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 18px',
        }}
      >
        <span>SCROLL TO EXPLORE ↓</span>
        <span>//</span>
        <span>FOUR MINDS. ONE MISSION.</span>
      </div>
    </div>
  );
}