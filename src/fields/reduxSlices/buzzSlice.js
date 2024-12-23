import { createSlice } from "@reduxjs/toolkit";

export const buzzSlice = createSlice({
  name: "buzz",
  initialState: {
    buzzList: [],
    filteredBuzzList: [],
  },
  reducers: {
    setBuzzList: (state, action) => {
      // if (state.buzzList.length === 0 || state.buzzList.length === 5) {
        state.buzzList = action.payload;
    },
    removeBuzzItem:(state,action)=>{
      state.buzzList = state.buzzList.filter((item)=>item.id!==action.payload)
    },
    setFilteredBuzzList : (state, action) => {
        state.filteredBuzzList = action.payload;
    },
    filterBuzzList: (state, action) => {
      if (action.payload === "") state.filteredBuzzList = state.buzzList;
      else {
        // filter list acc. to category selected (published, draft, trash)
        state.filteredBuzzList = state.buzzList.filter(
          (item) => item.status === action.payload
        );
        
      }
    },
    // trigger state update for single buzz.
    updateSingleBuzz: (state, action) => {
      const { buzzId, status } = action.payload;
      let tempList = state.filteredBuzzList;
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].id === buzzId) {
          tempList[i].status = status;
          break;
        }
      }
      for (let i = 0; i < state.buzzList.length; i++) {
        if (state.buzzList[i].id === buzzId) {
          state.buzzList[i].status = status;
          break;
        }
      }
      state.filteredBuzzList = tempList;
    },
    updateSingleBuzzLikedBy: (state, action) => {
      
      const { buzzId, likedBy } = action.payload;
      let tempList = state.filteredBuzzList;
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].id === buzzId) {
          tempList[i].likedBy = likedBy;
          break;
        }
      }
      for (let i = 0; i < state.buzzList.length; i++) {
        if (state.buzzList[i].id === buzzId) {
          state.buzzList[i].likedBy = likedBy;
          break;
        }
      }
      state.filteredBuzzList = tempList;
    },
    updateSingleBuzzComments: (state, action) => {
      
      const { buzzId, comments } = action.payload;
      let tempList = state.filteredBuzzList;
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].id === buzzId) {
          tempList[i].comments = comments;
          break;
        }
      }
      for (let i = 0; i < state.buzzList.length; i++) {
        if (state.buzzList[i].id === buzzId) {
          state.buzzList[i].comments = comments;
          break;
        }
      }
      state.filteredBuzzList = tempList;
    },
    // set new page buzz list.
    setNewPageBuzzList: (state, action) => {
      state.buzzList = action.payload;
      state.filteredBuzzList = action.payload;
    },
  },
});

export const {
  setBuzzList,
  filterBuzzList,
  updateSingleBuzz,
  updateSingleBuzzLikedBy,
  setNewPageBuzzList,
  setFilteredBuzzList,
  updateSingleBuzzComments,
  removeBuzzItem,
} = buzzSlice.actions;
export default buzzSlice.reducer;
