"use client";

import {ShowErrorToast, ShowSuccessToast, ShowWarningToast} from "@/components/Toast/Toast";
import {useCreateOfficeMutation, useGetAllOfficesQuery, useGetSingleOfficeQuery, useUpdateOfficesMutation} from "@/redux/Offices/OfficesSlice";
import {CreateOfficeState, UpdateOfficeState} from "@/redux/Offices/OfficesTypes";

export const useGetAllOffices = ({page, limit, AgencyID, Token, search}: {page: number; limit: number; AgencyID: string; Token: string; search: string}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch} = useGetAllOfficesQuery({page, limit, AgencyID, Token, search}, {skip: !AgencyID || !Token});

		return {data, isError, isFetching, isLoading, refetch};
	} catch (error) {
		ShowErrorToast("Something went wrong");
	}
};

// Create Office
export const useCreateOffices = () => {
	const [CreateOfficeAPI, {isLoading, isError, isSuccess, status}] = useCreateOfficeMutation();

	const handleCreateOffice = async ({data, Token}: {data: CreateOfficeState; Token: string}) => {
		try {
			const isEmpty = Object.values(data).some((e) => e === "");
			const AddressisEmpty = Object.values(data?.address).some((e) => e === "");
			const TimeisEmpty = data?.openingHours?.length === 0;

			if (isEmpty && AddressisEmpty && TimeisEmpty) {
				return ShowWarningToast("All Fields Required");
			}

			if (AddressisEmpty && TimeisEmpty) {
				return ShowWarningToast("Please complete your address and time slot");
			}

			if (AddressisEmpty && isEmpty) {
				return ShowWarningToast("Please complete your office information and address");
			}

			if (TimeisEmpty && isEmpty) {
				return ShowWarningToast("Please complete your office information and time slot");
			}

			if (AddressisEmpty) {
				return ShowWarningToast("Please complete your address");
			}

			if (TimeisEmpty) {
				return ShowWarningToast("Please add atleast 1 time slot");
			}

			if (isEmpty) {
				return ShowWarningToast("Please add your office information");
			}
			const res = await CreateOfficeAPI({data, Token});

			if (!res.error) {
				ShowSuccessToast("Office Created successfully");
			} else {
				ShowErrorToast((res?.error as any)?.data?.message);
			}
		} catch (error) {
			ShowErrorToast("Something went wrong");
		}
	};
	return {handleCreateOffice, isLoading, isError, isSuccess, status};
};

// Update Office
export const useUpdateOffices = () => {
	const [UpdateOfficeAPI, {isLoading: UpdateLoading, isError: UpdateError, isSuccess, status}] = useUpdateOfficesMutation();

	const handleUpdateOffice = async ({data, Token, AgencyID, officeID}: {data: UpdateOfficeState; Token: string; AgencyID: string; officeID: string}) => {
		try {
			const isEmpty = Object.values(data).some((e) => e === "");
			const AddressisEmpty = Object.values(data?.address).some((e) => e === "");
			const TimeisEmpty = data?.openingHours?.length === 0;

			if (isEmpty && AddressisEmpty && TimeisEmpty) {
				return ShowWarningToast("All Fields Required");
			}

			if (AddressisEmpty && TimeisEmpty) {
				return ShowWarningToast("Please complete your address and time slot");
			}

			if (AddressisEmpty && isEmpty) {
				return ShowWarningToast("Please complete your office information and address");
			}

			if (TimeisEmpty && isEmpty) {
				return ShowWarningToast("Please complete your office information and time slot");
			}

			if (AddressisEmpty) {
				return ShowWarningToast("Please complete your address");
			}

			if (TimeisEmpty) {
				return ShowWarningToast("Please add atleast 1 time slot");
			}

			if (isEmpty) {
				return ShowWarningToast("Please add your office information");
			}
			const res = await UpdateOfficeAPI({AgencyID, officeID, Token, data});

			if (!res.error) {
				ShowSuccessToast("Office Update successfully");
			} else {
				ShowErrorToast((res?.error as any)?.data?.message);
			}
		} catch (error) {
			ShowErrorToast("Something went wrong");
		}
	};
	return {handleUpdateOffice, UpdateLoading, UpdateError, isSuccess, status};
};

// Get Single Office
export const useGetSingleOffice = ({AgencyID, OfficeID, parcelCountMonth, parcelCountYear, transactionStatsYear, revenueYear, Token}: {AgencyID: string; OfficeID: string; parcelCountMonth: number; parcelCountYear: number; transactionStatsYear: number; revenueYear: number; Token: string}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch} = useGetSingleOfficeQuery(
			{
				AgencyID,
				OfficeID,
				parcelCountMonth,
				parcelCountYear,
				transactionStatsYear,
				revenueYear,
				Token,
			},
			{skip: !AgencyID || !OfficeID || !Token}
		);

		return {data, isError, isFetching, isLoading, refetch};
	} catch (error) {
		ShowErrorToast("Something went wrong");
	}
};
