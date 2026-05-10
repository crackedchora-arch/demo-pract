
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
    getUsers: builder.query<GetUsersData, {limit: number, page: number}>({
      query: ({page, limit}) => `/users/get-all?page=${page}&limit=${limit}`,
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
    toggleUser: builder.mutation<User, {id: string, page: number, limit:number}>({
      query: ({id}) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),

      async onQueryStarted({id, page, limit}, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            "getUsers",
            {page, limit},
            (draft: GetUsersData) => {
           
              const user = draft.users.find((user) => user._id === id);
        
              if(user){
           
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
