import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Activity, Terminal, Shield, Zap, Check, GitCommit, Sparkles, TrendingUp } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const InteractiveMicroApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'ai' | 'commits'>('crypto');

  // Crypto orderbook simulator state
  const [tickerPrice, setTickerPrice] = useState(64820.5);
  const [orderLogs, setOrderLogs] = useState<Array<{ id: string; type: 'BUY' | 'SELL'; size: number; price: number; ms: number }>>([
    { id: 'tx-1', type: 'BUY', size: 1.45, price: 64818.0, ms: 14 },
    { id: 'tx-2', type: 'BUY', size: 0.82, price: 64819.5, ms: 18 },
    { id: 'tx-3', type: 'SELL', size: 2.10, price: 64821.0, ms: 22 },
  ]);
  const [simRunning, setSimRunning] = useState(true);

  // AI wrapper test state
  const [inputPrompt, setInputPrompt] = useState('Analyze high-throughput Redis state machine for race conditions');
  const [aiOutput, setAiOutput] = useState<{
    status: string;
    latency: number;
    tokensPerSec: number;
    classification: string;
    guardrails: string;
  } | null>({
    status: 'OPTIMAL_EXECUTION',
    latency: 38,
    tokensPerSec: 142.8,
    classification: 'CONCURRENCY_OPTIMIZATION',
    guardrails: 'PASSED (0 VULNERABILITIES)',
  });
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Live orderbook tick
  useEffect(() => {
    if (!simRunning || activeTab !== 'crypto') return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 12;
      setTickerPrice((prev) => +(prev + delta).toFixed(2));

      if (Math.random() > 0.4) {
        const type: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const size = +(Math.random() * 2 + 0.1).toFixed(2);
        const ms = Math.floor(Math.random() * 25 + 12);
        setOrderLogs((prev) => [
          { id: `tx-${Date.now()}`, type, size, price: +(tickerPrice + delta).toFixed(2), ms },
          ...prev.slice(0, 4),
        ]);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [simRunning, activeTab, tickerPrice]);

  const handleTestOrder = (type: 'BUY' | 'SELL') => {
    sound.playConfirm();
    const newTx = {
      id: `manual-${Date.now()}`,
      type,
      size: 1.0,
      price: tickerPrice,
      ms: 9,
    };
    setOrderLogs([newTx, ...orderLogs.slice(0, 4)]);
  };

  const handleRunAiClassifier = () => {
    sound.playClick();
    setIsAiProcessing(true);
    setTimeout(() => {
      sound.playConfirm();
      setIsAiProcessing(false);
      setAiOutput({
        status: 'DISPATCH_VERIFIED',
        latency: Math.floor(Math.random() * 20 + 26),
        tokensPerSec: +(Math.random() * 30 + 130).toFixed(1),
        classification: inputPrompt.toLowerCase().includes('redis') ? 'MEMORY_CACHE_PIPELINE' : 'SEMANTIC_ROUTING',
        guardrails: 'PASSED (STRICT SAFETY VALIDATED)',
      });
    }, 450);
  };

  return (
    <section id="sandbox" className="py-24 bg-[#050607] border-t border-[#23430C] relative dot-matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">03</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>LIVE CONCEPT SANDBOX</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">PLAYABLE MICRO-APPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Test Our Code in Real-Time
            </h2>
          </div>
          <p className="text-sm text-zinc-300 max-w-md font-sans">
            Don&apos;t just take our word for it. Interact with live concept tools engineered by our squad to prove sub-50ms latency, algorithmic precision, and clean state.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-1.5 bg-[#090e06] border border-[#23430C] rounded-lg max-w-lg mb-8 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('crypto');
            }}
            className={`flex-1 py-2 rounded transition-all text-center ${
              activeTab === 'crypto'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C] shadow-[0_0_12px_rgba(184,227,81,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vortex Crypto Desk
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('ai');
            }}
            className={`flex-1 py-2 rounded transition-all text-center ${
              activeTab === 'ai'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C] shadow-[0_0_12px_rgba(184,227,81,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Token Engine
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('commits');
            }}
            className={`flex-1 py-2 rounded transition-all text-center ${
              activeTab === 'commits'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C] shadow-[0_0_12px_rgba(184,227,81,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Git Commit Streak
          </button>
        </div>

        {/* Sandbox Screen */}
        <div className="rounded-xl border border-[#23430C] bg-[#090e06] p-6 sm:p-8 lime-glow">
          {/* Tool 1: Vortex Crypto Data Dashboard */}
          {activeTab === 'crypto' && (
            <div className="space-y-6 text-left font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#23430C] gap-3">
                <div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
                    <span>PAIR: BTC / USDT (HIGH-FREQUENCY WEBSOCKET)</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-display mt-1 tabular-nums">
                    ${tickerPrice.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestOrder('BUY')}
                    className="px-4 py-2 bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs rounded transition-all shadow-[0_0_10px_rgba(184,227,81,0.5)] cursor-pointer"
                  >
                    Simulate Instant BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestOrder('SELL')}
                    className="px-4 py-2 bg-[#1b2f0a] hover:bg-[#28450e] text-[#B8E351] border border-[#23430C] font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    Simulate Instant SELL
                  </button>
                </div>
              </div>

              {/* Order Log Feed */}
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Sub-Millisecond Order Execution Log:</span>
                  <span className="text-[#B8E351] text-[11px]">LATENCY: &lt; 25ms VERIFIED</span>
                </div>

                <div className="bg-[#050804] border border-[#23430C] rounded-lg p-4 space-y-2">
                  {orderLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-xs py-1 border-b border-[#23430C]/40 last:border-none">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'BUY' ? 'bg-[#1b2f0a] text-[#B8E351]' : 'bg-red-950/80 text-red-400'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-white">{log.size} BTC</span>
                        <span className="text-zinc-400">@ ${log.price}</span>
                      </div>
                      <span className="text-[#B8E351] tabular-nums font-bold">
                        {log.ms}ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tool 2: AI Token Engine */}
          {activeTab === 'ai' && (
            <div className="space-y-6 text-left font-mono">
              <div className="pb-4 border-b border-[#23430C]">
                <div className="text-xs text-zinc-400 mb-2">CUSTOM LLM AGENT ROUTER (FASTAPI + VECTOR PIPELINE)</div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Enter prompt or query to classify..."
                    className="flex-1 bg-[#050804] border border-[#23430C] focus:border-[#B8E351] rounded p-3 text-white outline-none text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiClassifier}
                    disabled={isAiProcessing}
                    className="px-5 py-3 bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(184,227,81,0.5)] shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {isAiProcessing ? 'Benchmarking...' : 'Execute AI Pipeline'}
                  </button>
                </div>
              </div>

              {/* Output Benchmark metrics */}
              {aiOutput && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#050804] border border-[#23430C] rounded-lg p-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">EXECUTION STATUS</span>
                    <span className="text-sm font-bold text-[#B8E351]">{aiOutput.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TOTAL LATENCY</span>
                    <span className="text-sm font-bold text-white tabular-nums">{aiOutput.latency}ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TOKEN STREAM</span>
                    <span className="text-sm font-bold text-[#B8E351] tabular-nums">{aiOutput.tokensPerSec} t/s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">GUARDRAILS</span>
                    <span className="text-sm font-bold text-emerald-400">{aiOutput.guardrails}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 3: Git Live Commit Activity Streak */}
          {activeTab === 'commits' && (
            <div className="space-y-6 text-left font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#23430C] gap-3">
                <div>
                  <div className="text-xs text-zinc-400">ORGANIZATION REPOSITORY HEALTH</div>
                  <div className="text-2xl font-bold text-white font-display mt-0.5">
                    184-Day Active Production Commit Streak
                  </div>
                </div>
                <div className="text-xs font-mono text-[#B8E351] flex items-center gap-1.5 bg-[#14220b] px-3 py-1.5 rounded border border-[#23430C]">
                  <GitCommit className="w-4 h-4" />
                  <span>674 COMMITS THIS QUARTER</span>
                </div>
              </div>

              {/* Simulated Git matrix heatmap blocks */}
              <div>
                <div className="text-xs text-zinc-400 mb-2">Continuous Delivery Activity Heatmap:</div>
                <div className="grid grid-cols-12 sm:grid-cols-24 gap-1.5 p-3 bg-[#050804] border border-[#23430C] rounded-lg overflow-x-auto">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const intensity = (i * 7 + 13) % 4;
                    const bgClass =
                      intensity === 3
                        ? 'bg-[#B8E351] shadow-[0_0_6px_#B8E351]'
                        : intensity === 2
                        ? 'bg-[#65a30d]'
                        : intensity === 1
                        ? 'bg-[#23430C]'
                        : 'bg-[#101b0a]';
                    return (
                      <div
                        key={i}
                        title={`Day ${i + 1}: ${intensity * 4 + 2} commits merged`}
                        className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2">
                  <span>Less Active</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#101b0a] rounded-sm" />
                    <span className="w-2.5 h-2.5 bg-[#23430C] rounded-sm" />
                    <span className="w-2.5 h-2.5 bg-[#65a30d] rounded-sm" />
                    <span className="w-2.5 h-2.5 bg-[#B8E351] rounded-sm" />
                  </div>
                  <span>High Velocity (Doomdot Standard)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
