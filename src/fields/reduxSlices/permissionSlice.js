import { createSlice } from "@reduxjs/toolkit";

export const permissionSlice = createSlice({
    name: 'permission',
    initialState: {
        isPhotoUploader: true,
    },
    reducers: {
        setIsPhotoUploader: (state, action) => {
            state.isPhotoUploader = action.payload;
        }
    }
});

export const { setIsPhotoUploader } = permissionSlice.actions;

export default permissionSlice.reducer;