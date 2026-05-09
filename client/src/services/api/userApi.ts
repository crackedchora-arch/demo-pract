import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users/get-all",
     
    }),

    createUser: builder.mutation({
      query: (name: string) => ({
        url: "/users/create",
        method: "POST",
        body: { name },
      }),
      
    }),

    toggleUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),
      
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useToggleUserMutation,
} = userApi;
