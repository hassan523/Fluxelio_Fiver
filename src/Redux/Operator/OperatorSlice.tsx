import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { bulkInvitationRequest, bulkInvitationResponse, GetAllInvitesResponse, GetAllOperatorsRequest, GetAllOperatorsResponse } from "./OperatorTypes";

export const OperatorSlice = createApi({
    reducerPath: "OperatorSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    tagTypes: ["BulkInvite", "SignupOperator"],
    endpoints: (build) => ({
        CreateBulkOperator: build.mutation<bulkInvitationResponse, bulkInvitationRequest>({
            query: ({ AgencyID, OfficeID, data, Token }) => ({
                url: `/api/invite/${AgencyID}/send-invitations/${OfficeID}`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            invalidatesTags: ["BulkInvite"],
        }),

        SignupOperator: build.mutation<bulkInvitationResponse, { data: { username: string; phone: string; password: string }; Token: string }>({
            query: ({ data, Token }) => ({
                url: `/api/operator/register-operator/${Token}`,
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            invalidatesTags: ["SignupOperator"],
        }),

        GetAllOperator: build.query<GetAllOperatorsResponse, GetAllOperatorsRequest>({
            query: ({ AgencyID, OfficeID, Token }) => ({
                url: `/api/operator/${AgencyID}/get-all-operators/${OfficeID}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["SignupOperator"],
        }),

        GetInvites: build.query<GetAllInvitesResponse, { AdminID: string; Token: string }>({
            query: ({ AdminID, Token }) => ({
                url: `/api/invite/${AdminID}/get-invitations`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["BulkInvite"],
        }),
    }),
});

export const { useCreateBulkOperatorMutation, useSignupOperatorMutation, useGetAllOperatorQuery, useGetInvitesQuery } = OperatorSlice;
