import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/user.service'
import monthMap from '../utils/monthMapper'
import buzzService from '../services/buzz.service'
import aloisFeedService from '../services/aloisFeed.service'
import photoSharingService from '../services/photoSharing.service'
import { generateDailyToken } from '../libs/commanActions'

export const getCurrentMonthBirthdayUsers = createAsyncThunk(
  'dashboard/getUpcomingBirthdays',
  async (month = null, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentMonthBirthdayUsers(month)
      const sortedRespBirthdays = response.sort(
        (a, b) => new Date(a.dateOfBirth).getDate() - new Date(b.dateOfBirth).getDate(),
      )

      return sortedRespBirthdays
    } catch (error) {
      return rejectWithValue(`Error while getting upcoming birthdays ${error.toString()}`)
    }
  },
)

export const getCurrentMonthAnniversaryUsers = createAsyncThunk(
  'dashboard/getUpcomingAnniversary',
  async (month = null, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentMonthAnniversaryUsers(month)
      const sortedRespAnniversaries = response.sort(
        (a, b) => new Date(a.dateOfJoining).getDate() - new Date(b.dateOfJoining).getDate(),
      )
      return sortedRespAnniversaries
    } catch (error) {
      return rejectWithValue(`Error while getting upcoming birthdays ${error.toString()}`)
    }
  },
)

export const getLatestBuzz = createAsyncThunk(
  '/dashboard/getLatestBuzz',
  async (data, { rejectWithValue }) => {
    try {
      const response = await buzzService.getLatestBuzz()

      if (response.length > 4)
        return [response[0], response[1], response[2], response[3], response[4]]
      if (response.length === 2) return [response[0], response[1]]
      if (response.length === 1) return [response[0]]
    } catch (error) {
      return rejectWithValue(`Error while getting latest buzz ${error.toString()}`)
    }
  },
)

export const uploadBuzz = createAsyncThunk(
  '/dashboard/uploadBuzz',
  async (db_upload, { rejectWithValue }) => {
    try {
      const res = await buzzService.uploadBuzz(db_upload)
      return res
    } catch (error) {
      return rejectWithValue(`Error while uploading Buzz ${error.toString()}`)
    }
  },
)

export const getBuzzList1 = createAsyncThunk(
  '/dashboard/getBuzzList1',
  async (args, { rejectWithValue }) => {
    try {
      const response = await buzzService.getBuzzList1(args?.page || 1)

      return response
    } catch (error) {
      return rejectWithValue(`Error while getting latest buzz ${error.toString()}`)
    }
  },
)

export const removeBuzzItem = createAsyncThunk(
  '/dashboard/removeBuzzItem',
  async (data, { rejectWithValue }) => {
    if (!Array.isArray(data) || data.length === 0) {
      return rejectWithValue('Invalid input: data must be a non-empty array of buzz IDs.')
    }

    try {
      await Promise.all(
        data.map(async (buzzId) => {
          if (typeof buzzId !== 'string') {
            throw new Error(`Invalid buzzId: ${buzzId}`)
          }
          const res = await buzzService.removeBuzz(buzzId)
          console.log(res)
          return res
        }),
      )

      return data
    } catch (error) {
      return rejectWithValue(`Error while removing buzz: ${error.message}`)
    }
  },
)

export const deleteMemory = createAsyncThunk(
  '/photoSharing/deleteMemory',
  async (memoryIds, { rejectWithValue }) => {
    if (!Array.isArray(memoryIds) || memoryIds.length === 0) {
      return rejectWithValue('Invalid input: memoryIds must be a non-empty array of memory IDs.')
    }

    try {
      await Promise.all(
        memoryIds.map(async (memoryId) => {
          if (typeof memoryId !== 'string') {
            throw new Error(`Invalid memoryId: ${memoryId}`)
          }
          const response = await photoSharingService.deleteMemory(memoryId)
          return response
        }),
      )

      return memoryIds
    } catch (error) {
      return rejectWithValue(`Error while deleting memories: ${error.message}`)
    }
  },
)

export const getFeed = createAsyncThunk('/dashboard/getFeed', async (args, { rejectWithValue }) => {
  try {
    const response = await aloisFeedService.getAllEvents('', args.page, args.limit)
    return response
  } catch (error) {
    return rejectWithValue(`Error while getting feed ${error.toString()}`)
  }
})

export const setFeed = createAsyncThunk('/dashboard/message', async (data, { rejectWithValue }) => {
  try {
    const response = await aloisFeedService.createALOISFeed(data)
    return response
  } catch (error) {
    return rejectWithValue(`Error while getting feed ${error.toString()}`)
  }
})

export const updateFeed = createAsyncThunk(
  '/dashboard/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await aloisFeedService.updateALOISFeed(data)
      return response
    } catch (error) {
      return rejectWithValue(`Error while updating feed ${error}`)
    }
  },
)

export const updateLike = createAsyncThunk(
  '/dashboard/like',
  async (data, { rejectWithValue }) => {
    try {
      const response = await aloisFeedService.manageLike(data)
      return response;
    } catch (error) {
      return rejectWithValue(`Error while updating like ${error}`)
    }
  }
)

export const manageComments = createAsyncThunk(
  '/dashboard/comment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await aloisFeedService.manageComment(data)
      return response;
    } catch (error) {
      return rejectWithValue(`Error while updating comment ${error}`)
    }
  }
)

export const castVote = createAsyncThunk(
  '/dashboard/castVode',
  async (data, { rejectWithValue }) => {
    try {
      const { feedId, pollOption } = data
      const response = await aloisFeedService.updatePoll(feedId, pollOption)
      return response
    } catch (error) {
      return rejectWithValue(`Error while updating feed ${error}`)
    }
  },
)

export const deletePost = createAsyncThunk(
  '/dashboard/delete',
  async (data, { rejectWithValue }) => {
    try {
      const response = await aloisFeedService.deleteALOISFeed(data.id)
      return data
    } catch (error) {
      return rejectWithValue(`Error while deleting the post ${error}`)
    }
  },
)

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    feed: { results: [] },
    notifications: [],
    upcomingBirthdays: [],
    lastUpdatedBirthdays: null,
    upcomingBirthdaysPending: true,
    upcomingAnniversaries: [],
    lastUpdatedAnniversaries: null,
    upcomingAnniversariesPending: true,
    buzzList: [],
    sidebarShow: true,
    isLoading: true,
    theme: 'light',
    message: '',
    // feed:""
    buzzList1: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      // console.log(action.payload);
      state.notifications = action.payload
    },
    changeState: (state = initialState, { type, ...rest }) => {
      switch (type) {
        case 'set':
          return { ...state, ...rest }
        default:
          return state
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentMonthBirthdayUsers.pending, (state) => {
        state.upcomingBirthdaysPending = true
      })
      .addCase(getCurrentMonthAnniversaryUsers.pending, (state) => {
        state.upcomingAnniversariesPending = true
      })
      .addCase(getCurrentMonthBirthdayUsers.fulfilled, (state, action) => {
        if (action.payload) {
          const currentYear = new Date().getFullYear()

          const birthdayResults = action.payload.map((item) => {
            const strippedIsoString = item.dateOfBirth.replace(/(Z|([+-]\d{2}:\d{2}))/g, '');
            const dateOfBirth = new Date(strippedIsoString)
            const formattedDate = `${currentYear}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
            return {
              name: `${item.firstName} ${item.lastName}`,
              date: formattedDate,
              profilePic: item.profilePic || '/assets/profile.jpg',
            }
          })

          state.upcomingBirthdays = birthdayResults
          state.lastUpdatedBirthdays = generateDailyToken();
        }

        state.upcomingBirthdaysPending = false
      })
      .addCase(getCurrentMonthBirthdayUsers.rejected, (state, action) => {
        state.error = { message: action.payload }
        state.upcomingBirthdaysPending = false
      })
      .addCase(getCurrentMonthAnniversaryUsers.rejected, (state, action) => {
        state.error = { message: action.payload }
        state.upcomingAnniversariesPending = false
      })
      .addCase(getCurrentMonthAnniversaryUsers.fulfilled, (state, action) => {
        const sortedRespAnniversaries = action.payload
        const currentYear = new Date().getFullYear()
        const anniversaryResult = sortedRespAnniversaries.map((item) => {
          const strippedIsoString = item.dateOfJoining.replace(/(Z|([+-]\d{2}:\d{2}))/g, '');
          const dateOfJoining = new Date(strippedIsoString)
          const formattedDate = `${currentYear}-${String(dateOfJoining.getMonth() + 1).padStart(2, '0')}-${String(dateOfJoining.getDate()).padStart(2, '0')}`

          return {
            name: `${item.firstName} ${item.lastName}`,
            date: formattedDate,
            profilePic: item.profilePic ? item.profilePic : `/assets/profile.jpg`,
          }
        })
        state.upcomingAnniversaries = anniversaryResult
        state.lastUpdatedAnniversaries = generateDailyToken();
        state.upcomingAnniversariesPending = false
      })
      .addCase(getLatestBuzz.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getLatestBuzz.fulfilled, (state, action) => {
        if (action.payload) {
          state.buzzList = action.payload
        }
      })
      .addCase(getLatestBuzz.rejected, (state, action) => {
        state.error = { message: action.payload }
        state.isLoading = false
      })

      .addCase(getBuzzList1.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBuzzList1.fulfilled, (state, action) => {
        if (action?.payload?.page > 1) {
          state.buzzList1 = {
            ...action.payload,
            results: state.buzzList1.results.concat(action.payload.results),
          }
        } else {
          state.buzzList1 = action.payload
        }
      })
      .addCase(getBuzzList1.rejected, (state, action) => {
        state.error = { message: action.payload }
        state.isLoading = false
      })

      .addCase(getFeed.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false
        if (action?.payload?.page > 1) {
          state.feed = {
            ...action.payload,
            results: state.feed.results.concat(action.payload.results),
          }
        } else {
          state.feed = action.payload
        }
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(setFeed.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setFeed.fulfilled, (state, action) => {
        state.isLoading = false
        state.feed.results = [
          { ...action.payload, userId: JSON.parse(localStorage.getItem('user')) },
          ...state.feed.results,
        ]
      })
      .addCase(setFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(updateFeed.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateFeed.fulfilled, (state, action) => {
        state.isLoading = false

        if (Array.isArray(state.feed.results)) {
          const index = state.feed.results.findIndex((item) => item.id === action.payload.id)

          if (index !== -1) {
            state.feed.results[index] = {
              ...state.feed.results[index],
              ...action.payload,
            }
          } else {
            console.warn(`Item with ID ${action.payload.id} not found.`)
          }
        } else {
          console.error('state.feed is not an array')
        }
      })
      .addCase(updateFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(updateLike.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateLike.fulfilled, (state, action) => {
        state.isLoading = false

        if (Array.isArray(state.feed.results)) {
          const index = state.feed.results.findIndex((item) => item.id === action.payload.id)

          if (index !== -1) {
            state.feed.results[index] = {
              ...state.feed.results[index],
              ...action.payload,
            }
          } else {
            console.warn(`Item with ID ${action.payload.id} not found.`)
          }
        } else {
          console.error('state.feed is not an array')
        }
      })
      .addCase(updateLike.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(manageComments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(manageComments.fulfilled, (state, action) => {
        state.isLoading = false

        if (Array.isArray(state.feed.results)) {
          const index = state.feed.results.findIndex((item) => item.id === action.payload.id)

          if (index !== -1) {
            state.feed.results[index] = {
              ...state.feed.results[index],
              ...action.payload,
            }
          } else {
            console.warn(`Item with ID ${action.payload.id} not found.`)
          }
        } else {
          console.error('state.feed is not an array')
        }
      })
      .addCase(manageComments.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const idx = state.feed.results.findIndex((item) => item.id === action.payload.id)
        if (idx !== -1) {
          state.feed.results.splice(idx, 1)
        }
      })
      .addCase(deletePost.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(castVote.fulfilled, (state, action) => {
        if (Array.isArray(state.feed.results)) {
          const index = state.feed.results.findIndex((item) => item.id === action.payload.id)

          if (index !== -1) {
            state.feed.results[index] = {
              ...action.payload,
            }
          } else {
            console.warn(`Item with ID ${action.payload.id} not found.`)
          }
        } else {
          console.error('state.feed is not an array')
        }
      })
      .addCase(castVote.pending, (state) => {
        state.isLoading = true
      })
      .addCase(castVote.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })

      .addCase(uploadBuzz.fulfilled, (state, action) => {
        state.isLoading = false
        if (action?.payload) {
          state.buzzList1.results = [action.payload, ...state.buzzList1.results]
        }
      })
      .addCase(uploadBuzz.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadBuzz.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })

      .addCase(removeBuzzItem.fulfilled, (state, action) => {
        state.isLoading = false
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          const temp = state.buzzList1.results.filter((item) => !action.payload.includes(item.id))
          state.buzzList1.results = temp
        }
      })
      .addCase(removeBuzzItem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(removeBuzzItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
  },
})

export const { setNotifications } = dashboardSlice.actions
export default dashboardSlice.reducer
