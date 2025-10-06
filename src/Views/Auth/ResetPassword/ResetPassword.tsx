"use client";

import React, { useEffect, useState } from "react";
import darkLogo from "../../../../public/Logo/logo-dark.png";
import lightLogo from "../../../../public/Logo/logo-light.png";
import { useRouter } from "next/navigation";
import AuthLayout from "@/Layout/Auth/AuthLayout";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import Image from "next/image";
import { useChangePasswordHandler } from "@/models/Auth/AuthModel";

interface resetPassswordState {
    otp: string;
    newPassword: string;
    confirmPassword: string;
    identifier: string;
}

const ResetPassword = () => {
    const [data, setData] = useState<resetPassswordState>({
        otp: "",
        newPassword: "",
        confirmPassword: "",
        identifier: "",
    });

    const { newPassword, confirmPassword } = data;
    const router = useRouter();

    const handleFields = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const { data: historyData } = history?.state || {};
    const { identifier, otp } = historyData || {};

    useEffect(() => {
        const ifEmailNotExist = identifier === "" || identifier === undefined || identifier === null;
        const ifOtpNotExist = otp === "" || otp === undefined || otp === null;
        if (ifOtpNotExist || ifEmailNotExist) {
            return router.push("/forgotpassword");
        } else {
            setData((prev) => ({ ...prev, identifier, otp }));
        }
    }, []);

    const { ChangePasswordHandler, isLoading } = useChangePasswordHandler();

    const handleChangePassword = () => {
        ChangePasswordHandler(data);
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen">
                <div className=" bg-layoutLightBG px-4 2xl:w-[35%] xl:w-[50%] md:w-[70%] w-[100%] flex items-center justify-center xl:py-[5rem] py-[2rem] rounded-md">
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex justify-start items-start">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 ">
                                <h2 className="uppercase font-bold  text-darkText h2">Reset Password</h2>
                                <p className="text-darkText text-start ">Set a new password to secure your account.</p>
                                <Field isDark={false} placeHolder="Password" type="password" isIcon className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="newPassword" value={newPassword} disabled={false} />
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <Field isDark={false} placeHolder="Re Enter Password" type="password" isIcon className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} inputCustomClass="text-sm w-full" onChange={handleFields} name="confirmPassword" value={confirmPassword} disabled={false} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center ">
                            <Button isDark={false} name="Reset" pClass="font-semibold" onClick={handleChangePassword} isLoading={isLoading} className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
