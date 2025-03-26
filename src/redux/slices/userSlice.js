import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    dispatchToken: (state, action) => {
      state.token = action.payload;
    },
    dispatchUser: (state, action) => {
      state.user = action.payload;
    },
    clearState: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { dispatchToken, dispatchUser, clearState } = userSlice.actions;

export default userSlice.reducer;
