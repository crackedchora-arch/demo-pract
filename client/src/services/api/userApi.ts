
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
    getUsers: builder.query<GetUsersData, void>({
      query: () => "/users/get-all",
      providesTags: ["User"]
    }),

    // CREATE USER
    createUser: builder.mutation<User, string>({
      query: (name) => ({
        url: "/users/create",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["User"]
    }),

    // TOGGLE USER
    toggleUser: builder.mutation<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            "getUsers",
            undefined,
            (draft: GetUsersData) => {
           
              const user = draft.find((user) => user._id === id);
        
              if(user){
                console.log("user present");
                user.active = !user.active
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
