import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetDashboardRequest, GetDashboardResponse } from "./DashboardTypes";

export const DashboardSlice = createApi({
    reducerPath: "DashboardSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
    endpoints: (build) => ({
        GetDashboard: build.query<GetDashboardResponse, GetDashboardRequest>({
            query: ({ id, parcelCountMonth, parcelCountYear, transactionStatsYear, revenueYear, Token }) => ({
                url: `/api/dashboard?id=${id}&parcelCountMonth=${parcelCountMonth}&parcelCountYear=${parcelCountYear}&transactionStatsYear=${transactionStatsYear}&revenueYear=${revenueYear}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }),
        }),
    }),
});

export const { useGetDashboardQuery } = DashboardSlice;
