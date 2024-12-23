import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userRegistrationService from "../services/userRegistration.service";

export const getAllUsersInfo = createAsyncThunk('/user/getAllUsersInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await userRegistrationService.getUsers({ pageNumber: 1, itemCount: 5000, projection: "email,id" })
    return response?.results;
  } catch (error) {
    return rejectWithValue(`Error while getting all users data ${error.toString()}`)
  }
})


export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    activePanel: "user",
    adminAccess: false,
    isLoading: false,
    allUsers: [],
  },
  reducers: {
    setActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
    checkAdminAccess: (state, action) => {
      state.adminAccess = action.payload;
    },
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload))
    },

    userType: (state, action) => {
      state.userType = action.payload;
    },

    logout: (state) => {
      window.location.href = '/';
      state.user = null;
      localStorage.clear();
      sessionStorage.clear();
    },


    refreshLogout: (state) => {
      state.user = null;

      // Removing individual items because we need to keep "pathBeforeLogin"
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        key !== "pathBeforeLogin" && localStorage.removeItem(key);
      }
    },
    setAllUsersInfo: (state, action) => {
      state.allUsers = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersInfo.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllUsersInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.allUsers = action.payload
      })
      .addCase(getAllUsersInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
  }
});

export const { login, logout, refreshLogout, userType, setActivePanel, checkAdminAccess, setAllUsersInfo } = userSlice.actions;

export default userSlice.reducer;
