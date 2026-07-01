import { useState, useEffect, useRef, useCallback } from "react";

// ─── _get_refresh_time logic (mirrored from livesearch.py) ────────────────
function getCommonRefreshTime(t) {
  if (t % 300 === 0) return 300;
  if (t % 180 === 0) return 180;
  if (t % 120 === 0) return 120;
  return 60;
}

function getDefaultRefreshTime(t) {
  if (t > 600) {
    if (t <= 21600) return getCommonRefreshTime(t);
    if (t <= 86400) return t % 600 === 0 ? 600 : getCommonRefreshTime(t);
    return t % 3600 === 0 ? 3600 : t % 600 === 0 ? 600 : getCommonRefreshTime(t);
  }
  return 60;
}

function getValidRefreshTimes(tr) {
  const out = [];
  for (let r = 60; r < tr; r += 60) {
    if (tr % r === 0) out.push(r);
  }
  return out.length ? out : [60];
}

function fmtSec(s) {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${s / 60}m`;
  if (s < 86400) return `${s / 3600}h`;
  return `${(s / 86400).toFixed(1)}d`;
}

function numFmt(n) {
  return n.toLocaleString();
}

const REAL_TICK_SEC = 0.2;

const TIME_RANGES = [
  { label: "5 minutes", value: 300 },
  { label: "10 minutes", value: 600 },
  { label: "15 minutes", value: 900 },
  { label: "30 minutes", value: 1800 },
  { label: "1 hour", value: 3600 },
  { label: "6 hours", value: 21600 },
  { label: "12 hours", value: 43200 },
  { label: "24 hours", value: 86400 },
  { label: "7 days", value: 604800 },
];

const GLOSSARY = [
  {
    term: "life_id",
    def: "A hash uniquely identifying one livesearch configuration (query + repos + time range). The premerger runs one search per unique life_id.",
  },
  {
    term: "refresh_time",
    def: "How often the premerger produces a new bucket of data for a given life, in seconds. Derived from time_range_seconds by _get_refresh_time(), or set explicitly by the user (must be a factor of time_range_seconds).",
  },
  {
    term: "search_interval_minute",
    def: "The same concept as refresh_time, expressed in minutes, stored in the alert rule record and consumed by the alert engine's time-gate in analyzer.py.",
  },
  {
    term: "bucket(ts, numSecs)",
    def: "ts − (ts % numSecs) — rounds a timestamp down to the nearest multiple of numSecs. The premerger only fires a new merger request when this value changes between two consecutive producer ticks.",
  },
  {
    term: "SimpleAggProducerThread",
    def: "A single Java thread that loops continuously, sleeping 200ms between passes. On each pass it iterates round-robin across all configured lives and fires a merger request for any life whose bucket boundary has advanced.",
  },
  {
    term: "Merger",
    def: "A stateless query-execution backend. It receives a search request from the premerger, runs it, and returns raw results. It has no concept of buckets, life IDs, or scheduling — it only acts when the premerger calls it.",
  },
  {
    term: "Alert engine time-gate",
    def: "A check in analyzer.py that skips alert evaluation unless search_interval_minute × 60 seconds have elapsed since the last trigger. The regression bug: when the field was missing from DB, the fallback was in seconds not minutes — making the gate 60× too wide.",
  },
  {
    term: "Idle gap",
    def: "The stretch of producer ticks between two bucket transitions where the premerger checks but does nothing. Every tick in this gap is provably 'skip' because bucket() cannot change until refresh_time seconds have elapsed.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function Select({ id, label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm font-medium text-slate-400 whitespace-nowrap">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-slate-800 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DerivedInfo({ timeRangeSec, refreshTime, defaultRT }) {
  const isUserSet = refreshTime !== defaultRT;
  const transitions = Math.round(timeRangeSec / refreshTime);
  const ticksPerBucket = Math.round(refreshTime / REAL_TICK_SEC);
  const totalTicks = Math.round(timeRangeSec / REAL_TICK_SEC);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm leading-relaxed font-mono">
      <div className="text-slate-300">
        <span className="text-slate-500">time_range_seconds</span>{" "}
        <span className="text-slate-500">=</span>{" "}
        <span className="text-emerald-400 font-bold">{timeRangeSec}</span>
        <span className="text-slate-500 mx-2">→</span>
        <span className="text-slate-500">refresh_time</span>{" "}
        <span className="text-slate-500">=</span>{" "}
        <span className="text-emerald-400 font-bold">{refreshTime}s</span>
        {isUserSet ? (
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700">
            user configured
          </span>
        ) : (
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
            system default
          </span>
        )}
      </div>
      {isUserSet && (
        <div className="text-slate-500 text-xs mt-1">
          system default for this range would be{" "}
          <span className="text-slate-300">{defaultRT}s</span> — user override applied
        </div>
      )}
      <div className="text-slate-400 mt-1 text-xs">
        <span className="text-slate-500">ticks_per_bucket</span> ={" "}
        <span className="text-violet-300">{numFmt(ticksPerBucket)}</span>
        <span className="mx-3 text-slate-600">|</span>
        <span className="text-slate-500">bucket_transitions</span> ={" "}
        <span className="text-emerald-300 font-bold">{transitions}</span>
        <span className="mx-3 text-slate-600">|</span>
        <span className="text-slate-500">real_ticks_in_cycle</span> ={" "}
        <span className="text-violet-300">{numFmt(totalTicks)}</span>
      </div>
    </div>
  );
}

function BucketEvent({ index, fireAt, isFuture }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-w-[88px] h-14 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 transition-opacity duration-200 px-3 ${
        isFuture ? "opacity-25" : "opacity-100"
      }`}
    >
      <span className="text-emerald-300 text-sm font-bold font-mono">
        bucket #{index}
      </span>
      <span className="text-emerald-500 text-xs mt-0.5 font-mono">
        fire @ {fmtSec(fireAt)}
      </span>
    </div>
  );
}

function IdleGap({ ticksPerBucket, isFuture }) {
  const idleTicks = ticksPerBucket - 1;
  return (
    <div
      className={`flex flex-col items-center justify-center h-14 px-4 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/40 min-w-[120px] transition-opacity duration-200 ${
        isFuture ? "opacity-25" : "opacity-100"
      }`}
    >
      <span className="text-slate-500 text-xs font-mono font-medium">
        {numFmt(idleTicks)} skip ticks
      </span>
      <span className="text-slate-600 text-xs mt-0.5 font-mono">
        {fmtSec(idleTicks * REAL_TICK_SEC)} idle
      </span>
    </div>
  );
}

function MergerBar({ currentEvent, numTransitions, refreshTime, ticksPerBucket }) {
  const mergerRef = useRef(null);
  const [markStyle, setMarkStyle] = useState({ opacity: 0 });

  useEffect(() => {
    if (!mergerRef.current) return;
    const track = document.getElementById("loop-track");
    if (!track) return;
    const events = track.querySelectorAll("[data-bucket-event]");
    const target = events[currentEvent];
    if (!target) return;
    const evR = target.getBoundingClientRect();
    const flR = mergerRef.current.getBoundingClientRect();
    setMarkStyle({
      left: evR.left - flR.left,
      width: evR.width,
      opacity: 1,
    });
  }, [currentEvent]);

  return (
    <div
      ref={mergerRef}
      className="relative h-12 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 flex items-center overflow-hidden"
    >
      <span className="pl-4 text-sm text-slate-600 font-mono">
        waiting for next transition...
      </span>
      <div
        className="absolute top-1.5 h-9 rounded-lg bg-violet-600 border border-violet-400 flex items-center justify-center text-white text-xs font-bold font-mono whitespace-nowrap px-3 transition-all duration-300"
        style={markStyle}
      >
        request sent
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-center min-w-[120px]">
      <div className="text-xs text-slate-500 font-mono">{label}</div>
      <div className="text-xl font-bold text-slate-100 mt-1 font-mono">{value}</div>
    </div>
  );
}

function GlossaryTable() {
  return (
    <div className="mt-8">
      <h2 className="text-base font-semibold text-slate-200 mb-4 tracking-wide uppercase text-xs font-mono text-slate-500">
        Glossary
      </h2>
      <div className="border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider w-48">
                Term
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Definition
              </th>
            </tr>
          </thead>
          <tbody>
            {GLOSSARY.map((item, i) => (
              <tr
                key={item.term}
                className={`border-b border-slate-700/50 last:border-0 ${
                  i % 2 === 0 ? "bg-slate-800/30" : "bg-transparent"
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <code className="text-violet-300 text-xs bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                    {item.term}
                  </code>
                </td>
                <td className="px-4 py-3 text-slate-400 leading-relaxed align-top">
                  {item.def}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function PremergerSimulation() {
  const [timeRangeSec, setTimeRangeSec] = useState(3600);
  const [refreshTime, setRefreshTime] = useState(getDefaultRefreshTime(3600));
  const [currentEvent, setCurrentEvent] = useState(0);
  const [firedEvents, setFiredEvents] = useState([]);
  const [playing, setPlaying] = useState(false);
  const playTimerRef = useRef(null);

  const defaultRT = getDefaultRefreshTime(timeRangeSec);
  const validRefreshTimes = getValidRefreshTimes(timeRangeSec);
  const ticksPerBucket = Math.round(refreshTime / REAL_TICK_SEC);
  const numTransitions = Math.round(timeRangeSec / refreshTime);

  const refreshTimeOptions = validRefreshTimes.map((r) => ({
    value: r,
    label: fmtSec(r) + (r === defaultRT ? " (default)" : ""),
  }));

  const handleTimeRangeChange = useCallback((val) => {
    const newDefault = getDefaultRefreshTime(val);
    setTimeRangeSec(val);
    setRefreshTime(newDefault);
    setCurrentEvent(0);
    setFiredEvents([]);
    setPlaying(false);
  }, []);

  const handleRefreshTimeChange = useCallback((val) => {
    setRefreshTime(val);
    setCurrentEvent(0);
    setFiredEvents([]);
    setPlaying(false);
  }, []);

  const step = useCallback(
    (dir) => {
      setCurrentEvent((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= numTransitions) return prev;
        if (!firedEvents.includes(next)) {
          setFiredEvents((fe) => [...fe, next]);
        }
        return next;
      });
    },
    [numTransitions, firedEvents]
  );

  useEffect(() => {
    if (playing) {
      playTimerRef.current = setInterval(() => {
        setCurrentEvent((prev) => {
          if (prev >= numTransitions - 1) {
            setPlaying(false);
            return prev;
          }
          const next = prev + 1;
          setFiredEvents((fe) => (fe.includes(next) ? fe : [...fe, next]));
          return next;
        });
      }, 450);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [playing, numTransitions]);

  useEffect(() => {
    setPlaying(false);
  }, [timeRangeSec, refreshTime]);

  const fired = firedEvents.filter((e) => e <= currentEvent).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="w-[80%] mx-auto py-8">
      {/* Header */}
      <div className="border-b border-slate-700 pb-5 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Live simulation
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Premerger Producer Loop
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          How <code className="text-violet-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">SimpleAggProducerThread</code> decides when to send a request to the Merger — bucket boundary transitions, not a per-life timer.
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          id="tr-select"
          label="Time range"
          value={timeRangeSec}
          onChange={handleTimeRangeChange}
          options={TIME_RANGES}
        />
        <Select
          id="rt-select"
          label="Refresh time"
          value={refreshTime}
          onChange={handleRefreshTimeChange}
          options={refreshTimeOptions}
        />
      </div>

      {/* Derived info */}
      <div className="mb-5">
        <DerivedInfo
          timeRangeSec={timeRangeSec}
          refreshTime={refreshTime}
          defaultRT={defaultRT}
        />
      </div>

      {/* Accuracy note */}
      <div className="bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-300 mb-6 leading-relaxed">
        Every bucket transition shown is real and exact — nothing sampled or approximated.
        Idle gaps between transitions are compressed into one labeled cell because every tick
        inside is provably identical:{" "}
        <code className="bg-blue-900/50 px-1 rounded">bucket(now, refresh_time)</code> cannot
        change until <code className="bg-blue-900/50 px-1 rounded">refresh_time</code> seconds
        have elapsed. Only valid factors of{" "}
        <code className="bg-blue-900/50 px-1 rounded">time_range_seconds</code> appear in the
        refresh time selector.
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mb-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/20 flex-shrink-0" />
          Bucket transition — fires
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-dashed border-slate-600 flex-shrink-0" />
          Idle gap — all ticks skip
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-violet-500 bg-violet-600/40 flex-shrink-0" />
          Merger receives request
        </div>
      </div>

      {/* Producer loop track */}
      <div className="mb-5">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
          Producer loop — bucket transitions across one complete cycle
        </div>
        <div className="text-xs text-slate-600 mb-3">
          Showing all {numTransitions} real bucket transitions — nothing sampled
        </div>
        <div
          id="loop-track"
          className="flex flex-wrap gap-2 items-start"
        >
          {Array.from({ length: numTransitions }, (_, e) => {
            const isFuture = e > currentEvent;
            return (
              <div key={e} className="flex items-center gap-2">
                {e > 0 && (
                  <IdleGap ticksPerBucket={ticksPerBucket} isFuture={isFuture} />
                )}
                <div data-bucket-event>
                  <BucketEvent
                    index={e}
                    fireAt={e * refreshTime}
                    isFuture={isFuture}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merger bar */}
      <div className="mb-6">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
          Merger — receives request only at each bucket transition
        </div>
        <MergerBar
          currentEvent={currentEvent}
          numTransitions={numTransitions}
          refreshTime={refreshTime}
          ticksPerBucket={ticksPerBucket}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <StatBox label="elapsed_time" value={fmtSec(currentEvent * refreshTime)} />
        <StatBox label="refresh_time" value={`${refreshTime}s`} />
        <StatBox label="current_bucket" value={`#${currentEvent}`} />
        <StatBox label="requests_fired" value={fired} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => step(-1)}
          disabled={currentEvent === 0}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← prev event
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-5 py-2.5 rounded-lg text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white border border-violet-400 transition-colors"
        >
          {playing ? "pause ❙❙" : "play ▶"}
        </button>
        <button
          onClick={() => step(1)}
          disabled={currentEvent >= numTransitions - 1}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          next event →
        </button>
      </div>

      {/* Caption */}
      <p className="text-xs text-slate-600 text-center leading-relaxed mb-8">
        One complete cycle = the alert rule's full{" "}
        <code className="text-slate-500">time_range_seconds</code>, at the real producer
        poll rate of 200ms (
        <code className="text-slate-500">Thread.sleep(200)</code> in{" "}
        <code className="text-slate-500">SimpleAggProducerThread.java</code>). The refresh
        time selector only offers values that are exact factors of{" "}
        <code className="text-slate-500">time_range_seconds</code>.
      </p>

      <div className="border-t border-slate-800 pt-8">
        <GlossaryTable />
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-700 font-mono">
        LogPoint Alert Engine — Premerger Producer Loop Simulation · Based on{" "}
        SimpleAggProducerThread.java, livesearch.py, alert.py, analyzer.py · June 2026
      </div>
      </div>
    </div>
  );
}