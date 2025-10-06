import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {GetTransactionRequest, GetTransactionResponse} from "./TransactionTypes";

export const TransactionSlice = createApi({
	reducerPath: "TransactionSlice",
	baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_PORT}),
	endpoints: (build) => ({
		GetTransaction: build.query<GetTransactionResponse, GetTransactionRequest>({
			query: ({Token, id, page, limit, search = ""}) => ({
				url: `/api/parcel/get-transactions?id=${id}&page=${page}&limit=${limit}&search[trackingID]=${search}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${Token}`,
				},
			}),
		}),
	}),
});

export const {useGetTransactionQuery} = TransactionSlice;
