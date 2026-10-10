import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Check, ChevronDown, Clock, LifeBuoy, Send, ShieldCheck } from 'lucide-react';
import { COLORS } from '../theme';
import { RobotAnchor } from './RobotCompanion';

const P = COLORS.primary;
const S = COLORS.secondary;
const EMAIL = 'doomdotsquad@gmail.com';
const MONO = "ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace";

const SERVICES = [
  'Front-End Development & UI/UX',
  'Back-End Engineering & Scalable APIs',
  'Full-Stack Web Applications',
  'Mobile & Web Applications',
  'AI & Intelligent System Integrations',
  'Not sure yet',
];

// How did you find us? — sources
const DISCOVERY = [
  'Instagram',
  'LinkedIn',
  'TikTok',
  'Facebook',
  'GitHub',
  'A Friend',
  'Other',
];

const EXPECT = [
  { Icon: Clock, title: 'A quick, human reply', text: 'Technical questions, specs and rough estimates, answered by the engineers themselves.' },
  { Icon: ShieldCheck, title: 'Escrow on Upwork & Fiverr', text: 'If you hire us through a platform, payment follows its milestone and escrow rules.' },
  { Icon: LifeBuoy, title: '30-day post-launch support', text: 'Bug fixes and deployment help are included after launch.' },
];

export type ContactData = {
  name: string;
  email: string;
  service: string;
  budget: string;
  source: string;
  message: string;
};

const EMPTY: ContactData = { name: '', email: '', service: '', budget: '', source: '', message: '' };

const label: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
};

/**
 * Normalizes an incoming service string (from the Services section CTA)
 * to an exact value from the SERVICES array.
 *
 * Handles:
 *  - Exact match: "Front-End Development & UI/UX"
 *  - Prefixed: "01 Front-End Development & UI/UX"
 *  - Partial: "Front-End" → "Front-End Development & UI/UX"
 */
const getDefaultService = (selectedService?: string): string => {
  if (!selectedService) return '';

  const normalized = selectedService.trim().toLowerCase();

  // 1) Exact match
  const exact = SERVICES.find((s) => s.toLowerCase() === normalized);
  if (exact) return exact;

  // 2) Keyword fallback
  const keywordMap: Record<string, string> = {
    front: 'Front-End Development & UI/UX',
    back: 'Back-End Engineering & Scalable APIs',
    'full-stack': 'Full-Stack Web Applications',
    fullstack: 'Full-Stack Web Applications',
    mobile: 'Mobile & Web Applications',
    ai: 'AI & Intelligent System Integrations',
    intelligent: 'AI & Intelligent System Integrations',
  };

  for (const [key, value] of Object.entries(keywordMap)) {
    if (normalized.includes(key)) return value;
  }

  return '';
};

const CSS = `
.ct-panel { position: relative; display: grid; grid-template-columns: 1.3fr 1fr; border: 1px solid ${P}26; border-radius: 22px; background: radial-gradient(${P}14 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(180deg, ${S}59, rgba(5,6,7,0.95)); box-shadow: 0 18px 60px -30px ${S}; }
.ct-col { padding: 22px 26px 24px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.ct-col + .ct-col { border-left: 1px solid ${P}1f; }
.ct-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.ct-step { display: flex; align-items: center; gap: 10px; font-family: ${MONO}; font-size: 11.5px; letter-spacing: .14em; color: ${P}; }
.ct-step::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, ${P}40, transparent); }
.ct-expect { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px; }
@media (max-width: 1000px) {
  .ct-panel { grid-template-columns: 1fr; }
  .ct-col + .ct-col { border-left: none; border-top: 1px solid ${P}1f; }
}
@media (max-width: 640px) { .ct-fields { grid-template-columns: 1fr; } }
@media (max-width: 800px) { .ct-expect { grid-template-columns: 1fr; gap: 16px; } }

.ct-input { width: 100%; box-sizing: border-box; height: 42px; background: rgba(255,255,255,0.04); border: 1px solid ${P}26; border-radius: 10px; padding: 0 12px; color: #fff; font: inherit; font-size: 14px; outline: none; transition: border-color .2s, box-shadow .2s, background .2s; }
.ct-input::placeholder { color: rgba(255,255,255,0.3); }
.ct-input:hover { border-color: ${P}55; }
.ct-input:focus { border-color: ${P}; background: rgba(184,227,81,0.04); box-shadow: 0 0 0 3px ${P}1f; }
textarea.ct-input { height: auto; flex: 1; min-height: 130px; padding: 10px 12px; resize: none; line-height: 1.45; }
select.ct-input { appearance: none; -webkit-appearance: none; padding-right: 40px; cursor: pointer; }
select.ct-input option { background: #0b110b; color: #fff; }
.ct-select { position: relative; }
.ct-select svg { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${P}; }

.ct-send { display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; border-radius: 10px; padding: 0 22px; height: 44px; background: ${P}; color: #000; font-weight: 700; font-size: 14px; transition: transform .15s, opacity .2s; width: 100%; }
.ct-send:hover:not(:disabled) { transform: translateY(-1px); }
.ct-send:disabled { opacity: .65; cursor: default; }
`;

export function ContactSection({
  selectedService,
  onSubmit,
}: {
  selectedService?: string;
  onSubmit?: (data: ContactData) => Promise<void> | void;
}) {
  const [f, setF] = useState<ContactData>(() => ({ ...EMPTY, service: getDefaultService(selectedService) }));
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'error' | 'sent'; text: string }>({ kind: 'idle', text: '' });

  useEffect(() => {
    if (selectedService) {
      setF((prev) => ({ ...prev, service: getDefaultService(selectedService) }));
    }
  }, [selectedService]);

  const set = <K extends keyof ContactData>(key: K, value: ContactData[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return setStatus({ kind: 'error', text: 'Please tell us your name.' });
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setStatus({ kind: 'error', text: 'Please enter a valid email address.' });
    if (!f.message.trim()) return setStatus({ kind: 'error', text: 'Tell us a little about your project.' });

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus({ kind: 'error', text: 'Configuration error: Access key is missing from .env' });
      return;
    }

    setSending(true);
    try {
      if (onSubmit) {
        await onSubmit(f);
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: f.name,
          email: f.email,
          subject: `[Doomdot Lead] Inquiry: ${f.service || 'General'}${f.source ? ` (via ${f.source})` : ''}`,
          message: `
Name: ${f.name}
Email: ${f.email}
Service: ${f.service || 'None specified'}
Budget: ${f.budget || 'Not specified'}
Found us via: ${f.source || 'Not specified'}

Message:
${f.message}
          `.trim(),
        }),
      });

      const result = await response.json();
      if (response.status === 200 && result.success) {
        setStatus({ kind: 'sent', text: 'Thank you! Your message has been sent successfully.' });
        setF({ ...EMPTY, service: getDefaultService(selectedService) });
      } else {
        console.error('Web3Forms Error Details:', result);
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Form submission catch error:', err);
      setStatus({ kind: 'error', text: `Something went wrong. Please email us directly at ${EMAIL}.` });
    } finally {
      setSending(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', padding: '60px 0 70px', color: '#fff' }}>
      <style>{CSS}</style>
      <RobotAnchor perch={[0.955, 0.5]} scale={0.35} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 5vw, 70px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', color: P, marginBottom: 8 }}>
              04 /// GET IN TOUCH
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '-0.045em',
              }}
            >
              Let&apos;s build something <span style={{ color: P }}>together</span>
              <span style={{ color: P }}>.</span>
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="ct-panel">
          <div className="ct-col">
            <div className="ct-step">01 / YOUR DETAILS</div>
            <div className="ct-fields">
              <div>
                <label style={label} htmlFor="ct-name">
                  Your name *
                </label>
                <input
                  id="ct-name"
                  className="ct-input"
                  autoComplete="name"
                  placeholder="e.g. Sarah Connor"
                  value={f.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>

              <div>
                <label style={label} htmlFor="ct-email">
                  Your email *
                </label>
                <input
                  id="ct-email"
                  className="ct-input"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. sarah@startup.com"
                  value={f.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={label} htmlFor="ct-service">
                  What do you need?
                </label>
                <div className="ct-select">
                  <select
                    id="ct-service"
                    className="ct-input"
                    value={f.service}
                    onChange={(e) => set('service', e.target.value)}
                    aria-label="Choose a service"
                    style={{ color: f.service ? '#fff' : 'rgba(255,255,255,0.3)' }}
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>

              <div>
                <label style={label} htmlFor="ct-budget">
                  Budget
                </label>
                <input
                  id="ct-budget"
                  className="ct-input"
                  placeholder="e.g. $4,000 or LKR 500,000"
                  value={f.budget}
                  onChange={(e) => set('budget', e.target.value)}
                />
              </div>

              <div>
                <label style={label} htmlFor="ct-source">
                  How did you find us?
                </label>
                <div className="ct-select">
                  <select
                    id="ct-source"
                    className="ct-input"
                    value={f.source}
                    onChange={(e) => set('source', e.target.value)}
                    aria-label="How did you find us"
                    style={{ color: f.source ? '#fff' : 'rgba(255,255,255,0.3)' }}
                  >
                    <option value="">Select an option</option>
                    {DISCOVERY.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="ct-col">
            <div className="ct-step">02 / YOUR PROJECT</div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label style={label} htmlFor="ct-msg">
                About your project *
              </label>
              <textarea
                id="ct-msg"
                className="ct-input"
                placeholder="What are you building? Mention your timeline or any links that help."
                value={f.message}
                onChange={(e) => set('message', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="submit" className="ct-send" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'} <Send size={15} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>or:</span>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    fontFamily: MONO,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: 4,
                  }}
                >
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  style={{
                    cursor: 'pointer',
                    background: `${P}1a`,
                    border: `1px solid ${P}40`,
                    borderRadius: 6,
                    color: P,
                    fontFamily: MONO,
                    fontSize: 11.5,
                    padding: '2px 7px',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div
              aria-live="polite"
              style={{
                minHeight: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: status.kind === 'error' ? '#ff8a7a' : P,
              }}
            >
              {status.kind === 'sent' && <Check size={15} />}
              {status.text}
            </div>
          </div>
        </form>

        <div className="ct-expect">
          {EXPECT.map(({ Icon, title, text }) => (
            <div key={title} style={{ display: 'flex', gap: 12 }}>
              <span
                style={{
                  flex: 'none',
                  width: 34,
                  height: 34,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 9,
                  border: `1px solid ${P}33`,
                  background: `${P}0d`,
                  color: P,
                }}
              >
                <Icon size={16} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                <div style={{ marginTop: 2, fontSize: 13, lineHeight: 1.45, color: 'rgba(255,255,255,0.56)' }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;