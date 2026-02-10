import { createSlice } from '@reduxjs/toolkit';

interface StatsState {
  selectedYear: number;
  selectedMonth: number;
  selectedRegionIds: string[];
  isComparisonMode: boolean;
  viewMode: 'yearly' | 'monthly';
  comparisonRegions: {
    region1: string | null;
    region2: string | null;
  };
}

const initialState: StatsState = {
  selectedYear: 2024,
  selectedMonth: 1,
  selectedRegionIds: [],
  isComparisonMode: false,
  viewMode: 'yearly',
  comparisonRegions: {
    region1: null,
    region2: null,
  },
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    toggleRegionSelection: (state, action) => {
      const regionId = action.payload;
      
      if (state.isComparisonMode) {
        // Comparison mode: only allow 2 regions
        if (state.comparisonRegions.region1 === regionId) {
          state.comparisonRegions.region1 = null;
        } else if (state.comparisonRegions.region2 === regionId) {
          state.comparisonRegions.region2 = null;
        } else if (!state.comparisonRegions.region1) {
          state.comparisonRegions.region1 = regionId;
        } else if (!state.comparisonRegions.region2) {
          state.comparisonRegions.region2 = regionId;
        } else {
          // Replace first region if both slots are full
          state.comparisonRegions.region1 = regionId;
        }
        
        // Update selectedRegionIds for consistency
        state.selectedRegionIds = [
          state.comparisonRegions.region1,
          state.comparisonRegions.region2,
        ].filter(Boolean) as string[];
      } else {
        // Normal mode: multiple selections
        const index = state.selectedRegionIds.indexOf(regionId);
        if (index > -1) {
          state.selectedRegionIds.splice(index, 1);
        } else {
          state.selectedRegionIds.push(regionId);
        }
      }
    },
    clearAllSelections: (state) => {
      state.selectedRegionIds = [];
      state.comparisonRegions = { region1: null, region2: null };
    },
    setComparisonMode: (state, action) => {
      state.isComparisonMode = action.payload;
      if (action.payload) {
        // CLEAR ALL SELECTIONS when entering comparison mode
        state.selectedRegionIds = [];
        state.comparisonRegions = { region1: null, region2: null };
      }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const { 
  setYear, 
  setMonth, 
  toggleRegionSelection, 
  clearAllSelections, 
  setComparisonMode, 
  setViewMode 
} = statsSlice.actions;
export default statsSlice.reducer;