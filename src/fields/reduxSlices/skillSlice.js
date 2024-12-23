import { createSlice } from '@reduxjs/toolkit'

export const SkillsSlice = createSlice({
  name: 'skills',
  initialState: {
    skillsList: ['This JD has no skills'],
  },
  reducers: {
    setSkillsList: (state, action) => {
      // if (state.buzzList.length === 0 || state.buzzList.length === 5) {
      state.skillsList = action.payload
      // }
    },
  },
})

export const { setSkillsList } = SkillsSlice.actions
export default SkillsSlice.reducer
