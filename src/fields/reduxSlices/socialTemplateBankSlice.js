import { createSlice } from "@reduxjs/toolkit";
import socialTemplateBankService from "../services/socialTemplateBank.service";
export const getSocialTemplateBank = createAsyncThunk('/ess/socialtemplatebank', async (data, { rejectWithValue }) => {
    try {
      const response = await socialTemplateBankService.getTemplates()
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting latest buzz ${error.toString()}`)
    }
  })
export const socialTemplateBankSlice = createSlice({
    name: 'socialTemplateBank',
    initialState: {
        socialTemplates: [],
    },
    reducers: {
        setSocialTemplates: (state, action) => {
            state.socialTemplates = action.payload;
        }
    }
});

export const { setIsPhotoUploader } = socialTemplateBankSlice.actions;

export default socialTemplateBankSlice.reducer;