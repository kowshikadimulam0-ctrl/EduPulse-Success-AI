import { create } from 'zustand';
import { UserRole, InterventionRecord } from '@/lib/types';

interface AppState {
  activeRole: UserRole;
  currentTab: string;
  selectedStudentId: string;
  searchQuery: string;
  filterCohort: string;
  filterMajor: string;
  filterStatus: string;
  theme: 'light' | 'dark';
  interventions: InterventionRecord[];
  
  // Actions
  setActiveRole: (role: UserRole) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedStudentId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterCohort: (cohort: string) => void;
  setFilterMajor: (major: string) => void;
  setFilterStatus: (status: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addIntervention: (intervention: InterventionRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRole: 'leadership',
  currentTab: 'data-explorer', // Stage 1 defaults to data explorer for immediate review!
  selectedStudentId: 'STU-1002',
  searchQuery: '',
  filterCohort: 'all',
  filterMajor: 'all',
  filterStatus: 'all',
  theme: 'light',
  interventions: [],

  setActiveRole: (role) =>
    set({
      activeRole: role,
      currentTab: role === 'leadership' ? 'overview' : role === 'advisor' ? 'caseload' : 'student-view',
    }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCohort: (cohort) => set({ filterCohort: cohort }),
  setFilterMajor: (major) => set({ filterMajor: major }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  addIntervention: (record) =>
    set((state) => ({ interventions: [record, ...state.interventions] })),
}));
