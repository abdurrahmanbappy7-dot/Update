import { useEffect, useState } from 'react';
import { BANGLADESH_DISTRICTS, type DistrictData, type DistrictMemory, type TravelPhoto } from '../data/travelMapData';

const STORAGE_KEY = 'bappy_travel_map_state_v2';

export interface TravelState {
  // district id -> memory
  memories: Record<string, DistrictMemory>;
}

function getInitialState(): TravelState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.memories === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load travel state from localStorage', err);
  }

  // default from BANGLADESH_DISTRICTS (33 visited, 31 unvisited)
  const defaultMemories: Record<string, DistrictMemory> = {};
  BANGLADESH_DISTRICTS.forEach((d) => {
    defaultMemories[d.id] = { ...d.initialMemory };
  });

  return { memories: defaultMemories };
}

export function useTravelData() {
  const [state, setState] = useState<TravelState>(getInitialState);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save travel state to localStorage', err);
    }
  }, [state]);

  const toggleVisited = (districtId: string) => {
    setState((prev) => {
      const current = prev.memories[districtId] || {
        visited: false,
        visitDate: '',
        story: '',
        notes: '',
        photos: [],
      };
      const nextVisited = !current.visited;
      return {
        ...prev,
        memories: {
          ...prev.memories,
          [districtId]: {
            ...current,
            visited: nextVisited,
            visitDate: nextVisited && !current.visitDate ? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : current.visitDate,
          },
        },
      };
    });
  };

  const updateMemory = (districtId: string, updates: Partial<DistrictMemory>) => {
    setState((prev) => {
      const current = prev.memories[districtId] || {
        visited: false,
        visitDate: '',
        story: '',
        notes: '',
        photos: [],
      };
      return {
        ...prev,
        memories: {
          ...prev.memories,
          [districtId]: {
            ...current,
            ...updates,
          },
        },
      };
    });
  };

  const addPhoto = (districtId: string, photo: Omit<TravelPhoto, 'id' | 'uploadedAt'>) => {
    const newPhoto: TravelPhoto = {
      ...photo,
      id: 'photo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      uploadedAt: new Date().toISOString(),
    };

    setState((prev) => {
      const current = prev.memories[districtId] || {
        visited: true,
        visitDate: '',
        story: '',
        notes: '',
        photos: [],
      };
      return {
        ...prev,
        memories: {
          ...prev.memories,
          [districtId]: {
            ...current,
            visited: true,
            photos: [newPhoto, ...current.photos],
          },
        },
      };
    });
  };

  const removePhoto = (districtId: string, photoId: string) => {
    setState((prev) => {
      const current = prev.memories[districtId];
      if (!current) return prev;
      return {
        ...prev,
        memories: {
          ...prev.memories,
          [districtId]: {
            ...current,
            photos: current.photos.filter((p) => p.id !== photoId),
          },
        },
      };
    });
  };

  const resetToReference = () => {
    const defaultMemories: Record<string, DistrictMemory> = {};
    BANGLADESH_DISTRICTS.forEach((d) => {
      defaultMemories[d.id] = { ...d.initialMemory };
    });
    setState({ memories: defaultMemories });
  };

  // Merge districts data with dynamic memories
  const districts: (DistrictData & { memory: DistrictMemory })[] = BANGLADESH_DISTRICTS.map((d) => {
    const memory = state.memories[d.id] || d.initialMemory;
    return {
      ...d,
      memory,
    };
  });

  const totalDistricts = districts.length;
  const visitedDistricts = districts.filter((d) => d.memory.visited);
  const visitedCount = visitedDistricts.length;
  const remainingCount = totalDistricts - visitedCount;
  const progressPercentage = Math.round((visitedCount / totalDistricts) * 100);

  // Group by division
  const divisions = ['Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Rajshahi', 'Rangpur', 'Sylhet', 'Mymensingh'];
  const divisionStats = divisions.map((div) => {
    const inDiv = districts.filter((d) => d.division.toLowerCase() === div.toLowerCase());
    const divVisited = inDiv.filter((d) => d.memory.visited).length;
    const divTotal = inDiv.length;
    const divPercent = divTotal > 0 ? Math.round((divVisited / divTotal) * 100) : 0;
    const bnName = inDiv[0]?.divisionBn || div;
    return {
      name: div,
      bnName,
      visited: divVisited,
      total: divTotal,
      percentage: divPercent,
    };
  });

  return {
    districts,
    state,
    stats: {
      total: totalDistricts,
      visited: visitedCount,
      remaining: remainingCount,
      percentage: progressPercentage,
      divisionStats,
    },
    toggleVisited,
    updateMemory,
    addPhoto,
    removePhoto,
    resetToReference,
  };
}
