"use client";

import { handleValidationErrors } from "@/components/ErrorDisplay/ValidationErrors";
import { ShowErrorToast, ShowSuccessToast, ShowWarningToast } from "@/components/Toast/Toast";
import { useAgencyRegisterMutation, useGetAllAgencyQuery, useSelectAgencyQuery } from "@/Redux/Agency/AgencySlice";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export const useCreateAgencyHandler = () => {
  const [CreateAgency, { isLoading }] = useAgencyRegisterMutation();
  const router = useRouter();

  const HandleCreateAgency = async (data: { username: string; email: string; agencyName: string; password: string; confirmPassword: string }) => {
    try {
      const { agencyName, email, password, username, confirmPassword } = data;

      if (agencyName === "" || password === "" || username === "" || email === "" || confirmPassword === "") {
        return ShowWarningToast("All fields required");
      }

      if (confirmPassword !== password) {
        return ShowWarningToast("Password must be same");
      }

      const res = await CreateAgency({
        agencyName,
        email,
        password,
        username,
      });

      if (!res.error) {
        ShowSuccessToast("Agency Created in successfully");
        setCookie("fluxelio", res);
        router.push("/dashboard");
      } else {
        handleValidationErrors((res.error as any)?.data?.details);
        // ShowErrorToast((res?.error as any)?.message);
      }
    } catch (error) {
      ShowErrorToast("Something went wrong");
    }
  };

  return { HandleCreateAgency, isLoading };
};

export const useGetAllAgencies = ({ page, limit, Token, status, search }: { page: number; limit: number; Token: string; status: string; search: string }) => {
  try {
    const { data, isError, isFetching, isLoading, refetch } = useGetAllAgencyQuery({ page, limit, Token, status, search });

    return { data, isError, isFetching, isLoading, refetch };
  } catch (error) {
    ShowErrorToast("Something went wrong");
  }
};

export const useSelectAgencies = ({ Token, _id }: { Token: string; _id: string }) => {
  try {
    const { data, isError, isFetching, isLoading, refetch } = useSelectAgencyQuery({ Token, _id }, { skip: !Token });

    return { data, isError, isFetching, isLoading, refetch };
  } catch (error) {
    ShowErrorToast("Something went wrong");
  }
};
