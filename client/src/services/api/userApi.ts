import type { User } from "../../types/user.types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET USERS
    getUsers: builder.query<User[], void>({
      query: () => "/users/get-all",
    }),

    // CREATE USER
    createUser: builder.mutation<User, { name: string }>({
      query: (name) => ({
        url: "/users/create",
        method: "POST",
        body: { name },
      }),
    }),

    // TOGGLE USER
    toggleUser: builder.mutation<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData(
            "getUsers",
            undefined,
            (draft: User[]) => {
              const user = draft.find((u) => u.id === id);
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

  overrideExisting: false,
});
