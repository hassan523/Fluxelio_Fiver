"use client";
import React, { useState } from "react";
import darkLogo from "../../../../public/Logo/logo-dark.png";
import lightLogo from "../../../../public/Logo/logo-light.png";
import { useRouter } from "next/navigation";
import AuthLayout from "@/Layout/Auth/AuthLayout";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import Image from "next/image";
import Link from "next/link";
import { useCreateAgencyHandler } from "@/models/Agency/AgencyModel";

interface signupFieldsState {
    username: string;
    email: string;
    agencyName: string;
    password: string;
    confirmPassword: string;
}

const SignupScreen = () => {
    const [signupFields, setSignupFields] = useState<signupFieldsState>({
        username: "",
        email: "",
        agencyName: "",
        password: "",
        confirmPassword: "",
    });
    const router = useRouter();

    const { username, email, agencyName, password, confirmPassword } = signupFields;
    const { HandleCreateAgency, isLoading } = useCreateAgencyHandler();

    const handleFields = (e: any) => {
        setSignupFields({ ...signupFields, [e.target.name]: e.target.value });
    };

    const handleAgency = (e: any): void => {
        e.preventDefault();
        HandleCreateAgency(signupFields);
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen w-full">
                <div className="bg-layoutLightBG px-6 py-8 w-full max-w-md mx-auto rounded-md">
                    <form onSubmit={(e) => handleAgency(e)} className="flex flex-col gap-6 w-full">
                        <div className="flex justify-start items-start">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>

                        <div className="flex flex-col gap-4 max-h-[45vh] overflow-y-auto pr-2">
                            <div className="flex flex-col gap-3">
                                <h2 className="uppercase font-bold text-darkText text-2xl text-start">Sign Up</h2>
                                <p className="text-darkText text-start">New to our platform? Sign up now! It only takes a minute.</p>
                                <Field isDark={false} placeHolder="Enter Your User Name" type="text" isIcon className="gap-2" styles={{ outline: "none", width: "100%" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="username" value={username} disabled={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field isDark={false} placeHolder="Enter Your Email (Optional)" type="email" isIcon className="gap-2" styles={{ outline: "none", width: "100%" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="email" value={email} disabled={false} required={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field isDark={false} placeHolder="Enter Your Agency Name" type="text" isIcon className="gap-2" styles={{ outline: "none", width: "100%" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="agencyName" value={agencyName} disabled={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field isDark={false} placeHolder="Enter Your Password" type="password" isIcon className="gap-2" styles={{ outline: "none", width: "100%" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="password" value={password} disabled={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field isDark={false} placeHolder="Re-enter Password" type="password" isIcon className="gap-2" styles={{ outline: "none", width: "100%" }} divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="confirmPassword" value={confirmPassword} disabled={false} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button name="Sign Up" pClass="font-semibold" isDark={false} type="submit" isLoading={isLoading} className="w-full" />
                        </div>
                        <div className="flex gap-1 text-darkText items-center justify-center">
                            <p>I already have an account</p>
                            <Link href={"/login"} className="font-bold underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignupScreen;
