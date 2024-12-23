import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import clanMasterService from '../services/clanMaster.service'
import monthMapper from '../utils/monthMapper'

export const getClanData = createAsyncThunk('clan/getClanData', async (_, { rejectWithValue }) => {
  try {
    const response = await clanMasterService.getTotalClanScores()
    // prepare the data (for current year add up all the points)
    if (response && response.results) {
      const result = response.results.reduce((acc, { teamName, score, year }) => {
        const key = `${teamName}-${year}`
        if (!acc[key]) {
          acc[key] = { teamName, score: 0, year, latestPoint: 0 }
        }
        acc[key].score += score
        acc[key].latestPoint = score // Update latestPoint to the current score
        return acc
      }, {})

      // Convert the accumulated object to an array and sort by score in descending order
      const sortedResults = Object.values(result).sort((a, b) => b.score - a.score);

      return Object.values(sortedResults)
    }
  } catch (error) {
    return rejectWithValue('Error while getting total clan scores')
  }
})

export const clanSlice = createSlice({
  name: 'clan',
  initialState: {
    clansData: [],
    error: { message: null },
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClanData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getClanData.fulfilled, (state, action) => {
        state.clansData = action.payload
        state.isLoading = false
      })
      .addCase(getClanData.rejected, (state, action) => {
        state.error = { message: action.payload }
        state.isLoading = false
      })
  },
})

export default clanSlice.reducer
