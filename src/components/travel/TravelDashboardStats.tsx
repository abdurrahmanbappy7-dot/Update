import { motion } from 'framer-motion';
import { Compass, CheckCircle2, MapPinOff, TrendingUp, Sparkles, Flag } from 'lucide-react';

interface DivisionStat {
  name: string;
  bnName: string;
  visited: number;
  total: number;
  percentage: number;
}

interface StatsProps {
  stats: {
    total: number;
    visited: number;
    remaining: number;
    percentage: number;
    divisionStats: DivisionStat[];
  };
  onFilterDivision?: (divisionName: string | null) => void;
  selectedDivision?: string | null;
}

export function TravelDashboardStats({ stats, onFilterDivision, selectedDivision }: StatsProps) {
  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Districts */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E1312] p-4 transition-all duration-300 hover:border-white/20 sm:p-5">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">Total Districts</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.06] text-white/80">
              <Compass size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white sm:text-4xl">{stats.total}</span>
            <span className="font-mono text-xs text-white/40">Zillas</span>
          </div>
          <p className="mt-1 text-[11.5px] text-white/50">Across all 8 administrative divisions</p>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/[0.02] blur-xl" />
        </div>

        {/* Visited Districts */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0A1612] p-4 shadow-[0_0_25px_-5px_rgba(0,255,136,0.15)] transition-all duration-300 hover:border-emerald-500/50 sm:p-5">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">Visited Districts</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.3)]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <motion.span
              key={stats.visited}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-3xl font-extrabold text-[#00FF88] sm:text-4xl"
            >
              {stats.visited}
            </motion.span>
            <span className="font-mono text-xs text-emerald-400/70">Explored</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-emerald-400/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            <span>Active footprint across Bangladesh</span>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl" />
        </div>

        {/* Remaining to Explore */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E1312] p-4 transition-all duration-300 hover:border-white/20 sm:p-5">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">Remaining</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.06] text-white/70">
              <MapPinOff size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <motion.span
              key={stats.remaining}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-3xl font-extrabold text-white sm:text-4xl"
            >
              {stats.remaining}
            </motion.span>
            <span className="font-mono text-xs text-white/40">Districts Left</span>
          </div>
          <p className="mt-1 text-[11.5px] text-white/50">Upcoming journeys & adventures</p>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/[0.02] blur-xl" />
        </div>

        {/* Exploration Progress */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-[#16110B] p-4 shadow-[0_0_25px_-5px_rgba(255,122,41,0.15)] transition-all duration-300 hover:border-orange-500/50 sm:p-5">
          <div className="flex items-center justify-between text-orange-400">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">Travel Progress</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-orange-500/30 bg-orange-500/20 text-[#FF8C38] shadow-[0_0_12px_rgba(255,140,56,0.3)]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <motion.span
              key={stats.percentage}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-3xl font-extrabold text-[#FF8C38] sm:text-4xl"
            >
              {stats.percentage}%
            </motion.span>
            <span className="font-mono text-xs text-orange-400/70">Completed</span>
          </div>
          {/* Linear mini progress bar */}
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#00FF88] via-[#FF8C38] to-[#FF5E00]"
            />
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-orange-500/10 blur-xl" />
        </div>
      </div>

      {/* Division-wise Exploration Breakdown Grid */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E1312] p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-[#FF8C38]" />
            <h3 className="font-display text-base font-semibold text-white">
              Division Breakdown
            </h3>
            <span className="font-mono text-xs text-white/40">• 8 Divisions</span>
          </div>
          {selectedDivision && (
            <button
              type="button"
              onClick={() => onFilterDivision?.(null)}
              className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20"
            >
              Reset Division Filter: {selectedDivision} ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.divisionStats.map((div) => {
            const isFull = div.visited === div.total && div.total > 0;
            const isSelected = selectedDivision?.toLowerCase() === div.name.toLowerCase();

            return (
              <button
                key={div.name}
                type="button"
                onClick={() => onFilterDivision?.(isSelected ? null : div.name)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500/60 bg-orange-500/10 shadow-[0_0_15px_rgba(255,140,56,0.15)]'
                    : isFull
                      ? 'border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/50'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="font-display text-sm font-semibold text-white transition group-hover:text-emerald-400">
                      {div.name}
                    </span>
                    <span className="block font-sans text-xs text-white/50">
                      {div.bnName}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      isFull
                        ? 'border border-emerald-500/40 bg-emerald-500/20 text-[#00FF88]'
                        : div.visited > 0
                          ? 'border border-orange-500/30 bg-orange-500/15 text-orange-400'
                          : 'border border-white/10 bg-white/5 text-white/40'
                    }`}
                  >
                    {div.percentage}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11.5px] text-white/60">
                    <span>
                      {div.visited} / {div.total} Districts
                    </span>
                    {isFull && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[#00FF88]">
                        <Sparkles size={11} /> 100% Explored
                      </span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${div.percentage}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${
                        isFull
                          ? 'bg-[#00FF88] shadow-[0_0_8px_#00FF88]'
                          : div.visited > 0
                            ? 'bg-[#FF8C38]'
                            : 'bg-white/20'
                      }`}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
