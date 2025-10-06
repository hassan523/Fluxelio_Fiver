"use client";

import {ShowErrorToast, ShowSuccessToast, ShowWarningToast} from "@/components/Toast/Toast";
import {useCreateUserMutation, useGetAllUserQuery} from "@/redux/Users/UserSlice";

export const useGetAllUser = ({agencyID, officeID, Token}: {agencyID: string; officeID: string; Token: string}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch} = useGetAllUserQuery({agencyID, officeID, Token});

		return {data, isError, isFetching, isLoading, refetch};
	} catch (error) {
		ShowErrorToast("Something went wrong");
	}
};

export const useCreateUser = () => {
	const [createUserApi, {isLoading, isError, isSuccess, status}] = useCreateUserMutation();

	const handleCreateUser = async ({agencyID, officeID, Token, username, country, countryCode, phone, email, password, createdBy}: {agencyID: string; officeID?: any; Token: string; username: string; country: string; countryCode: string; phone: string; email: string; password: string; createdBy: string}) => {
		try {
			if (username == "" || country == "" || phone == "" || email == "" || password == "" || createdBy == "") return ShowWarningToast("All fields are required");

			if (countryCode == "") return ShowWarningToast("Select a country From the list");

			const fixedPhone = phone.replace(/[^\d]/g, "");

			const res = await createUserApi({agencyID, officeID, Token, username, country, countryCode, phone: fixedPhone, email, password, createdBy});

			if (!res.error) {
				ShowSuccessToast("User Created successfully");
			} else {
				ShowErrorToast((res?.error as any)?.data?.message);
			}
		} catch (error) {
			ShowErrorToast("Something went wrong");
		}
	};

	return {handleCreateUser, isLoading, isError, isSuccess, status};
};
