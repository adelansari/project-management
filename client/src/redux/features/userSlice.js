import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user feature
const initialState = { value: {} };

// Create a Redux slice for the user feature
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Define a reducer to set the user data
        setUser: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Export the setUser action creator
export const { setUser } = userSlice.actions;

// Export the user reducer
export default userSlice.reducer;
