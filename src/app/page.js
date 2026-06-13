"use client";

import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "quest_tracker_history_v1";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function emptyDay() {
  return {
    workout: false,
    dsa: false,
    webdev: false,
    books: false,
    selfgrowth: false,
  };
}
function streakLabel(n) {
  if (n >= 50) return "Legendary";
  if (n >= 21) return "Master";
  if (n >= 7) return "Veteran";
  if (n >= 3) return "Adept";
  return "Rookie";
}

/* ---------------- INLINE SVG ICONS ---------------- */

function IconDumbbell({ color }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <defs>
        <linearGradient id="dbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.9" />
          <stop offset="1" stopColor="#1a0b2e" />
        </linearGradient>
      </defs>
      <rect
        x="26"
        y="10"
        width="12"
        height="44"
        rx="2"
        fill="url(#dbGrad)"
        stroke={color}
        strokeWidth="1"
      />
      <rect
        x="8"
        y="14"
        width="10"
        height="10"
        rx="1.5"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="40"
        width="10"
        height="10"
        rx="1.5"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="46"
        y="14"
        width="10"
        height="10"
        rx="1.5"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="46"
        y="40"
        width="10"
        height="10"
        rx="1.5"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect x="2" y="22" width="6" height="20" rx="1" fill={color} />
      <rect x="56" y="22" width="6" height="20" rx="1" fill={color} />
    </svg>
  );
}

function IconNeuralNet({ color }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <g stroke={color} strokeWidth="1.2" fill="none" opacity="0.7">
        <line x1="12" y1="14" x2="32" y2="32" />
        <line x1="12" y1="32" x2="32" y2="32" />
        <line x1="12" y1="50" x2="32" y2="32" />
        <line x1="32" y1="32" x2="52" y2="14" />
        <line x1="32" y1="32" x2="52" y2="32" />
        <line x1="32" y1="32" x2="52" y2="50" />
        <line x1="12" y1="14" x2="32" y2="14" />
        <line x1="12" y1="50" x2="32" y2="50" />
      </g>
      <g fill={color}>
        <circle cx="12" cy="14" r="3.5" />
        <circle cx="12" cy="32" r="3.5" />
        <circle cx="12" cy="50" r="3.5" />
        <circle cx="32" cy="32" r="5" />
        <circle cx="52" cy="14" r="3.5" />
        <circle cx="52" cy="32" r="3.5" />
        <circle cx="52" cy="50" r="3.5" />
      </g>
      <g fill={color} opacity="0.35">
        <circle cx="32" cy="32" r="9">
          <animate
            attributeName="r"
            values="9;13;9"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.35;0.05;0.35"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}

function IconTerminal({ color }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <rect
        x="4"
        y="8"
        width="56"
        height="48"
        rx="3"
        fill="#0a0014"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="8"
        width="56"
        height="10"
        rx="3"
        fill={color}
        opacity="0.15"
      />
      <circle cx="10" cy="13" r="1.5" fill={color} />
      <circle cx="15" cy="13" r="1.5" fill={color} opacity="0.5" />
      <circle cx="20" cy="13" r="1.5" fill={color} opacity="0.3" />
      <text x="9" y="32" fill={color} fontSize="9" fontFamily="monospace">
        {"<"}
      </text>
      <text
        x="20"
        y="32"
        fill={color}
        fontSize="9"
        fontFamily="monospace"
        opacity="0.6"
      >
        div
      </text>
      <text x="40" y="32" fill={color} fontSize="9" fontFamily="monospace">
        {"/>"}
      </text>
      <text
        x="9"
        y="46"
        fill={color}
        fontSize="9"
        fontFamily="monospace"
        opacity="0.8"
      >
        {"{ }"}
      </text>
      <rect x="40" y="40" width="14" height="3" fill={color} opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.8;0.1;0.8"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

function IconCodex({ color }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <path
        d="M8 12 C8 10 10 9 14 9 L30 9 L30 52 L14 52 C10 52 8 51 8 49 Z"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M56 12 C56 10 54 9 50 9 L34 9 L34 52 L50 52 C54 52 56 51 56 49 Z"
        fill="#1a0b2e"
        stroke={color}
        strokeWidth="1.5"
      />
      <line
        x1="32"
        y1="9"
        x2="32"
        y2="52"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
      <g stroke={color} strokeWidth="1.2" opacity="0.7">
        <line x1="13" y1="18" x2="27" y2="18" />
        <line x1="13" y1="24" x2="25" y2="24" />
        <line x1="13" y1="30" x2="27" y2="30" />
        <line x1="37" y1="18" x2="51" y2="18" />
        <line x1="37" y1="24" x2="49" y2="24" />
        <line x1="37" y1="30" x2="51" y2="30" />
      </g>
      <circle cx="32" cy="44" r="3" fill={color}>
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function IconZen({ color }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <line x1="32" y1="56" x2="32" y2="28" stroke={color} strokeWidth="1.5" />
      <path
        d="M32 28 C24 24 18 16 16 8 C26 10 32 18 32 28 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.3"
      />
      <path
        d="M32 34 C40 30 46 22 48 14 C38 16 32 24 32 34 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.3"
      />
      <path
        d="M32 40 C25 37 20 31 18 25 C26 26 32 32 32 40 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.3"
        opacity="0.7"
      />
      <ellipse
        cx="32"
        cy="58"
        rx="20"
        ry="3"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="32" cy="20" r="2" fill={color}>
        <animate
          attributeName="opacity"
          values="1;0.2;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

const QUESTS = [
  {
    id: "workout",
    label: "WORKOUT",
    Icon: IconDumbbell,
    title: "Objective 1: Total Body Decimation",
    desc: "Req: Complete Session",
    color: "#ff5e3a",
    glow: "rgba(255,94,58,0.55)",
  },
  {
    id: "dsa",
    label: "DSA",
    Icon: IconNeuralNet,
    title: "Objective 2: Algorithmic Domination",
    desc: "Req: Solve 5+ Problems",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.55)",
  },
  {
    id: "webdev",
    label: "WEB DEVELOPMENT",
    Icon: IconTerminal,
    title: "Objective 3: Code Mastermind",
    desc: "Req: 8+ Modules",
    color: "#39ff14",
    glow: "rgba(57,255,20,0.55)",
  },
  {
    id: "books",
    label: "BOOK READING",
    Icon: IconCodex,
    title: "Objective 4: Codex Protocol",
    desc: "Req: 10+ Pages",
    color: "#fb7185",
    glow: "rgba(251,113,133,0.55)",
  },
  {
    id: "selfgrowth",
    label: "SELF GROWTH",
    Icon: IconZen,
    title: "Objective 5: Transcendence",
    desc: "Req: Happiness, Planning, Gratitude, Calmness",
    color: "#2dd4bf",
    glow: "rgba(45,212,191,0.55)",
  },
];

const MILESTONES = [
  { day: 1, name: "Bronze Quest", icon: "🥉", color: "#cd7f32" },
  { day: 7, name: "Silver Streak", icon: "🥈", color: "#c0c0c0" },
  { day: 21, name: "Gold Mastery", icon: "🥇", color: "#ffd700" },
  { day: 50, name: "Diamond Elite", icon: "💎", color: "#00e5ff" },
  { day: 100, name: "OP Legend", icon: "👑", color: "#ff00ff" },
];

export default function Home() {
  const [history, setHistory] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(new Date());
  const todayKey = getTodayKey();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history, loaded]);

  useEffect(() => {
    if (!loaded) return;
    setHistory((prev) =>
      prev[todayKey] ? prev : { ...prev, [todayKey]: emptyDay() },
    );
  }, [loaded, todayKey]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayData = history[todayKey] || emptyDay();

  const todayPercent = useMemo(() => {
    const completed = QUESTS.filter((q) => todayData[q.id]).length;
    return Math.round((completed / QUESTS.length) * 100);
  }, [todayData]);

  const toggleQuest = (id) => {
    setHistory((prev) => {
      const day = prev[todayKey] || emptyDay();
      return { ...prev, [todayKey]: { ...day, [id]: !day[id] } };
    });
  };

  const sortedDates = useMemo(
    () => Object.keys(history).sort((a, b) => (a < b ? 1 : -1)),
    [history],
  );
  const dayPercent = (day) =>
    Math.round((QUESTS.filter((q) => day[q.id]).length / QUESTS.length) * 100);

  const totalDaysLogged = useMemo(
    () =>
      Object.values(history).filter((d) => QUESTS.some((q) => d[q.id])).length,
    [history],
  );
  const totalPerfectDays = useMemo(
    () =>
      Object.values(history).filter((d) => QUESTS.every((q) => d[q.id])).length,
    [history],
  );

  const syncStreak = useMemo(() => {
    let streak = 0;
    let cursor = new Date();
    for (let i = 0; i < 1000; i++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      const day = history[key];
      const perfect = day && QUESTS.every((q) => day[q.id]);
      if (perfect) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        if (key === todayKey) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  }, [history, todayKey]);

  const radius = 100,
    stroke = 16;
  const nr = radius - stroke / 2;
  const circumference = nr * 2 * Math.PI;
  const dashoffset = circumference - (todayPercent / 100) * circumference;
  let ringColor = "#22d3ee";
  if (todayPercent === 100) ringColor = "#39ff14";
  else if (todayPercent >= 60) ringColor = "#22d3ee";
  else if (todayPercent >= 30) ringColor = "#a855f7";
  else ringColor = "#ff5e3a";

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const ms = String(now.getMilliseconds()).padStart(3, "0");

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050212]">
        <p className="font-mono text-cyan-400 text-xl animate-pulse tracking-widest">
          [ INITIALIZING SYNC CORE... ]
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-6 md:px-8 lg:px-12 relative overflow-hidden text-white"
      style={{ background: "#050212" }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, #180d45 0%, #050212 75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <div className="inline-block px-6 py-3 rounded-lg border-2 border-cyan-400/50 bg-[#0d0420]/70 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <h1
              className="font-mono text-2xl md:text-4xl font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-emerald-300 to-fuchsia-400 bg-clip-text text-transparent"
              style={{ textShadow: "0 0 10px rgba(6,182,212,0.6)" }}
            >
              ULTRA QUEST: DAILY SYNC DASHBOARD
            </h1>
          </div>
          <p
            className="font-mono text-sm md:text-base text-emerald-400/80 mt-3 tracking-wide"
            style={{ textShadow: "0 0 8px rgba(52,211,153,0.5)" }}
          >
            {dateStr}{" "}
            <span className="text-gray-500">{ms} milliseconds...</span>
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-5 mb-8">
          {/* LEFT */}
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-[0.35em] text-yellow-400/90 uppercase mb-1">
              ⚡ MISSION OBJECTIVES
            </p>
            {QUESTS.slice(0, 3).map((q) => (
              <QuestCard
                key={q.id}
                q={q}
                done={todayData[q.id]}
                onToggle={() => toggleQuest(q.id)}
              />
            ))}
          </div>

          {/* CENTER */}
          <div className="flex flex-col items-center justify-center relative py-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-80 h-80 rounded-full border border-cyan-400/10 shadow-[0_0_80px_rgba(34,211,238,0.18)]" />
              <div className="absolute w-64 h-64 rounded-full border border-fuchsia-400/15 animate-pulse" />
              <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg] relative z-10"
              >
                <defs>
                  <filter
                    id="neonBlur"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  stroke="#150a30"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={nr}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke={ringColor}
                  fill="transparent"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  r={nr + 11}
                  cx={radius}
                  cy={radius}
                >
                  <animate
                    attributeName="stroke-opacity"
                    values="0.5;0.1;0.5"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  stroke={ringColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{
                    strokeDashoffset: dashoffset,
                    transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease",
                  }}
                  r={nr}
                  cx={radius}
                  cy={radius}
                  filter="url(#neonBlur)"
                />
              </svg>
              <div className="absolute flex flex-col items-center z-20">
                <span
                  className="font-mono text-7xl font-black tracking-tighter"
                  style={{
                    color: ringColor,
                    textShadow: `0 0 12px ${ringColor}, 0 0 35px ${ringColor}, 0 0 60px ${ringColor}`,
                  }}
                >
                  {todayPercent}%
                </span>
                <span
                  className="text-emerald-400 text-base mt-2 font-mono tracking-widest"
                  style={{ textShadow: "0 0 8px rgba(52,211,153,0.7)" }}
                >
                  {"✓ ".repeat(Math.round(todayPercent / 20)).trim() || "·····"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/60 mt-2 font-mono text-center">
                  {todayPercent === 100
                    ? "SYSTEM SYNC OVERPOWERED"
                    : "SYNC IN PROGRESS"}
                </span>
              </div>
            </div>

            {/* MILESTONE SHELF */}
            <div className="w-full mt-8 border border-yellow-500/20 bg-[#0d0420]/60 backdrop-blur-md rounded-xl p-4 relative shadow-[0_0_25px_rgba(250,204,21,0.12)]">
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-yellow-400/50" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-yellow-400/50" />
              <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-yellow-400/50" />
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-yellow-400/50" />
              <p className="font-mono text-xs tracking-[0.3em] text-yellow-400/90 uppercase mb-3">
                👑 MILESTONE REWARDS
              </p>
              <div className="grid grid-cols-5 gap-2">
                {MILESTONES.map((m) => {
                  const unlocked = totalPerfectDays >= m.day;
                  return (
                    <div key={m.day} className="flex flex-col items-center">
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-500 ${unlocked ? "bg-black/40" : "bg-black/30 border-gray-800 opacity-35 grayscale"}`}
                        style={
                          unlocked
                            ? {
                                borderColor: m.color,
                                boxShadow: `0 0 20px ${m.color}88`,
                              }
                            : {}
                        }
                      >
                        {unlocked && (
                          <span
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ background: m.color, opacity: 0.25 }}
                          />
                        )}
                        <span className="relative z-10">{m.icon}</span>
                      </div>
                      <p
                        className={`text-[9px] font-mono mt-1 text-center tracking-wide ${unlocked ? "" : "text-gray-600"}`}
                        style={unlocked ? { color: m.color } : {}}
                      >
                        {m.name.split(" ")[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative border border-cyan-400/40 bg-[#0d0420]/70 backdrop-blur-md rounded-xl p-4 flex flex-col items-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-300/80 uppercase mb-2">
                  SYNC STREAK
                </p>
                <svg
                  width="48"
                  height="56"
                  viewBox="0 0 56 64"
                  style={{ filter: "drop-shadow(0 0 10px #22d3ee)" }}
                >
                  <g
                    style={{
                      transformOrigin: "28px 56px",
                      animation: "flamepulse 1.4s ease-in-out infinite",
                    }}
                  >
                    <path
                      d="M28 4C28 4 12 22 12 38C12 50 19 58 28 58C37 58 44 50 44 38C44 22 28 4 28 4Z"
                      fill="#22d3ee"
                      opacity="0.9"
                    />
                    <path
                      d="M28 16C28 16 18 30 18 40C18 48 22 53 28 53C34 53 38 48 38 40C38 30 28 16 28 16Z"
                      fill="#67e8f9"
                      opacity="0.6"
                    />
                    <path
                      d="M28 20C28 20 20 32 20 41C20 48 23 52 28 52C33 52 36 48 36 41C36 32 28 20 28 20Z"
                      fill="#0d0420"
                      opacity="0.6"
                    />
                  </g>
                </svg>
                <p
                  className="font-mono text-lg font-black text-cyan-300 mt-2"
                  style={{ textShadow: "0 0 10px rgba(34,211,238,0.7)" }}
                >
                  {syncStreak} Days
                </p>
                <p className="text-[10px] text-gray-400 tracking-widest">
                  ({streakLabel(syncStreak)})
                </p>
              </div>

              <div className="relative border border-amber-300/30 bg-gradient-to-b from-[#3a2f1a] to-[#0d0420]/70 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(252,211,77,0.18)]">
                <p className="font-mono text-[10px] tracking-[0.3em] text-amber-200/80 uppercase mb-2">
                  ACTIVE DAYS
                </p>
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 64 64"
                  style={{ filter: "drop-shadow(0 0 6px #fcd34d)" }}
                >
                  <rect
                    x="8"
                    y="14"
                    width="48"
                    height="36"
                    rx="2"
                    fill="#2a2010"
                    stroke="#fcd34d"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="14" r="4" fill="#fcd34d" />
                  <circle cx="8" cy="50" r="4" fill="#fcd34d" />
                  <circle cx="56" cy="14" r="4" fill="#fcd34d" />
                  <circle cx="56" cy="50" r="4" fill="#fcd34d" />
                  <line
                    x1="16"
                    y1="24"
                    x2="48"
                    y2="24"
                    stroke="#fcd34d"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <line
                    x1="16"
                    y1="32"
                    x2="42"
                    y2="32"
                    stroke="#fcd34d"
                    strokeWidth="1.2"
                    opacity="0.5"
                  />
                  <line
                    x1="16"
                    y1="40"
                    x2="46"
                    y2="40"
                    stroke="#fcd34d"
                    strokeWidth="1.2"
                    opacity="0.5"
                  />
                </svg>
                <p
                  className="font-mono text-lg font-black text-amber-200 mt-2"
                  style={{ textShadow: "0 0 10px rgba(252,211,77,0.5)" }}
                >
                  {totalDaysLogged} Days
                </p>
                <p className="text-[10px] text-gray-400 tracking-widest">
                  ({streakLabel(totalDaysLogged)})
                </p>
              </div>
            </div>

            {QUESTS.slice(3, 5).map((q) => (
              <QuestCard
                key={q.id}
                q={q}
                done={todayData[q.id]}
                onToggle={() => toggleQuest(q.id)}
              />
            ))}
          </div>
        </div>

        {/* HISTORICAL DATABASE */}
        <section className="relative border border-emerald-500/20 bg-[#0d0420]/60 backdrop-blur-md rounded-xl p-6 mb-6 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400/50" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400/50" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400/50" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400/50" />
          <p
            className="font-mono text-xs tracking-[0.4em] text-emerald-400/80 uppercase mb-5"
            style={{ textShadow: "0 0 8px rgba(52,211,153,0.5)" }}
          >
            // HISTORICAL PERFORMANCE DATABASE (ENCRYPTED)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[760px] font-mono">
              <thead>
                <tr className="border-b border-emerald-500/20 text-emerald-400/60 text-[10px] uppercase tracking-[0.2em]">
                  <th className="py-3 pr-4">DATE</th>
                  <th className="py-3 pr-4 text-center">WORKOUT</th>
                  <th className="py-3 pr-4 text-center">DSA</th>
                  <th className="py-3 pr-4 text-center">WEB DEV</th>
                  <th className="py-3 pr-4 text-center">BOOKS</th>
                  <th className="py-3 pr-4 text-center">SELF GROWTH</th>
                  <th className="py-3 pr-4 text-right">SYNC %</th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-600 tracking-widest text-xs"
                    >
                      [ NO DATA STREAMS DETECTED — INITIATE FIRST QUEST ]
                    </td>
                  </tr>
                )}
                {sortedDates.map((date) => {
                  const day = history[date];
                  const pct = dayPercent(day);
                  const isToday = date === todayKey;
                  let pctColor = "text-gray-400";
                  if (pct === 100) pctColor = "text-emerald-400";
                  else if (pct >= 60) pctColor = "text-cyan-400";
                  else if (pct >= 30) pctColor = "text-purple-400";
                  else pctColor = "text-red-400";
                  return (
                    <tr
                      key={date}
                      className={`border-b border-emerald-500/5 hover:bg-emerald-500/5 transition-colors ${isToday ? "bg-cyan-500/5" : ""}`}
                    >
                      <td
                        className="py-3 pr-4 text-cyan-300 tracking-wider"
                        style={{ textShadow: "0 0 8px rgba(34,211,238,0.5)" }}
                      >
                        [{date}]
                        {isToday && (
                          <span className="text-fuchsia-400 text-[10px] ml-2">
                            // TODAY
                          </span>
                        )}
                      </td>
                      {QUESTS.map((q) => (
                        <td key={q.id} className="py-3 pr-4 text-center">
                          {day[q.id] ? (
                            <span
                              className="text-emerald-400 text-lg"
                              style={{
                                textShadow: "0 0 8px rgba(52,211,153,0.8)",
                              }}
                            >
                              ✓
                            </span>
                          ) : (
                            <span className="text-rose-700/80 text-lg">×</span>
                          )}
                        </td>
                      ))}
                      <td
                        className={`py-3 pr-4 text-right font-bold ${pctColor}`}
                      >
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-gray-600 text-[10px] tracking-[0.3em] font-mono pb-4">
          [ ENCRYPTED LOCAL STORAGE // NO EXTERNAL UPLINK // SESSION SECURE ]
        </footer>
      </div>

      <style>{`
        @keyframes flamepulse {
          0%, 100% { opacity: 0.85; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.12); }
        }
      `}</style>
    </main>
  );
}

function QuestCard({ q, done, onToggle }) {
  const Icon = q.Icon;
  return (
    <button
      onClick={onToggle}
      className="w-full text-left relative rounded-xl p-4 border-2 transition-all duration-300 overflow-hidden"
      style={{
        borderColor: done ? q.color : `${q.color}40`,
        background: done
          ? `linear-gradient(135deg, ${q.color}26, rgba(13,4,32,0.7))`
          : "rgba(13,4,32,0.7)",
        boxShadow: done
          ? `0 0 28px ${q.glow}, inset 0 0 22px ${q.glow}`
          : `inset 0 0 0px ${q.color}`,
        backdropFilter: done ? "blur(6px)" : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border"
          style={{ borderColor: `${q.color}55`, background: "#0a0014" }}
        >
          <Icon color={q.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-mono font-bold text-sm tracking-wider uppercase mb-0.5"
            style={{
              color: done ? q.color : "#e2e8f0",
              textShadow: done ? `0 0 8px ${q.glow}` : "none",
            }}
          >
            {q.label}
          </p>
          <p
            className={`text-xs ${done ? "text-gray-400 line-through" : "text-gray-400"}`}
          >
            {q.title}
          </p>
          <p
            className={`text-[11px] mt-0.5 ${done ? "text-emerald-400/70 line-through" : "text-gray-500"}`}
          >
            {q.desc}
          </p>
          <div
            className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-bold tracking-widest border"
            style={{
              borderColor: done ? q.color : "#444",
              color: done ? q.color : "#666",
              background: "rgba(0,0,0,0.4)",
              boxShadow: done ? `0 0 10px ${q.glow}` : "none",
            }}
          >
            {done ? "⚡ +20 XP SYNCED" : "+20 XP"}
          </div>
        </div>
        <div
          className="flex-shrink-0 font-mono text-sm font-black flex items-center justify-center w-9 h-9 rounded border"
          style={{
            borderColor: done ? "#39ff14" : `${q.color}55`,
            color: done ? "#39ff14" : `${q.color}99`,
            boxShadow: done ? "0 0 12px rgba(57,255,20,0.7)" : "none",
            background: "#0a0014",
          }}
        >
          {done ? "✓" : "[ ]"}
        </div>
      </div>
    </button>
  );
}
