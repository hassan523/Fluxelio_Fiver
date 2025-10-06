import { handleValidationErrors } from "@/components/ErrorDisplay/ValidationErrors";
import { ShowErrorToast, ShowSuccessToast, ShowWarningToast } from "@/components/Toast/Toast";
import { useCreateTagsMutation, useGetAgencyTagsQuery, useGetAllTagsQuery, useGetTagsQuery, useUpdateTagStatusMutation } from "@/redux/Tags/TagsSlice";

export const useGetOperatorTags = ({ agencyID, officeID, Token, role }: { agencyID: string; officeID: string; Token: string; role: string }) => {
    try {
        const { data, isError, isFetching, isLoading, refetch, isSuccess } = useGetTagsQuery({ agencyID, officeID, Token }, { skip: !agencyID || !officeID || !Token || (role !== "Operator" && role !== "Agency") });

        return { data, isError, isFetching, isLoading, refetch, isSuccess };
    } catch (error) {
        ShowErrorToast("Something went wrong");
    }
};

export const useGetAllTags = ({ Token, role }: { Token: string; role: string }) => {
    try {
        const { data, isError, isFetching, isLoading, refetch, isSuccess } = useGetAllTagsQuery({ Token }, { skip: !Token || role !== "Admin" });

        return { data, isError, isFetching, isLoading, refetch, isSuccess };
    } catch (error) {
        ShowErrorToast("Something went wrong");
    }
};

export const useGetAgencyTags = ({ Token, agencyID, role }: { Token: string; role: string; agencyID: string }) => {
    try {
        const { data, isError, isFetching, isLoading, refetch, isSuccess } = useGetAgencyTagsQuery({ Token, agencyID }, { skip: !Token || role !== "Agency" });

        return { data, isError, isFetching, isLoading, refetch, isSuccess };
    } catch (error) {
        ShowErrorToast("Something went wrong");
    }
};

export const useCreateTags = () => {
    const [CreateTagAPI, { isLoading, isError }] = useCreateTagsMutation();

    const handleCreateTag = async ({ Token, agencyID, officeID, tagName }: { Token: string; agencyID: string; officeID: string; tagName: string }) => {
        try {
            if (isLoading) return;

            if (tagName == "") {
                return ShowWarningToast("Please Enter Tag Name");
            }

            if (agencyID == "") {
                return ShowWarningToast("Please Select Agency");
            }

            if (officeID == "") {
                return ShowWarningToast("Please Select Office");
            }

            const res = await CreateTagAPI({ agencyID, officeID, Token, data: { tagName } });

            if (!res.error) {
                ShowSuccessToast("Tag Created");
            } else {
                handleValidationErrors((res.error as any)?.data?.details);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { handleCreateTag, isError, isLoading };
};

export const useUpdateTagParcel = () => {
    const [updateTagAPI, { isLoading, isError }] = useUpdateTagStatusMutation();

    const handleUpdateTags = async ({ tagID, agencyID, officeID, updatedBy, Token, data }: { tagID: string; agencyID: string; officeID: string; updatedBy: string; Token: string; data: {} }) => {
        try {
            const res = await updateTagAPI({ tagID, agencyID, officeID, updatedBy, Token, data });

            if (!res.error) {
                ShowSuccessToast("Tag Update Successfully");
            } else if ((res?.error as any)?.data?.details) {
                handleValidationErrors((res.error as any)?.data?.details);
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { handleUpdateTags, isError, isLoading };
};
