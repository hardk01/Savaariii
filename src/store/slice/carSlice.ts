import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    setCabResults: (state, action) => {
      state.data = action.payload;
    },
    clearCabResults: (state) => {
      state.data = [];
    },
  },
});

export const { setCabResults, clearCabResults } = carSlice.actions;
export default carSlice.reducer;
