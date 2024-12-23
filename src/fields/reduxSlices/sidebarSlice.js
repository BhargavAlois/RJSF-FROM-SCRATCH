import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    toggleSidebarState: (state, action) => {
      state.sidebarShow = !state.sidebarShow
    },
    setSidebarState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { toggleSidebarState, setSidebarState } = sidebarSlice.actions
export default sidebarSlice.reducer
