import { useState, useMemo } from 'react';
import { Search, CheckCircle2, Circle, Camera, Calendar, MapPin, Eye } from 'lucide-react';
import type { DistrictData, DistrictMemory } from '../../data/travelMapData';

interface DistrictWithMemory extends DistrictData {
  memory: DistrictMemory;
}

interface Props {
  districts: DistrictWithMemory[];
  onSelectDistrict: (district: DistrictWithMemory) => void;
  onToggleVisited: (districtId: string) => void;
  selectedDivision: string | null;
  onSelectDivision: (division: string | null) => void;
}

export function DistrictListTabs({
  districts,
  onSelectDistrict,
  onToggleVisited,
  selectedDivision,
  onSelectDivision,
}: Props) {
  const [activeTab, setActiveTab] = useState<'visited' | 'unvisited' | 'all'>('visited');
  const [searchQuery, setSearchQuery] = useState('');

  const divisions = [
    'All Divisions',
    'Barishal',
    'Chattogram',
    'Dhaka',
    'Khulna',
    'Rajshahi',
    'Rangpur',
    'Sylhet',
    'Mymensingh',
  ];

  // Filter districts based on tab, search, and division
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      // Tab filter
      if (activeTab === 'visited' && !d.memory.visited) return false;
      if (activeTab === 'unvisited' && d.memory.visited) return false;

      // Division filter
      if (selectedDivision && d.division.toLowerCase() !== selectedDivision.toLowerCase()) {
        return false;
      }

      // Search query filter (matches English name, Bangla name, division)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesBn = d.bnName.includes(q);
        const matchesDiv = d.division.toLowerCase().includes(q);
        const matchesHighlights = d.highlights.some((h) => h.toLowerCase().includes(q));
        if (!matchesName && !matchesBn && !matchesDiv && !matchesHighlights) return false;
      }

      return true;
    });
  }, [districts, activeTab, selectedDivision, searchQuery]);

  const visitedCount = districts.filter((d) => d.memory.visited).length;
  const unvisitedCount = districts.length - visitedCount;

  return (
    <div className="space-y-6">
      {/* 3 Main Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0E1312] p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('visited')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'visited'
                ? 'border border-emerald-500/50 bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <CheckCircle2 size={15} />
            Visited Districts
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                activeTab === 'visited' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {visitedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unvisited')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'unvisited'
                ? 'border border-orange-500/50 bg-[#FF8C38] text-black shadow-[0_0_15px_rgba(255,140,56,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Circle size={15} />
            Not Visited Yet
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                activeTab === 'unvisited' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {unvisitedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'border border-white/30 bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All 64 Districts
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'
              }`}
            >
              64
            </span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district (e.g. Cox's Bazar, ঢাকা, Sajek)..."
            className="w-full rounded-xl border border-white/10 bg-[#0E1312] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#00FF88] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Division filter pill bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="mr-1 flex items-center gap-1 font-mono text-[11px] text-white/40">
          <MapPin size={12} /> Division:
        </span>
        {divisions.map((div) => {
          const isAll = div === 'All Divisions';
          const isSelected = isAll ? selectedDivision === null : selectedDivision === div;
          return (
            <button
              key={div}
              type="button"
              onClick={() => onSelectDivision(isAll ? null : div)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition ${
                isSelected
                  ? 'border border-white/25 bg-white/15 text-white shadow-xs'
                  : 'border border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {div}
            </button>
          );
        })}
      </div>

      {/* District Cards Grid */}
      {filteredDistricts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1312] p-12 text-center text-white/50">
          <p className="text-sm">No districts matched your search criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectDivision(null);
            }}
            className="mt-3 text-xs text-[#00FF88] hover:underline"
          >
            Clear filters & search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDistricts.map((district) => {
            const isVisited = district.memory.visited;

            return (
              <div
                key={district.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                  isVisited
                    ? 'border-emerald-500/25 bg-[#0C1412] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.12)]'
                    : 'border-white/[0.08] bg-[#0E1312] hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-white/50">
                      {district.division} Division
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        isVisited
                          ? 'border border-emerald-500/40 bg-emerald-500/20 text-[#00FF88]'
                          : 'border border-white/10 bg-white/5 text-white/40'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isVisited ? 'bg-[#00FF88] shadow-[0_0_6px_#00FF88]' : 'bg-white/30'
                        }`}
                      />
                      {isVisited ? 'Visited' : 'To Explore'}
                    </span>
                  </div>

                  {/* District Titles */}
                  <div className="mt-2.5">
                    <h4 className="font-display text-lg font-bold text-white transition group-hover:text-emerald-400">
                      {district.name}
                    </h4>
                    <p className="font-sans text-sm font-medium text-emerald-400/90">
                      {district.bnName}
                    </p>
                  </div>

                  {/* Highlights tags */}
                  {district.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {district.highlights.slice(0, 3).map((h, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/70"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visit info preview if visited */}
                  {isVisited && (
                    <div className="mt-4 space-y-1 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3 text-xs text-white/70">
                      {district.memory.visitDate && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#FF8C38]">
                          <Calendar size={12} />
                          <span>Visited: {district.memory.visitDate}</span>
                        </div>
                      )}
                      {district.memory.story && (
                        <p className="line-clamp-2 text-[11.5px] leading-relaxed text-white/80">
                          {district.memory.story}
                        </p>
                      )}
                      {district.memory.photos.length > 0 && (
                        <div className="flex items-center gap-1 pt-1 font-mono text-[10.5px] text-[#00FF88]">
                          <Camera size={11} />
                          <span>{district.memory.photos.length} photos uploaded</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleVisited(district.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium transition ${
                      isVisited
                        ? 'text-white/50 hover:text-red-400'
                        : 'text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {isVisited ? 'Mark Unvisited' : '+ Mark Visited'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDistrict(district)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-1.5 font-medium text-white transition hover:border-[#00FF88]/50 hover:bg-[#00FF88]/10 hover:text-[#00FF88]"
                  >
                    <Eye size={13} />
                    <span>{isVisited ? 'View Story' : 'Details'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
