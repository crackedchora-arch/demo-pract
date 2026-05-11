import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/api/baseApi";
import { uploadApi } from "@/services/api/uploadApi";
// ...

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(baseApi.middleware)
  .concat(uploadApi.middleware)
  ,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
