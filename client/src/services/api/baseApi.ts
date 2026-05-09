import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URI,
  }),

  tagTypes: ["User"],

  endpoints: () => ({}), 
});
