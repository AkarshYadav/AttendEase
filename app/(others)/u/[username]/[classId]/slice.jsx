import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    currentKey: "", // Holds the active attendance key
  },
  reducers: {
    setAttendanceKey: (state, action) => {
      state.currentKey = action.payload;
    },
    generateNewKey: (state) => {
      state.currentKey = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
  },
});

export const { setAttendanceKey, generateNewKey } = attendanceSlice.actions;
export default attendanceSlice.reducer;
