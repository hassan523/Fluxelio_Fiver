"use client";

import {handleValidationErrors} from "@/components/ErrorDisplay/ValidationErrors";
import {ShowErrorToast, ShowSuccessToast, ShowWarningToast} from "@/components/Toast/Toast";
import {useCreateParcelMutation, useGetAgencyParcelQuery, useGetOfficeParcelQuery, useGetParcelFiltersQuery, useGetSingleParcelQuery, useUpdateStatusMutation} from "@/redux/Parcels/ParcelsSlice";
import {CreateParcelType} from "@/redux/Parcels/ParcelType";

export const useGetAgencyParcel = ({agencyID, Token, role, limit, page}: {agencyID: string; Token: string; role: string; limit: number; page: number}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch, error} = useGetAgencyParcelQuery({agencyID, Token, limit, page}, {skip: role != "Agency"});

		return {data, isError, isFetching, isLoading, refetch, error};
	} catch (error) {
		console.log(error);
		ShowErrorToast("Something went wrong");
	}
};

export const useGetOfficeParcel = ({agencyID, officeID, Token, role, limit, page}: {agencyID: string; officeID: string; Token: string; role: string; limit: number; page: number}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch, error} = useGetOfficeParcelQuery({agencyID, officeID, Token, limit, page}, {skip: role != "Admin" && role != "Operator" && role != "Agency"});

		return {data, isError, isFetching, isLoading, refetch, error};
	} catch (error) {
		ShowErrorToast("Something went wrong");
	}
};
export const useGetSingleParcel = ({parcelID, Token}: {parcelID: string; Token: string}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch, error} = useGetSingleParcelQuery({parcelID, Token});

		return {data, isError, isFetching, isLoading, refetch, error};
	} catch (error) {
		ShowErrorToast("Something went wrong");
		console.error(error);
	}
};

export const useGetParcelFilters = ({search, Token}: {search: {_id?: string; officeID?: string}; Token: string}) => {
	try {
		const {data, isError, isFetching, isLoading, refetch, error} = useGetParcelFiltersQuery({search, Token});

		return {data, isError, isFetching, isLoading, refetch, error};
	} catch (error) {
		ShowErrorToast("Something went wrong");
	}
};

export const useCreateParcelApi = () => {
	const [CreateParcelAPI, {isLoading, isError, error, isSuccess}] = useCreateParcelMutation();

	const handleCreateParcel = async ({createdBy, agencyID, officeID, data, Token}: {createdBy: string; agencyID: string; officeID: string; data: CreateParcelType; Token: string}) => {
		try {
			const requiredFields = [
				{field: data.weight, name: "Weight"},
				{field: data.pricePerKilo, name: "Price Per Kilo"},
				{field: data.officeID, name: "Office"},
				{field: data.customerID, name: "Customer"},
				{field: data.transportMethod, name: "Transport Method"},
				{field: data.destinationID, name: "Destination"},
				{field: data.estimateArrival, name: "Estimate Arrival"},
				{field: data.description, name: "Description"},
			];

			const missingFields = requiredFields.filter((item) => !item.field);

			if (missingFields.length > 0) {
				ShowWarningToast(`Please fill all required fields: ${missingFields.map((f) => f.name).join(", ")}`);
				return;
			}

			// if (data.packagePictures.length === 0) {
			// 	ShowWarningToast("Please upload at least one package picture");
			// 	return;
			// }

			const formData = new FormData();
			formData.append("weight", data.weight);
			formData.append("customerID", data.customerID);
			formData.append("transportMethod", data.transportMethod);
			formData.append("destinationID", data.destinationID);
			formData.append("tagID", data.tagID);
			formData.append("estimateArrival", data.estimateArrival);
			formData.append("description", data.description);
			formData.append("mixedPackage", String(data.mixedPackage));
			formData.append("whatsappNotif", String(data.whatsappNotif));
			formData.append("notificationCost", data.notificationCost);
			formData.append("pricePerKilo", data.pricePerKilo);
			formData.append("actualCarrierCost", data.actualCarrierCost);
			formData.append("paymentStatus", data.paymentStatus);
			formData.append("status", data.status);
			formData.append("createdBy", createdBy);
			formData.append("partialAmount", data.partialAmount);
			data.packagePictures.forEach((file: any, index: number) => {
				formData.append(`packagePicture`, file);
			});

			const res = await CreateParcelAPI({agencyID, officeID, data: formData, Token});

			if (!res.error) {
				ShowSuccessToast("Parcel Created Successfully");
			} else {
				handleValidationErrors((res.error as any)?.data?.details);
			}
		} catch (error) {
			ShowErrorToast("Something went wrong");
		}
	};

	return {handleCreateParcel, isLoading, isError, error, isSuccess};
};

export const useUpdateParcel = () => {
	const [updateParcelAPI, {isLoading, isError}] = useUpdateStatusMutation();

	const handleUpdateParcel = async ({parcelID, agencyID, officeID, updatedBy, Token, data}: {parcelID: string; agencyID: string; officeID: string; updatedBy: string; Token: string; data: {}}) => {
		try {
			const res = await updateParcelAPI({parcelID, agencyID, officeID, updatedBy, Token, data});

			if (!res.error) {
				ShowSuccessToast("Status Update Successfully");
			} else if ((res?.error as any)?.data?.details) {
				handleValidationErrors((res.error as any)?.data?.details);
			} else {
				ShowErrorToast((res?.error as any)?.data?.message);
			}
		} catch (error) {
			ShowErrorToast("Something went wrong");
		}
	};

	return {handleUpdateParcel, isError, isLoading};
};
