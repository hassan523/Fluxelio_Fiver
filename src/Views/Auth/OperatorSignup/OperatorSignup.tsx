"use client";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import darkLogo from "../../../../public/Logo/logo-dark.png";

import AuthLayout from "@/Layout/Auth/AuthLayout";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSignupOperator } from "@/models/Operator/OperatorModal";

interface OperatorFieldsState {
    username: string;
    phone: string;
    password: string;
}

const OperatorSignup = () => {
    const [operatorFields, setOperatorFields] = useState<OperatorFieldsState>({
        username: "",
        phone: "",
        password: "",
    });

    const { username, phone, password } = operatorFields;

    const router = useRouter();
    const { token } = useParams();
    const TokenStr = Array.isArray(token) ? token[0] : token || "";

    useEffect(() => {
        if (token === "" || token === null || token === undefined) {
            router.push("/login");
        }
    }, []);

    const handleFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setOperatorFields({ ...operatorFields, [e.target.name]: e.target.value });
    };

    const { handleSignupOperator, isLoading } = useSignupOperator();

    const handleOperator = (e: any) => {
        e.preventDefault();
        handleSignupOperator({ Data: operatorFields, Token: TokenStr });
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen">
                <div className="bg-layoutLightBG px-4 2xl:w-[35%] xl:w-[50%] md:w-[70%] w-[100%] flex items-center justify-center xl:py-[5rem] py-[2rem] rounded-md ">
                    <form className="flex flex-col gap-7 w-full" onSubmit={(e) => handleOperator(e)}>
                         <div className="flex justify-center items-center">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-2.5">
                            <h2 className="uppercase font-bold text-black h2 ">Register Account</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 ">
                                <p className="text-darkText text-start ">Welcome to our platform? Sign up now as a operator.</p>
                                <Field placeHolder="Enter Your User Name" type="text" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleFields} name="username" value={username} disabled={false} isDark={false} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Field placeHolder="Enter Your Phone" type="number" className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} inputCustomClass="text-sm w-full" onChange={handleFields} name="phone" value={phone} disabled={false} isDark={false} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Field placeHolder="Enter Your Password" type="password" className="gap-2" styles={{ outline: "none" }} divStyle={{ padding: "0.75rem 0.8rem" }} inputCustomClass="text-sm w-full" onChange={handleFields} name="password" value={password} disabled={false} isDark={false} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center ">
                            <Button name="Create Account" pClass="font-semibold" type="submit" isDark={false} isLoading={isLoading} />
                        </div>
                        <div className="flex gap-1 text-darkText items-center justify-center">
                            <p>Already have an account?</p>
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

export default OperatorSignup;
