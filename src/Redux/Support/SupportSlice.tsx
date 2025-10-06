import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetSingleSupport, GetSupport } from "./SupportTypes";

export const SupportSlice = createApi({
    reducerPath: "SupportSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    tagTypes: ["Update", "Create"],
    endpoints: (build) => ({
        CreateSupportTickets: build.mutation<{ message: string }, { CreatedBy: string; Token: string; data: FormData }>({
            query: ({ CreatedBy, Token, data }) => ({
                url: `/api/support/submit-ticket/${CreatedBy}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
            invalidatesTags: ["Create"],
        }),

        GetSupportTickets: build.query<GetSupport, { AdminID: string; Token: string }>({
            query: ({ AdminID, Token }) => ({
                url: `/api/support/${AdminID}/get-tickets`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["Update", "Create"],
        }),

        UpdateSupport: build.mutation<{ message: string }, { AdminID: string; Token: string; TicketID: string; data: { status: string } }>({
            query: ({ AdminID, TicketID, Token, data }) => ({
                url: `/api/support/${AdminID}/update-ticket-status/${TicketID}`,
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
            invalidatesTags: ["Update"],
        }),

        GetSingleSupport: build.query<GetSingleSupport, { AdminID: string; Token: string; TicketID: string }>({
            query: ({ AdminID, TicketID, Token }) => ({
                url: `/api/support/${AdminID}/get-single-ticket/${TicketID}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["Update"],
        }),
    }),
});

export const { useCreateSupportTicketsMutation, useGetSupportTicketsQuery, useUpdateSupportMutation, useGetSingleSupportQuery } = SupportSlice;
