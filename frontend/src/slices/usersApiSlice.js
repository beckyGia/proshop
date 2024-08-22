import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice"; //use this because it uses endpoints that are dealing with async requests

//replaces a fetch or axios request
export const usersApiSlice = apiSlice.injectEndpoints({
  //A function to inject the endpoints into the original API, but also give you that same API with correct types for these endpoints back. Useful with code-splitting.
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data, //sending the data in the body
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
} = usersApiSlice;
