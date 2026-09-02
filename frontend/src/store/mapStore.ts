import { create } from 'zustand';

interface MapState {
  selectedProperty: string | null;
  selectedBuilding: string | null;
  selectedFloor: string | null;
  selectedUnit: string | null;
  layersVisibility: Record<string, boolean>;
  flyToTarget: [number, number, number] | null; // lon, lat, height
  highlightedULPIN: string | null;
  
  setSelectedProperty: (id: string | null) => void;
  setSelectedBuilding: (id: string | null) => void;
  setSelectedFloor: (id: string | null) => void;
  setSelectedUnit: (id: string | null) => void;
  toggleLayer: (layerId: string) => void;
  setFlyToTarget: (target: [number, number, number] | null) => void;
  setHighlightedULPIN: (ulpin: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedProperty: null,
  selectedBuilding: null,
  selectedFloor: null,
  selectedUnit: null,
  layersVisibility: {
    parcels: true,
    buildings: true,
    satellite: true,
  },
  flyToTarget: null,
  highlightedULPIN: null,

  setSelectedProperty: (id) => set({ selectedProperty: id }),
  setSelectedBuilding: (id) => set({ selectedBuilding: id }),
  setSelectedFloor: (id) => set({ selectedFloor: id }),
  setSelectedUnit: (id) => set({ selectedUnit: id }),
  toggleLayer: (layerId) => set((state) => ({
    layersVisibility: {
      ...state.layersVisibility,
      [layerId]: !state.layersVisibility[layerId]
    }
  })),
  setFlyToTarget: (target) => set({ flyToTarget: target }),
  setHighlightedULPIN: (ulpin) => set({ highlightedULPIN: ulpin }),
}));
