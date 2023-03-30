import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import boardReducer from "./features/boardSlice";
import favouriteReducer from "./features/favouriteSlice";

// Configure the Redux store
export const store = configureStore({
    reducer: {
        // Add reducers for user, board, and favourites features
        user: userReducer,
        board: boardReducer,
        favourites: favouriteReducer,
    },
});

/*
- `configureStore` is a function provided by the `@reduxjs/toolkit` library that creates a Redux store with some sensible defaults and some opinionated behavior that makes it easier to work with Redux.
- `userReducer`, `boardReducer`, and `favouriteReducer` are Redux reducers that are combined together to create the final store.
- `reducer` is an object that describes how to combine the reducers. The keys in this object are the names of the slices of the store, and the values are the corresponding reducers.
- The `store` object contains the Redux store with the combined reducers. It is exported so it can be used throughout the application to store and manipulate state.
*/
