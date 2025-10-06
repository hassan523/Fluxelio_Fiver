"use client";

import { ShowErrorToast, ShowSuccessToast, ShowWarningToast } from "@/components/Toast/Toast";
import { useChangePasswordMutation, useForgotPasswordMutation, useGetProfileQuery, useLoginMutation, useLogoutMutation, useUpdateProfileMutation, useVerifyOTPMutation } from "@/redux/Auth/AuthSlice";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export const useLoginHandler = () => {
    const [login, { isLoading }] = useLoginMutation();
    const router = useRouter();

    const Login = async (data: { identifier: string; password: string }) => {
        try {
            if (data?.identifier === "" || data?.password === "") {
                return ShowWarningToast("All fields required");
            }

            const res = await login(data);

            if (!res.error) {
                ShowSuccessToast("Logged in successfully");

                const encoded = encodeURIComponent(JSON.stringify(res));

                document.cookie = `fluxelio=${encoded}; path=/;`;

                window.location.replace("/dashboard");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { Login, isLoading };
};

export const useForgotPassHandler = () => {
    const [forgotpass, { isLoading }] = useForgotPasswordMutation();
    const router = useRouter();

    const ForgotPassword = async (data: { identifier: string }) => {
        try {
            if (data?.identifier === "") {
                return ShowWarningToast("All fields required");
            }

            const res = await forgotpass(data);

            if (!res.error) {
                history?.pushState({ data: data }, "", "/verify-otp");
                router.push("/verify-otp");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { ForgotPassword, isLoading };
};

export const useVerifyOTPHandler = () => {
    const [VerifyOtp, { isLoading }] = useVerifyOTPMutation();
    const router = useRouter();

    const VerifyOTPHandler = async (data: { identifier: string; otp: string }) => {
        try {
            if (data?.identifier === "" || data?.otp === "") {
                return ShowWarningToast("Please Enter OTP");
            }

            const res = await VerifyOtp(data);

            if (!res.error) {
                history?.pushState({ data: data }, "", "/reset-password");
                router.push("/reset-password");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { VerifyOTPHandler, isLoading };
};
export const useChangePasswordHandler = () => {
    const [ChangePassword, { isLoading }] = useChangePasswordMutation();
    const router = useRouter();

    const ChangePasswordHandler = async (data: { identifier: string; otp: string; newPassword: string; confirmPassword: string }) => {
        try {
            const { identifier, newPassword, otp, confirmPassword } = data;

            if (newPassword !== confirmPassword) {
                return ShowWarningToast("Password must be same");
            }

            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{1,}$/;

            if (!regex.test(newPassword)) {
                return ShowErrorToast("Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.");
            }

            const res = await ChangePassword({
                identifier,
                newPassword,
                otp,
            });

            if (!res.error) {
                router.push("/login");
                ShowSuccessToast("Password Updated Successfully");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { ChangePasswordHandler, isLoading };
};

export const useUpdateProfileHandler = () => {
    const [UpdateProfile, { isLoading }] = useUpdateProfileMutation();

    const UpdateProfileHandler = async ({ data, userID, Token }: { data: any; userID: string; Token: string }) => {
        try {
            const res = await UpdateProfile({
                userID,
                Token,
                data: data,
            });

            if (!res.error) {
                ShowSuccessToast("Profile Updated Successfully");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { UpdateProfileHandler, isLoading };
};

export const useLogoutHandler = () => {
    const [logoutAPI] = useLogoutMutation();
    const router = useRouter();

    const Logout = async (token: string) => {
        try {
            const res = await logoutAPI({ token });

            if (!res.error) {
                deleteCookie("fluxelio");
                router.push("/login");
                document.cookie = "fluxelio; Max-Age=0; path=/";
                window.location.replace("/login");
            } else {
                ShowErrorToast((res?.error as any)?.data?.message);
            }
        } catch (error) {
            ShowErrorToast("Something went wrong");
        }
    };

    return { Logout };
};

export const useGetProfileHandler = (userID: string, Token: string) => {
    const { data, isLoading, isError, isSuccess } = useGetProfileQuery({ userID, Token }, { skip: !userID });
    return { data, isLoading, isError, isSuccess };
};
