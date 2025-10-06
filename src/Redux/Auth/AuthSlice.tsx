import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetProfileRequest, LoginRequest, LoginResponse, Profile } from "./AuthTypes";

export const AuthSlice = createApi({
    reducerPath: "AuthSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    endpoints: (build) => ({
        Login: build.mutation<LoginResponse, LoginRequest>({
            query: (data) => ({
                url: `/api/login`,
                method: "POST",
                body: data,
            }),
        }),

        ForgotPassword: build.mutation<{ message: string; identifier: string }, { identifier: string }>({
            query: (data) => ({
                url: `/api/forget-password`,
                method: "PATCH",
                body: data,
            }),
        }),

        VerifyOTP: build.mutation<{ message: string; identifier: string }, { identifier: string; otp: string }>({
            query: (data) => ({
                url: `/api/verify-otp`,
                method: "PATCH",
                body: data,
            }),
        }),

        ChangePassword: build.mutation<{ message: string }, { identifier: string; otp: string; newPassword: string }>({
            query: (data) => ({
                url: `/api/change-password`,
                method: "PATCH",
                body: data,
            }),
        }),

        GetProfile: build.query<Profile, GetProfileRequest>({
            query: ({ userID, Token }) => ({
                url: `/api/profile/${userID}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
        }),

        UpdateProfile: build.mutation<any, { userID: string; data: any; Token: string }>({
            query: ({ userID, data, Token }) => ({
                url: `/api/update-profile/${userID}`,
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
        }),

        Logout: build.mutation<{ message: string }, { token: string }>({
            query: (token) => ({
                url: `/api/logout`,
                method: "POST",
                body: token,
            }),
        }),
    }),
});

export const { useLoginMutation, useForgotPasswordMutation, useVerifyOTPMutation, useChangePasswordMutation, useGetProfileQuery, useUpdateProfileMutation, useLogoutMutation } = AuthSlice;
