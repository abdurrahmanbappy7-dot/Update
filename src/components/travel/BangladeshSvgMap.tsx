import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Eye, Compass, Sparkles } from 'lucide-react';
import { useState, useRef, useMemo, type MouseEvent } from 'react';
import type { DistrictData, DistrictMemory } from '../../data/travelMapData';

interface DistrictWithMemory extends DistrictData {
  memory: DistrictMemory;
}

interface Props {
  districts: DistrictWithMemory[];
  selectedDistrictId: string | null;
  onSelectDistrict: (district: DistrictWithMemory) => void;
  onToggleVisited: (id: string) => void;
}

export function BangladeshSvgMap({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  onToggleVisited: _onToggleVisited,
}: Props) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictWithMemory | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [labelFilter, setLabelFilter] = useState<'visited' | 'all' | 'none'>('visited');
  const containerRef = useRef<HTMLDivElement>(null);

  // Map SVG dimensions (as computed during projection)
  const viewBoxWidth = 800;
  const viewBoxHeight = 980;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.35, 3));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.35, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Group visited count
  const visitedCount = useMemo(() => districts.filter((d) => d.memory.visited).length, [districts]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0B0F0E] p-4 shadow-[0_0_50px_-12px_rgba(0,255,136,0.12)] md:p-8">
      {/* Subtle ambient neon glow & grid backdrop */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#00FF88]/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#FF7A29]/10 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden
      />

      {/* Map Header Toolbar */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.25)]">
            <Compass size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
                Bangladesh Travel Atlas
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#00FF88]">
                {visitedCount}/64 Explored
              </span>
            </div>
            <p className="text-xs text-white/50">
              Hover over any district to inspect • Click to view or edit memories & photos
            </p>
          </div>
        </div>

        {/* Controls: Labels toggle & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Label selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs">
            <span className="flex items-center gap-1 px-2 text-[11px] font-mono text-white/50">
              <Eye size={12} /> Labels:
            </span>
            <button
              type="button"
              onClick={() => setLabelFilter('visited')}
              className={`rounded-lg px-2.5 py-1 transition ${
                labelFilter === 'visited'
                  ? 'bg-emerald-500/25 font-medium text-[#00FF88] shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Visited
            </button>
            <button
              type="button"
              onClick={() => setLabelFilter('all')}
              className={`rounded-lg px-2.5 py-1 transition ${
                labelFilter === 'all'
                  ? 'bg-emerald-500/25 font-medium text-[#00FF88] shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setLabelFilter('none')}
              className={`rounded-lg px-2.5 py-1 transition ${
                labelFilter === 'none'
                  ? 'bg-white/15 font-medium text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Off
            </button>
          </div>

          {/* Zoom buttons */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Reset map zoom"
              title="Reset View"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsPanning(false);
          setHoveredDistrict(null);
        }}
        className={`relative mx-auto flex aspect-[800/980] max-h-[820px] w-full max-w-[700px] select-none items-center justify-center overflow-hidden rounded-2xl ${
          zoom > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="h-full w-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Glow filters for neon green visited districts */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00FF88" floodOpacity="0.45" />
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#00FF88" floodOpacity="0.25" />
            </filter>

            <filter id="selected-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FF7A29" floodOpacity="0.75" />
            </filter>

            {/* Pattern for visited districts */}
            <linearGradient id="visitedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#05B35F" stopOpacity="0.9" />
            </linearGradient>

            {/* Linear gradient for unvisited districts */}
            <linearGradient id="unvisitedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222933" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#15191F" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* District Polygons */}
          <g className="districts-layer">
            {districts.map((district) => {
              const isVisited = district.memory.visited;
              const isHovered = hoveredDistrict?.id === district.id;
              const isSelected = selectedDistrictId === district.id;

              let fillColor = isVisited ? 'url(#visitedGrad)' : 'url(#unvisitedGrad)';
              if (isSelected) {
                fillColor = '#FF8C38';
              } else if (isHovered) {
                fillColor = isVisited ? '#22FFA0' : '#333D4B';
              }

              const strokeColor = isSelected
                ? '#FFA050'
                : isVisited
                  ? '#00FFA3'
                  : isHovered
                    ? '#4E5A6B'
                    : '#2D3540';

              const strokeWidth = isSelected ? 2.5 : isHovered ? 2 : isVisited ? 1.4 : 0.9;

              return (
                <path
                  key={district.id}
                  id={`district-${district.id}`}
                  d={district.path}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? 'url(#selected-glow)' : isVisited ? 'url(#neon-glow)' : undefined}
                  className="cursor-pointer transition-colors duration-200"
                  onMouseEnter={() => setHoveredDistrict(district)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDistrict(district);
                  }}
                />
              );
            })}
          </g>

          {/* District Pins & Labels Layer */}
          <g className="labels-layer pointer-events-none">
            {districts.map((district) => {
              const isVisited = district.memory.visited;
              const isHovered = hoveredDistrict?.id === district.id;
              const isSelected = selectedDistrictId === district.id;

              const shouldShowLabel =
                labelFilter === 'all' ||
                (labelFilter === 'visited' && isVisited) ||
                isHovered ||
                isSelected;

              if (!shouldShowLabel || district.cx === 0 || district.cy === 0) return null;

              return (
                <g
                  key={`pin-${district.id}`}
                  transform={`translate(${district.cx}, ${district.cy})`}
                  className="transition-transform duration-200"
                >
                  {/* Outer pulsating ring for visited pins */}
                  {isVisited && (
                    <circle
                      r={isHovered ? 8 : 5}
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="1.2"
                      opacity="0.8"
                      className="animate-ping"
                      style={{ animationDuration: '3s' }}
                    />
                  )}

                  {/* Pin Core Dot */}
                  <circle
                    r={isSelected ? 5.5 : isHovered ? 4.5 : isVisited ? 3.5 : 2.5}
                    fill={isSelected ? '#FF8C38' : isVisited ? '#FFFFFF' : '#8894A6'}
                    stroke={isSelected ? '#FFFFFF' : isVisited ? '#006633' : '#15191F'}
                    strokeWidth={isVisited ? 1.4 : 0.8}
                  />

                  {/* Bengali label text matching reference image style */}
                  {(isVisited || isHovered || isSelected) && (
                    <text
                      y={-6}
                      textAnchor="middle"
                      className="font-sans font-medium"
                      fontSize={isHovered || isSelected ? '11px' : '9.5px'}
                      fill={isSelected ? '#FFA050' : isVisited ? '#FFFFFF' : '#CBD5E1'}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#08090D',
                        strokeWidth: '3px',
                        strokeLinejoin: 'round',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {district.bnName}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip following mouse position */}
        <AnimatePresence>
          {hoveredDistrict && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              style={{
                left: Math.min(Math.max(mousePos.x + 16, 12), (containerRef.current?.clientWidth || 400) - 260),
                top: Math.min(Math.max(mousePos.y - 120, 12), (containerRef.current?.clientHeight || 600) - 150),
              }}
              className="pointer-events-none absolute z-30 w-64 rounded-2xl border border-white/15 bg-[#0e1312]/95 p-3.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    {hoveredDistrict.name}
                  </h4>
                  <p className="font-sans text-sm font-medium text-[#00FF88]">
                    {hoveredDistrict.bnName}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    hoveredDistrict.memory.visited
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-[#00FF88]'
                      : 'border border-white/10 bg-white/5 text-white/50'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hoveredDistrict.memory.visited ? 'bg-[#00FF88] shadow-[0_0_8px_#00FF88]' : 'bg-white/30'
                    }`}
                  />
                  {hoveredDistrict.memory.visited ? 'Visited' : 'Unvisited'}
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5 border-t border-white/[0.08] pt-2 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Division:</span>
                  <span className="font-medium text-white/90">{hoveredDistrict.division}</span>
                </div>

                {hoveredDistrict.memory.visited && hoveredDistrict.memory.visitDate && (
                  <div className="flex items-center justify-between text-white/60">
                    <span>Visited Date:</span>
                    <span className="font-medium text-[#FF8C38]">{hoveredDistrict.memory.visitDate}</span>
                  </div>
                )}

                {hoveredDistrict.memory.photos.length > 0 && (
                  <div className="flex items-center justify-between text-white/60">
                    <span>Photos:</span>
                    <span className="font-mono text-emerald-400">{hoveredDistrict.memory.photos.length} captured</span>
                  </div>
                )}

                {hoveredDistrict.highlights.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10.5px] text-white/40">Key Spots:</span>
                    <p className="line-clamp-1 text-[11px] text-white/80">
                      {hoveredDistrict.highlights.slice(0, 2).join(' • ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-1 text-[11px] font-medium text-emerald-400">
                <Sparkles size={12} /> Click to open travel details & memories
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Legend Footer */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full border border-emerald-400 bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
            <span className="font-medium text-white">Visited Districts ({visitedCount})</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full border border-white/20 bg-[#1D242E]" />
            <span className="text-white/60">Not Visited Yet ({districts.length - visitedCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <MapPin size={13} className="text-[#00FF88]" />
          <span>Interactive SVG • Precise district boundaries based on BBS Survey</span>
        </div>
      </div>
    </div>
  );
}
