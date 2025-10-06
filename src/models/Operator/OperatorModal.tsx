"use client";

import { ShowErrorToast, ShowSuccessToast, ShowWarningToast } from "@/components/Toast/Toast";
import { useCreateBulkOperatorMutation, useGetAllOperatorQuery, useGetInvitesQuery, useSignupOperatorMutation } from "@/Redux/Operator/OperatorSlice";

interface bulkInvite {
  AgencyID: string;
  OfficeID?: any;
  Token: string;
  Data: string[];
}
export const useSendBulkInvite = () => {
  const [BulkInviteAPI, { isLoading, isError, isSuccess, status }] = useCreateBulkOperatorMutation();
  const handleSendBulkInvite = async ({ AgencyID, OfficeID, Token, Data }: bulkInvite) => {
    try {
      const isDataHaveEmails = Data?.map((item) => item?.includes("@"));
      if (isDataHaveEmails.some((item) => item === false)) {
        return ShowWarningToast("Some email is not correct");
      }

      if (Data?.length === 0) {
        return ShowWarningToast("Please Add Emails");
      }

      if (!OfficeID) {
        return ShowWarningToast("Office ID is missing");
      }

      const res = await BulkInviteAPI({
        AgencyID,
        OfficeID,
        Token,
        data: { emails: Data },
      });

      if (!res.error) {
        ShowSuccessToast("Invite Send successfully");
      } else {
        ShowErrorToast((res?.error as any)?.data?.message);
      }
    } catch (error) {
      ShowErrorToast("Something went wrong");
    }
  };

  return { handleSendBulkInvite, isLoading, isError, isSuccess, status };
};

export const useSignupOperator = () => {
  const [SignupOperatorAPI, { isLoading, isError, isSuccess, status }] = useSignupOperatorMutation();
  const handleSignupOperator = async ({ Token, Data }: { Token: string; Data: { username: string; phone: string; password: string } }) => {
    try {
      const isDataHaveEmails = Object.values(Data).some((item) => item === "");
      if (isDataHaveEmails) {
        return ShowWarningToast("All fields are required");
      }

      const res = await SignupOperatorAPI({ data: Data, Token });

      if (!res.error) {
        ShowSuccessToast("Account Created successfully");
      } else {
        ShowErrorToast((res?.error as any)?.data?.message);
      }
    } catch (error) {
      ShowErrorToast("Something went wrong");
    }
  };

  return { handleSignupOperator, isLoading, isError, isSuccess, status };
};

export const useGetAllOperators = ({ AgencyID, OfficeID, Token }: { AgencyID: string; OfficeID: string; Token: string }) => {
  try {
    const { data, isError, isFetching, isLoading, refetch } = useGetAllOperatorQuery({ AgencyID, OfficeID, Token });

    return { data, isError, isFetching, isLoading, refetch };
  } catch (error) {
    ShowErrorToast("Something went wrong");
  }
};

export const useGetAllInvites = ({ AdminID, Token }: { AdminID: string; Token: string }) => {
  const { data, isError, isFetching, isLoading, refetch } = useGetInvitesQuery({ AdminID, Token });

  return { data, isError, isFetching, isLoading, refetch };
};
