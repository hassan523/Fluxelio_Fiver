import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateTagsRequest, CreateTagsResponse, GetTagsRequest, GetTagsResponse } from "./TagsTypes";

export const TagsSlice = createApi({
    reducerPath: "TagsSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    tagTypes: ["CreateTags", "updateTag"],
    endpoints: (build) => ({
        CreateTags: build.mutation<CreateTagsResponse, CreateTagsRequest>({
            query: ({ agencyID, officeID, Token, data }) => ({
                url: `/api/tags/${agencyID}/create-tag/${officeID}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
            invalidatesTags: ["CreateTags"],
        }),

        GetTags: build.query<GetTagsResponse, GetTagsRequest>({
            query: ({ agencyID, officeID, Token }) => ({
                url: `/api/tags/${agencyID}/get-tags/${officeID}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["CreateTags", "updateTag"],
        }),

        GetAllTags: build.query<GetTagsResponse, { Token: string }>({
            query: ({ Token }) => ({
                url: `/api/tags/get-all-tags`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["CreateTags", "updateTag"],
        }),

        GetAgencyTags: build.query<GetTagsResponse, { Token: string; agencyID: string }>({
            query: ({ Token, agencyID }) => ({
                url: `/api/tags/${agencyID}/get-agency-tags`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["CreateTags", "updateTag"],
        }),

        UpdateTagStatus: build.mutation({
            query: ({ tagID, agencyID, officeID, updatedBy, Token, data }: { tagID: string; agencyID: string; officeID: string; updatedBy: string; Token: string; data: {} }) => ({
                url: `/api/parcel/${agencyID}/${officeID}/${tagID}/${updatedBy}/bulk-update-parcel-status`,
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
            invalidatesTags: ["updateTag"],
        }),
    }),
});

export const { useCreateTagsMutation, useGetTagsQuery, useGetAllTagsQuery, useGetAgencyTagsQuery, useUpdateTagStatusMutation } = TagsSlice;
