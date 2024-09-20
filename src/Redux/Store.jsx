import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    users: userReducer, // mapping the users to userReducer
  },
});

export default store;
