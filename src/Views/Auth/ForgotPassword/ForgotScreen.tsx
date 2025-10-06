"use client";
import React, { useState } from "react";
import darkLogo from "../../../../public/Logo/logo-dark.png";
import lightLogo from "../../../../public/Logo/logo-light.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/Layout/Auth/AuthLayout";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import { useForgotPassHandler } from "@/models/Auth/AuthModel";

const ForgotScreen = () => {
    const [email, setEmail] = useState<string>("");

    const router = useRouter();

    const { ForgotPassword, isLoading } = useForgotPassHandler();

    const handleForgotPass = () => {
        ForgotPassword({ identifier: email });
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen">
                <div className=" bg-layoutLightBG px-4 2xl:w-[35%] xl:w-[50%] md:w-[70%] w-[100%] flex items-center justify-center xl:py-[4rem] py-[2rem] rounded-md">
                    <div className="flex flex-col gap-7 w-full">
                        <div className="flex justify-start items-center">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-2.5 ">
                            <h2 className="uppercase font-bold  text-darkText h2 text-start">Reset Password</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 ">
                                <p className="text-darkText text-start ">Enter your email address and we'll send you an email with instructions to reset your password.</p>
                                <Field isDark={false} placeHolder="Enter Your Email" type="email" inputCustomClass="w-full" className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={(e: any) => setEmail(e.target.value)} name="email" value={email} disabled={false} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center ">
                            <Button isLoading={isLoading} isDark={false} name="Reset Password" pClass="font-semibold" onClick={handleForgotPass} className="w-full" />
                        </div>
                        <div className="flex gap-1 text-darkText items-center justify-center">
                            <p>Back to</p>
                            <Link href={"/login"} className="font-bold underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotScreen;
