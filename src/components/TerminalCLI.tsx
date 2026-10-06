import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, CornerDownLeft } from 'lucide-react';
import { TerminalEntry } from '../types.ts';
import { SQUAD_ROSTER, CAPSTONE_PROJECTS } from '../data/doomdotData.ts';
import { sound } from '../utils/audio.ts';

interface TerminalCLIProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact: () => void;
}

export const TerminalCLI: React.FC<TerminalCLIProps> = ({ isOpen, onClose, onNavigateToContact }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'DOOMDOT CYBER CORE v3.0 — CO-OP SQUAD CONSOLE',
    },
    {
      id: 'init-2',
      type: 'output',
      content: 'Welcome, operative. Type "help" to inspect commands or "sudo hire" to initiate a sprint quest.',
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    sound.playClick();
    const newEntry: TerminalEntry = {
      id: String(Date.now()),
      type: 'input',
      content: `$ ${inputVal}`,
    };

    let responseEntry: TerminalEntry = {
      id: String(Date.now() + 1),
      type: 'output',
      content: '',
    };

    switch (cmd) {
      case 'help':
        responseEntry.content = `AVAILABLE COMMANDS:
  help       - Show this command reference
  logo       - Display official DoomDot emblem & ASCII ID
  squad      - Inspect the 4 co-founders (2 SE, 2 CS)
  skills     - List full technical arsenal & skill trees
  projects   - Output cap-stone & production case studies
  fiverr     - Upwork & Fiverr availability status
  quote      - Project scope estimation summary
  clear      - Clear the terminal console
  sudo hire  - Fast-track project dispatch form
  exit       - Close this terminal window`;
        break;

      case 'logo':
      case 'brand':
        responseEntry.content = `
       .---.            (●) [glowing satellite dot]
     /  .-.  \\
    |  (   )  '-----.
     \\  '-'  DoomDot )
      '------------'
   DOOMDOT — Web Development Startup
   Design: Cyber Lime (#B8E351) + Obsidian Black (#050607)
   Founders: 2 Software Engineers + 2 Computer Scientists
   Stack: React, Next.js, Go, Python, C++, Three.js, PostgreSQL`;
        break;

      case 'squad':
      case 'team':
      case 'roster':
        responseEntry.content = SQUAD_ROSTER.map(
          (m, idx) => `[P${idx + 1} // ${m.callsign}] ${m.name} · ${m.role} (${m.degree}) — Weapons: ${m.primaryWeapons.slice(0, 3).join(', ')}`
        ).join('\n');
        break;

      case 'skills':
      case 'stack':
        responseEntry.content = `CORE ARSENAL:
  Languages: TypeScript, Python, C++, Go, GLSL, Rust WASM
  Frameworks: Next.js 15, React 19, React Native, Vite, FastAPI, Three.js
  Data/Cloud: PostgreSQL, Redis, ClickHouse, Docker, Qdrant Vector DB
  Speed: 14-day production MVP turnarounds`;
        break;

      case 'projects':
      case 'work':
        responseEntry.content = CAPSTONE_PROJECTS.map(
          (p) => `* ${p.title} (${p.category.toUpperCase()}) — ${p.tagline} | Tech: ${p.stack.slice(0, 3).join(', ')}`
        ).join('\n');
        break;

      case 'fiverr':
      case 'upwork':
        responseEntry.content = `FREELANCE STATUS:
  Platform: Upwork & Fiverr Pro Ready
  Escrow: 100% Milestone-based release
  Code Ownership: Full private GitHub transfer
  Ghosting Rate: 0.00% guaranteed`;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'sudo hire':
      case 'hire':
        sound.playConfirm();
        onClose();
        onNavigateToContact();
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        sound.playError();
        responseEntry = {
          id: String(Date.now() + 1),
          type: 'error',
          content: `Command not recognized: "${cmd}". Type "help" for a list of tactical commands.`,
        };
        break;
    }

    setHistory((prev) => [...prev, newEntry, responseEntry]);
    setInputVal('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#050607] border border-[#23430C] rounded-xl shadow-2xl overflow-hidden lime-glow flex flex-col h-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="bg-[#090e06] px-4 py-2.5 border-b border-[#23430C] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Terminal className="w-4 h-4 text-[#B8E351]" />
            <span>doomdot_cli@matrix:~$</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#B8E351] bg-[#14230b] px-2 py-0.5 rounded border border-[#23430C]">
              SESSION: ACTIVE
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#121c0b] cursor-pointer"
              aria-label="Close terminal"
            >
              <X className="w-4 h-4 text-[#B8E351]" />
            </button>
          </div>
        </div>

        {/* Output Console Log */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-[#030405] text-left">
          {history.map((entry) => (
            <div key={entry.id}>
              {entry.type === 'system' && (
                <div className="text-[#B8E351] font-bold tracking-wider">{entry.content}</div>
              )}
              {entry.type === 'input' && (
                <div className="text-white font-semibold">{entry.content}</div>
              )}
              {entry.type === 'output' && (
                <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{entry.content}</pre>
              )}
              {entry.type === 'error' && (
                <div className="text-red-400">{entry.content}</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleCommand} className="bg-[#090e06] border-t border-[#23430C] p-2.5 flex items-center gap-2">
          <span className="text-[#B8E351] font-mono text-xs font-bold pl-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'squad', or 'sudo hire'..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-zinc-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#15240b] hover:bg-[#B8E351] text-xs font-mono text-[#B8E351] hover:text-black font-bold rounded border border-[#23430C] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
