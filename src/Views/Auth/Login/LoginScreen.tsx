"use client";

import React, { useState } from "react";
import darkLogo from "../../../../public/Logo/logo-dark.png";
import { useRouter } from "next/navigation";
import AuthLayout from "@/Layout/Auth/AuthLayout";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import Image from "next/image";
import Link from "next/link";
import { useLoginHandler } from "@/models/Auth/AuthModel";
import { useTheme } from "next-themes";
import { getCookie } from "cookies-next";

interface loginFieldsState {
    identifier: string;
    password: string;
}

const LoginScreen = () => {
    const [loginFields, setLoginFields] = useState<loginFieldsState>({
        identifier: "",
        password: "",
    });

    const { identifier, password } = loginFields;

    const router = useRouter();
    const { setTheme, theme } = useTheme();

    const { Login, isLoading } = useLoginHandler();

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const RefreshToken = cookiesData?.data?.refreshToken;

    const handleFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        Login(loginFields);
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen">
                <div className="bg-layoutLightBG px-4 2xl:w-[35%] xl:w-[50%] md:w-[70%] w-[100%] flex items-center justify-center xl:py-[5rem] py-[2rem] rounded-md ">
                    <form className="flex flex-col gap-6 w-full" onSubmit={(e) => handleLogin(e)}>
                        <div className="flex justify-start items-start">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 ">
                                <h2 className="uppercase font-bold text-black h2 ">Sign In</h2>
                                <p className="text-darkText text-start ">Enter your identifier address and password to access admin panel.</p>
                                <Field placeHolder="Enter Your Email" type="text" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="identifier" value={identifier} disabled={false} isDark={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field placeHolder="Enter Your Password" type="password" className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} inputCustomClass="text-sm w-full" onChange={handleFields} name="password" value={password} disabled={false} isDark={false} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="accent-primary" />
                                    <span className="flex items-center gap-0.5">
                                        <p className="leading-4 text-darkText">Remember me</p>
                                    </span>
                                </div>
                                <span className="flex justify-end items-end">
                                    <label className="text-sm  text-darkText underline decoration-dotted cursor-pointer text-end" onClick={() => router.push("/forgotpassword")}>
                                        Reset password
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center ">
                            <Button name="Sign In" pClass="font-semibold" type="submit" isDark={false} isLoading={isLoading} className="w-full" />
                        </div>
                        <div className="flex gap-1 text-darkText items-center justify-center">
                            <p>New Here?</p>
                            <Link href={"/sign-up"} className="font-bold underline">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginScreen;
