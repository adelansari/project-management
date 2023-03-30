import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the board feature
const initialState = { value: [] };

// Create a Redux slice for the board feature
export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        // Define a reducer to set the list of boards
        setBoards: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Export the setBoards action creator
export const { setBoards } = boardSlice.actions;

// Export the board reducer
export default boardSlice.reducer;
