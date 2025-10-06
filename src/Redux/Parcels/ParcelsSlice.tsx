import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateParcelType, GetOfficeParcelRequest, GetParcelFiltersResponse, GetParcelRequest, GetParcelResponse, GetSingleParcelResponse } from "./ParcelType";

export const ParcelSlice = createApi({
    reducerPath: "ParcelSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    tagTypes: ["GetAgencyParcel", "GetOfficeParcel", "updateParcel"],
    endpoints: (build) => ({
        GetAgencyParcel: build.query<GetParcelResponse, GetParcelRequest>({
            query: ({ agencyID, Token, limit, page }) => ({
                url: `/api/parcel/${agencyID}/get-agency-parcels?limit=${limit}&page=${page}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["GetAgencyParcel", "updateParcel"],
        }),

        GetOfficeParcel: build.query<GetParcelResponse, GetOfficeParcelRequest>({
            query: ({ agencyID, officeID, Token, limit, page }) => ({
                url: `/api/parcel/${agencyID}/get-office-parcels/${officeID}?limit=${limit}&page=${page}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["GetOfficeParcel", "updateParcel"],
        }),

        GetSingleParcel: build.query<GetSingleParcelResponse, { parcelID: string; Token: string }>({
            query: ({ parcelID, Token }) => ({
                url: `/api/parcel/${parcelID}/get-single-parcels`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
            providesTags: ["GetOfficeParcel", "updateParcel"],
        }),

        GetParcelFilters: build.query<GetParcelFiltersResponse, { search: { _id?: string; officeID?: string }; Token: string }>({
            query: ({ search, Token }) => ({
                url: `/api/parcel/filters-required-parcel`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
        }),

        CreateParcel: build.mutation<GetParcelFiltersResponse, { agencyID: string; officeID: string; data: FormData; Token: string }>({
            query: ({ agencyID, officeID, data, Token }) => ({
                url: `/api/parcel/${agencyID}/create-parcel/${officeID}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
        }),

        UpdateStatus: build.mutation({
            query: ({ parcelID, agencyID, officeID, updatedBy, Token, data }: { parcelID: string; agencyID: string; officeID: string; updatedBy: string; Token: string; data: {} }) => ({
                url: `/api/parcel/${agencyID}/${officeID}/${parcelID}/${updatedBy}/update-parcel-status`,
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                body: data,
            }),
            invalidatesTags: ["updateParcel"],
        }),
    }),
});

export const { useGetAgencyParcelQuery, useGetOfficeParcelQuery, useGetSingleParcelQuery, useGetParcelFiltersQuery, useCreateParcelMutation, useUpdateStatusMutation } = ParcelSlice;
