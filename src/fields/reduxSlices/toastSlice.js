import { createSlice } from '@reduxjs/toolkit'

export const ToastSlice = createSlice({
    name: 'toast',
    initialState: {
        visible: false,
        title: "",
        text: "",
        type: "",
        duration: 3000,
    },
    reducers: {
        setToast: (state, action) => {
            const { visible, title, text, type } = action.payload;
            state.visible = visible;
            state.title = title;
            // Handling RJSF multiple form responses
            state.text = Array.isArray(text) && text.length > 0 && text[0]?.message ? text[0].message : text;
            state.type = type;
        },

        clearToast: (state, action) => {
            state.visible = false;
            state.title = "";
            state.text = "";
            state.type = "";
            state.duration = 3000;
        }
    },
})

export const { setToast, clearToast } = ToastSlice.actions
export default ToastSlice.reducer
