import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  options: {},
  loading: false,
  error: null,
};

export const fetchOptions = createAsyncThunk(
  'options/fetchOptions',
  async ({ endpoint, arrayKey }) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}${endpoint}`);
    return response.data;
  }
);

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        const { endpoint, arrayKey } = action.meta.arg;
        const data = arrayKey ? action.payload[arrayKey] || [] : action.payload;
        
        state.options[endpoint] = data;
        state.loading = false;
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectOptions = (state) => state.options.options;
export const selectLoading = (state) => state.options.loading;
export const selectError = (state) => state.options.error;

export default optionsSlice.reducer;
