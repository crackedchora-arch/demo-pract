
import type { User } from "../../types/user.types";
import { baseApi } from "./baseApi";

interface GetUsersData{
  users: User[],
  hasMore: boolean,
  totalPages: number,
  currentPage: number,
}


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET USERS
    getUsers: builder.query<
      GetUsersData,
      { limit: number; page: number } | void
    >({
      query: (args) => {
        const page = args?.page || 1;
        const limit = args?.limit || 10;

        return `/users/get-all?page=${page}&limit=${limit}`;
      },

      // integrating query with inf scrolling
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newData) => {
        const existingIds = new Set(currentCache.users.map((u) => u._id));

        const filteredUsers = newData.users.filter(
          (u) => !existingIds.has(u._id),
        );

        currentCache.users.push(...filteredUsers);

        // now updating remaining fields
        currentCache.hasMore = newData.hasMore;
        currentCache.currentPage = newData.currentPage;
        currentCache.totalPages = newData.totalPages;
      },

      // refetch when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },

      providesTags: ["User"],
    }),

    // CREATE USER
    createUser: builder.mutation<User, string>({
      query: (name) => ({
        url: "/users/create",
        method: "POST",
        body: { name },
      }),
      // for updating user as it not updates with invalidatesTags
      async onQueryStarted(name, { dispatch, queryFulfilled }) {
        try {
          const { data: newUser } = await queryFulfilled;

          dispatch(
            userApi.util.updateQueryData(
              "getUsers",
              undefined,

              (draft) => {
                // add new user at top
                draft.users.unshift(newUser);
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // TOGGLE USER
    toggleUser: builder.mutation<
      User,
      string
    >({
      query: ( id) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData( 
            "getUsers",
            undefined,
            (draft: GetUsersData) => {
              const user = draft.users.find((user) => user._id === id);

              if (user) {
                user.active = !user.active;
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),

    
  }),
});

export const {useCreateUserMutation, useGetUsersQuery, useToggleUserMutation} =userApi;
