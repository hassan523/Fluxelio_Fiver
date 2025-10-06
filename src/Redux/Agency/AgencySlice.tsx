import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AgencySignupRequest, AgencySignupResponse, GetAllAgencyRequest, GetAllAgencyResponse, SelectAgencyRequest, SelectAgencyResponse} from "./AgencyTypes";

export const AgencySlice = createApi({
	reducerPath: "AgencySlice",
	baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_PORT}),
	endpoints: (build) => ({
		AgencyRegister: build.mutation<AgencySignupResponse, AgencySignupRequest>({
			query: (data) => ({
				url: `/api/agency/register-agency`,
				method: "POST",
				body: data,
			}),
		}),

		GetAllAgency: build.query<GetAllAgencyResponse, GetAllAgencyRequest>({
			query: ({limit, page, Token, status = "", search = ""}) => ({
				url: `/api/agency/get-all-agencies?page=${page}&limit=${limit}&search[status]=${status}&search[agencyName]=${search}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
		}),

		SelectAgency: build.query<SelectAgencyResponse, SelectAgencyRequest>({
			query: ({Token, _id = ""}) => ({
				url: `/api/agency/filter-office-by-agency?search[_id]=${_id}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
		}),
	}),
});

export const {useAgencyRegisterMutation, useGetAllAgencyQuery, useSelectAgencyQuery} = AgencySlice;
