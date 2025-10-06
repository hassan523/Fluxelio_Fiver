import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateUserRequest, CreateUserResponse, GetAllUsersRequest, GetAllUsersResponse } from "./UserType";

export const UserSlice = createApi({
    reducerPath: "UserSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    tagTypes: ["createUser"],
    endpoints: (build) => ({
        GetAllUser: build.query<GetAllUsersResponse, GetAllUsersRequest>({
            query: ({ agencyID, officeID, Token }) => ({
                url: `/api/user/${agencyID}/get-office-users/${officeID}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["createUser"],
        }),
        createUser: build.mutation<CreateUserResponse, CreateUserRequest>({
            query: ({ agencyID, officeID, Token, username, phone, password, createdBy, email, countryCode, country }) => ({
                url: `/api/user/${agencyID}/register-user/${officeID}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: {username, phone, password, createdBy, email, countryCode, country}
            }),
            invalidatesTags: ["createUser"],
        }),
    }),
});

export const { useGetAllUserQuery,useCreateUserMutation } = UserSlice;
