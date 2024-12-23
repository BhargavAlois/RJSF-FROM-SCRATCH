import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import photoSharingService from '../services/photoSharing.service'

export const getAllMemories = createAsyncThunk(
  '/photoSharing/getAllMemories',
  async (args, { rejectWithMessage }) => {
    try {
      let { folderName, pageNo, name, itmPerPage } = args
      let path = folderName
      if (folderName === '/') path = ''
      const response = await photoSharingService.getAllEvents(path, pageNo, name, itmPerPage)
      return { key: path, result: response }
    } catch (error) {
      rejectWithMessage(`Error while getting memories: ${error}`)
    }
  },
)
export const deleteImage = createAsyncThunk(
  '/photoSharing/deleteImage',
  async (args, { rejectWithMessage }) => {
    try {
      await photoSharingService.deleteMany(args)
      return args
    } catch (error) {
      rejectWithMessage(`Error while deleting memory image: ${error}`)
    }
  },
)

export const likeImage = createAsyncThunk(
  '/photoSharing/likeImage',
  async (args, { rejectWithMessage }) => {
    try {
      const res = await photoSharingService.manageLike(args)
      return res
    } catch (error) {
      rejectWithMessage(`Error while deleting memory image: ${error}`)
    }
  },
)

export const createAlbum = createAsyncThunk(
  '/photoSharing/createAlbum',
  async (args, { rejectWithMessage }) => {
    try {
      await photoSharingService.createAlbum(args)
    } catch (error) {
      rejectWithMessage(`Error while creating new Folder: ${error}`)
    }
  },
)

export const photoSharingSlice = createSlice({
  name: 'photoSharing',
  initialState: {
    memories: [],
    isLoading: false,
    selectedImageData: null,
    error: null,
  },
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImageData = action.payload
    },

    setMemories: (state, action) => {
      state.memories = {
        [action.payload.key]: action.payload.result,
      }
    },

    addMemories: (state, action) => {
      state.memories = {
        ...state.memories,
        [action.payload.key]: action.payload.result,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMemories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMemories.fulfilled, (state, action) => {
        const { key, result } = action.payload
        state.isLoading = false
        state.memories = { key, result }
      })
      .addCase(getAllMemories.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(deleteImage.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.memories?.result?.results) {
          state.memories.result.results = state.memories.result.results.filter(
            (itm) => !action.payload.memoryId.includes(itm.id),
          )
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(likeImage.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(likeImage.fulfilled, (state, action) => {
        const { id } = action.payload
        state.isLoading = false
        // state.selectedImageData = action.payload;
        if (state.memories?.result?.results) {
          state.memories.result.results = state.memories.result.results.map((itm) => {
            if (itm.id === id) {
              return {
                ...itm,
                ...action.payload,
              }
            }
            return itm
          })
        }
      })
      .addCase(likeImage.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const { setMemories, addMemories, setSelectedImage } = photoSharingSlice.actions
export default photoSharingSlice.reducer