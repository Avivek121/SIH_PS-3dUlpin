import { create } from 'zustand';
import { Notification, ULPINSearchResult } from '../types';

interface UIState {
  sidebarCollapsed: boolean;
  searchQuery: string;
  searchResults: ULPINSearchResult[];
  notifications: Notification[];
  loadingStates: Record<string, boolean>;
  modals: Record<string, boolean>;
  
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: ULPINSearchResult[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  searchQuery: '',
  searchResults: [],
  notifications: [],
  loadingStates: {},
  modals: {},

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  setLoading: (key, isLoading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: isLoading }
  })),
  openModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: true }
  })),
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: false }
  })),
}));
