import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the favourites feature
const initialState = { value: [] };

// Create a Redux slice for the favourites feature
export const favouriteSlice = createSlice({
    name: "favourites",
    initialState,
    reducers: {
        // Define a reducer to set the list of favourite items
        setFavouriteList: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Export the setFavouriteList action creator
export const { setFavouriteList } = favouriteSlice.actions;

// Export the favourites reducer
export default favouriteSlice.reducer;
