import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    getUser: (state, action) => {
      state.users = action.payload.map((ele) => ({
        id: ele._id,
        name: ele.name,
        email: ele.email,
        age: ele.age,
        imgUrl: ele.imgUrl, // Use imgUrl directly from the API response
      }));
    },
    createUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (ele) => ele.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          age: action.payload.age,
          imgUrl: action.payload.imgUrl, // Use imgUrl consistently
        };
      }
    },
    deleteUser: (state, action) => {
      const id = action.payload.id;
      const originalLength = state.users.length;
      state.users = state.users.filter((ele) => ele.id !== id);
      console.log(
        `Deleted user with id ${id}, users length changed from ${originalLength} to ${state.users.length}`
      );
    },
  },
});

export const { getUser, createUser, updateUser, deleteUser } =
  userSlice.actions;
export default userSlice.reducer;
