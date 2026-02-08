import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface StatsState {
  selectedYear: number;
  selectedRegionIds: string[];
  isComparisonMode: boolean;
}

const initialState: StatsState = {
  selectedYear: 2024,
  selectedRegionIds: [],
  isComparisonMode: false,
};
/*
  * This slice manages the global state for the statistics dashboard, including:   
  * - The currently selected year
  * - The selected region IDs
  * - Whether comparison mode is enabled
  */
export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    toggleRegion: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedRegionIds.includes(id)) {
        state.selectedRegionIds = state.selectedRegionIds.filter(r => r !== id);
      } else {
        if (state.isComparisonMode && state.selectedRegionIds.length >= 2) {
          state.selectedRegionIds = [state.selectedRegionIds[1], id];
        } else {
          state.selectedRegionIds.push(id);
        }
      }
    },
    clearAllSelections: (state) => {
      state.selectedRegionIds = [];
    },
    setComparisonMode: (state, action: PayloadAction<boolean>) => {
      state.isComparisonMode = action.payload;
      state.selectedRegionIds = []; 
    },
  },
});

export const { setYear, toggleRegion, setComparisonMode, clearAllSelections } = statsSlice.actions;
export default statsSlice.reducer;