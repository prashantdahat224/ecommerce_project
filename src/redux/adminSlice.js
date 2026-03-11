import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAdmin: false,
    loading: false,   // always false now
  },
  reducers: {
    setAdmin(state, action) {
      state.isAdmin = action.payload;
      state.loading = false;
    },
    clearAdmin(state) {
      state.isAdmin = false;
      state.loading = false;
    }
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
