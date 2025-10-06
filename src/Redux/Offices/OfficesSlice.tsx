import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {CreateOfficeRequest, CreateOfficeResponse, GetOfficeRequest, GetOfficeResponse, GetSingleOfficeRequest, GetSingleOfficeResponse, UpdateOfficeRequest} from "./OfficesTypes";

export const OfficeSlice = createApi({
	reducerPath: "OfficeSlice",
	baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_PORT}),
	tagTypes: ["CreateOffice", "UpdateOffice"],
	endpoints: (build) => ({
		CreateOffice: build.mutation<CreateOfficeResponse, CreateOfficeRequest>({
			query: ({data, Token}) => ({
				url: `/api/office/create-office`,
				method: "POST",
				body: data,
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
			invalidatesTags: ["CreateOffice"],
		}),

		GetAllOffices: build.query<GetOfficeResponse, GetOfficeRequest>({
			query: ({AgencyID, Token, page, limit, search = ""}) => ({
				url: `/api/office/${AgencyID}/get-all-offices?page=${page}&limit=${limit}&search[officeName]=${search}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
			providesTags: ["CreateOffice", "UpdateOffice"],
		}),

		UpdateOffices: build.mutation<GetOfficeResponse, UpdateOfficeRequest>({
			query: ({AgencyID, officeID, Token, data}) => ({
				url: `/api/office/${AgencyID}/update-office/${officeID}`,
				method: "PATCH",
				body: data,
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
			invalidatesTags: ["UpdateOffice"],
		}),

		GetSingleOffice: build.query<GetSingleOfficeResponse, GetSingleOfficeRequest>({
			query: ({AgencyID, OfficeID, parcelCountMonth, parcelCountYear, transactionStatsYear, revenueYear, Token}) => ({
				url: `/api/office/${AgencyID}/single-office/${OfficeID}?parcelCountMonth=${parcelCountMonth}&parcelCountYear=${parcelCountYear}&transactionStatsYear=${transactionStatsYear}&revenueYear=${revenueYear}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
			providesTags: ["UpdateOffice"],
		}),
	}),
});

export const {useCreateOfficeMutation, useGetAllOfficesQuery, useUpdateOfficesMutation, useGetSingleOfficeQuery} = OfficeSlice;
