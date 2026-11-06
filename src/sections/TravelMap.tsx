import { useState } from 'react';
import { RotateCcw, Download, Upload, MapPin, Sparkles } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { BangladeshSvgMap } from '../components/travel/BangladeshSvgMap';
import { TravelDashboardStats } from '../components/travel/TravelDashboardStats';
import { DistrictListTabs } from '../components/travel/DistrictListTabs';
import { DistrictDetailModal } from '../components/travel/DistrictDetailModal';
import { useTravelData } from '../hooks/useTravelData';
import type { DistrictData, DistrictMemory } from '../data/travelMapData';

interface DistrictWithMemory extends DistrictData {
  memory: DistrictMemory;
}

export function TravelMap() {
  const {
    districts,
    state,
    stats,
    toggleVisited,
    updateMemory,
    addPhoto,
    removePhoto,
    resetToReference,
  } = useTravelData();

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictWithMemory | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Sync selected district with live memory
  const liveSelectedDistrict = selectedDistrict
    ? districts.find((d) => d.id === selectedDistrict.id) || selectedDistrict
    : null;

  // Export JSON backup
  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bappy_travel_journal_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJournal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed.memories === 'object') {
          localStorage.setItem('bappy_travel_map_state_v2', JSON.stringify(parsed));
          window.location.reload();
        } else {
          alert('Invalid travel journal backup file.');
        }
      } catch (err) {
        alert('Could not parse the uploaded file. Please make sure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section id="travel" className="relative overflow-hidden bg-[#080B0A] py-28 md:py-36">
      {/* Background radial gradient lights */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,136,0.08),transparent_70%)]"
        aria-hidden
      />

      <div className="shell relative z-10 space-y-16 md:space-y-20">
        {/* Section Header */}
        <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="text-[#00FF88]">08</span>
              <span className="h-px w-8 bg-[#00FF88]/50" aria-hidden />
              <span className="text-[#00FF88]">PERSONAL EXPEDITION</span>
            </p>

            <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight text-white">
              MY TRAVEL MAP <span className="inline-block" role="img" aria-label="Bangladesh flag">🇧🇩</span>
              <br />
              <span className="bg-gradient-to-r from-white via-[#00FF88] to-[#FF8C38] bg-clip-text text-transparent">
                Exploring Bangladesh, One District at a Time.
              </span>
            </h2>
          </div>

          <div className="space-y-4 md:col-span-4">
            <p className="text-[15.5px] leading-relaxed text-white/70">
              An interactive visual atlas tracking every district visited across Bangladesh. Follow my journey
              through historic monuments, river estuaries, lush tea estates, hill ranges, and coastal sunsets.
            </p>

            {/* Quick backup & reset bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                title="Restore default 33 visited districts from reference map"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <RotateCcw size={12} /> Reset to Reference (33)
              </button>

              <button
                type="button"
                onClick={handleExportJournal}
                title="Download backup file of your travel stories and memories"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <Download size={12} /> Export Journal
              </button>

              <label
                htmlFor="import-journal-file"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <Upload size={12} /> Import
                <input
                  id="import-journal-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportJournal}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </Reveal>

        {/* Confirmation Modal for Reset */}
        {confirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
            <div className="max-w-md rounded-2xl border border-white/20 bg-[#0E1312] p-6 text-white shadow-2xl">
              <h4 className="font-display text-lg font-bold">Reset to Reference Map?</h4>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                This will reset the visited districts to the exact 33 districts and 52% exploration progress
                indicated in your primary reference map. Any custom uploaded photos for unvisited districts will be cleared.
              </p>
              <div className="mt-5 flex justify-end gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 font-medium text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetToReference();
                    setConfirmReset(false);
                  }}
                  className="rounded-xl bg-[#00FF88] px-4 py-2 font-bold text-black hover:bg-[#22FFA0]"
                >
                  Yes, Reset to Reference
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Travel Dashboard Stats Metrics */}
        <Reveal delay={0.1}>
          <TravelDashboardStats
            stats={stats}
            selectedDivision={selectedDivision}
            onFilterDivision={setSelectedDivision}
          />
        </Reveal>

        {/* Interactive Map Centerpiece */}
        <Reveal delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                <MapPin size={14} className="text-[#00FF88]" />
                <span className="uppercase tracking-wider">Geographic Map Representation</span>
              </div>
              <span className="flex items-center gap-1 font-mono text-[11px] text-[#00FF88]">
                <Sparkles size={12} /> Neon Green: Visited • Dark Gray: Unvisited
              </span>
            </div>

            <BangladeshSvgMap
              districts={districts}
              selectedDistrictId={liveSelectedDistrict?.id || null}
              onSelectDistrict={(district) => setSelectedDistrict(district)}
              onToggleVisited={toggleVisited}
            />
          </div>
        </Reveal>

        {/* 3 Tabs: Visited Districts, Not Visited Yet, All 64 Districts */}
        <Reveal delay={0.3}>
          <DistrictListTabs
            districts={districts}
            selectedDivision={selectedDivision}
            onSelectDivision={setSelectedDivision}
            onSelectDistrict={(district) => setSelectedDistrict(district)}
            onToggleVisited={toggleVisited}
          />
        </Reveal>
      </div>

      {/* District Detail Modal */}
      {liveSelectedDistrict && (
        <DistrictDetailModal
          district={liveSelectedDistrict}
          onClose={() => setSelectedDistrict(null)}
          onToggleVisited={toggleVisited}
          onUpdateMemory={updateMemory}
          onAddPhoto={addPhoto}
          onRemovePhoto={removePhoto}
        />
      )}
    </section>
  );
}
