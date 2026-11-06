import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Calendar,
  Camera,
  CheckCircle2,
  Trash2,
  Sparkles,
  BookOpen,
  StickyNote,
  Maximize2,
  Plus,
} from 'lucide-react';
import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import type { DistrictData, DistrictMemory, TravelPhoto } from '../../data/travelMapData';

interface DistrictWithMemory extends DistrictData {
  memory: DistrictMemory;
}

interface Props {
  district: DistrictWithMemory | null;
  onClose: () => void;
  onToggleVisited: (districtId: string) => void;
  onUpdateMemory: (districtId: string, updates: Partial<DistrictMemory>) => void;
  onAddPhoto: (districtId: string, photo: Omit<TravelPhoto, 'id' | 'uploadedAt'>) => void;
  onRemovePhoto: (districtId: string, photoId: string) => void;
}

export function DistrictDetailModal({
  district,
  onClose,
  onToggleVisited,
  onUpdateMemory,
  onAddPhoto,
  onRemovePhoto,
}: Props) {
  const [activeTab, setActiveTab] = useState<'story' | 'photos' | 'notes'>('story');
  const [storyText, setStoryText] = useState('');
  const [dateText, setDateText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<TravelPhoto | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync inputs with district data when district opens or changes
  useEffect(() => {
    if (district) {
      setStoryText(district.memory.story || '');
      setDateText(district.memory.visitDate || '');
      setNotesText(district.memory.notes || '');
      setActiveTab('story');
    }
  }, [district?.id]);

  // Handle ESC key
  useEffect(() => {
    if (!district) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxPhoto) {
          setLightboxPhoto(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [district, lightboxPhoto, onClose]);

  if (!district) return null;

  const handleSave = () => {
    onUpdateMemory(district.id, {
      story: storyText,
      visitDate: dateText,
      notes: notesText,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onAddPhoto(district.id, {
          url: result,
          caption: `${district.name} Memory`,
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isVisited = district.memory.visited;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0C1110] shadow-[0_0_60px_rgba(0,0,0,0.8)] text-white"
        >
          {/* Header */}
          <div className="relative border-b border-white/[0.08] bg-gradient-to-r from-emerald-950/40 via-[#0C1110] to-orange-950/20 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-white/60">
                <MapPin size={11} className="text-[#00FF88]" />
                {district.division} Division • {district.divisionBn}
              </span>

              {isVisited ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                  VISITED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  NOT VISITED YET
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {district.name}
              </h3>
              <span className="font-sans text-xl font-medium text-[#00FF88]">
                {district.bnName}
              </span>
            </div>

            {/* Quick Status Toggle Button */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-black/40 p-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-white/60">Travel Status:</span>
                <span className={`text-xs font-semibold ${isVisited ? 'text-[#00FF88]' : 'text-white/40'}`}>
                  {isVisited ? 'Explored & Added to Map' : 'Unvisited (Waiting for next adventure)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onToggleVisited(district.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isVisited
                    ? 'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'border border-emerald-500/50 bg-[#00FF88] text-black hover:bg-[#22FFA0] shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                }`}
              >
                <CheckCircle2 size={14} />
                {isVisited ? 'Mark as Not Visited' : 'Mark as Visited'}
              </button>
            </div>
          </div>

          {/* District Highlights Pill Strip */}
          {district.highlights.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.06] bg-white/[0.015] px-6 py-2.5 text-xs">
              <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#FF8C38]">
                <Sparkles size={11} /> Highlights:
              </span>
              {district.highlights.map((h, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-white/80"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/[0.08] px-6">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition ${
                activeTab === 'story'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              Travel Story & Visit Date
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition ${
                activeTab === 'photos'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Camera size={14} />
              Memories & Photos ({district.memory.photos.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition ${
                activeTab === 'notes'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <StickyNote size={14} />
              Personal Notes
            </button>
          </div>

          {/* Modal Body / Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 text-sm">
            {/* Story & Date Tab */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <Calendar size={13} className="text-[#FF8C38]" />
                    Date / Time of Visit
                  </label>
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    placeholder="e.g. Dec 2023, Summer 2024, or exact date"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#00FF88] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <BookOpen size={13} className="text-[#00FF88]" />
                    Travel Story & Experience
                  </label>
                  <textarea
                    rows={5}
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Describe your journey, unforgettable moments, people met, food enjoyed..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white placeholder-white/30 focus:border-[#00FF88] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Photos & Gallery Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Captured Photos ({district.memory.photos.length})
                    </h4>
                    <p className="text-xs text-white/40">Upload personal photos from your trip</p>
                  </div>

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="travel-photo-upload"
                    />
                    <label
                      htmlFor="travel-photo-upload"
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-[#00FF88] transition hover:bg-emerald-500/30"
                    >
                      <Plus size={14} /> Add Photos
                    </label>
                  </div>
                </div>

                {district.memory.photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                    <Camera size={32} className="text-white/20" />
                    <p className="mt-2 text-sm text-white/50">No photos added yet</p>
                    <p className="mt-1 text-xs text-white/30">
                      Click the button above to upload your travel memories from {district.name}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {district.memory.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-xs transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setLightboxPhoto(photo)}
                            aria-label="View photo fullscreen"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white hover:bg-white/40"
                          >
                            <Maximize2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemovePhoto(district.id, photo.id)}
                            aria-label="Delete photo"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <StickyNote size={13} className="text-[#FF8C38]" />
                    Local Recommendations & Personal Tips
                  </label>
                  <textarea
                    rows={6}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Food to try (e.g. Bogura Doi, Natore Kachagolla), transport tips, best photography timing, hotel advice..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white placeholder-white/30 focus:border-[#00FF88] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.08] bg-black/30 px-6 py-4">
            <div className="flex items-center gap-2 text-xs">
              {isSavedNotice && (
                <span className="flex items-center gap-1 text-[#00FF88]">
                  <CheckCircle2 size={14} /> Saved to Local Storage!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-[#00FF88] px-5 py-2 text-xs font-bold text-black transition hover:bg-[#22FFA0] shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              >
                Save Memories
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lightbox Image Preview */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              onClick={() => setLightboxPhoto(null)}
            >
              <X size={20} />
            </button>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
