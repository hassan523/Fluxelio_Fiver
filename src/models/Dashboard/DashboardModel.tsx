"use client";

import { ShowErrorToast, ShowSuccessToast, ShowWarningToast } from "@/components/Toast/Toast";
import { useGetDashboardQuery } from "@/Redux/Dashboard/DashboardSlice";
import { GetDashboardRequest } from "@/Redux/Dashboard/DashboardTypes";

export const useGetDashboard = ({ id, parcelCountMonth, parcelCountYear, transactionStatsYear, revenueYear, Token }: GetDashboardRequest) => {
  try {
    const { data, isError, isFetching, isLoading, refetch } = useGetDashboardQuery({
      id,
      parcelCountMonth,
      parcelCountYear,
      transactionStatsYear,
      revenueYear,
      Token,
    });

    return { data, isError, isFetching, isLoading, refetch };
  } catch (error) {
    ShowErrorToast("Something went wrong");
  }
};
