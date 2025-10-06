"use client";
import React, { useEffect, useRef, useState } from "react";
import darkLogo from "../../../../public/Logo/logo-dark.png";
import lightLogo from "../../../../public/Logo/logo-light.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthLayout from "@/Layout/Auth/AuthLayout";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useForgotPassHandler, useVerifyOTPHandler } from "@/models/Auth/AuthModel";

const VerifyOTP = () => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpValues, setOtpValues] = useState("");
    const [timeLeft, setTimeLeft] = useState(59);
    const [email, setEmail] = useState("");

    const router = useRouter();

    const { data } = history?.state || {};

    useEffect(() => {
        if (data === "" || data === undefined || data === null) {
            return router.push("/forgotpassword");
        } else {
            setEmail(data?.identifier);
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const { ForgotPassword, isLoading: resendLoading } = useForgotPassHandler();
    const { VerifyOTPHandler, isLoading } = useVerifyOTPHandler();

    const handleOtpHandler = () => {
        VerifyOTPHandler({ identifier: email, otp: otpValues });
    };

    return (
        <AuthLayout>
            <div className="flex flex-col xl:gap-8 gap-3 items-center justify-center plusJakartaSans h-screen">
                <div className=" bg-layoutLightBG px-4 2xl:w-[35%] xl:w-[50%] md:w-[70%] w-[100%] flex items-center justify-center xl:py-[4rem] py-[2rem] rounded-md">
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex justify-start items-start">
                            <Image src={darkLogo} alt="Logo" width={200} height={110} />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-2.5 "></div>
                        <div className="flex flex-col gap-4">
                            <h2 className="uppercase font-bold text-darkText h2 text-start">Reset Password</h2>

                            <p className="text-darkText text-start ">Enter your email address and we'll send you an email with instructions to reset your password.</p>

                            <div className="flex flex-col gap-2 ">
                                <div className="flex gap-4 justify-center  max-[450px]:flex-wrap">
                                    <InputOTP maxLength={6} onChange={(value) => setOtpValues(value)} value={otpValues}>
                                        <InputOTPGroup className="gap-4">
                                            <InputOTPSlot index={0} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                            <InputOTPSlot index={1} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                            <InputOTPSlot index={2} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                            <InputOTPSlot index={3} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                            <InputOTPSlot index={4} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                            <InputOTPSlot index={5} className="border border-gray-500 w-12 h-12 rounded-sm text-black " />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <p className="plusJakartaSans font-medium text-text">Resend code in</p>
                                <p className="plusJakartaSans font-medium text-RoseRed">00:{timeLeft > 9 ? timeLeft : "0" + "" + timeLeft}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center px-4 flex-col gap-2">
                            <Button name="Verify" isLoading={isLoading} pClass="font-semibold" className="border border-BtnColorLight w-full" onClick={handleOtpHandler} />
                            {timeLeft === 0 && (
                                <Button
                                    isDark={false}
                                    name="Resend Code"
                                    isLoading={resendLoading}
                                    pClass="font-semibold"
                                    onClick={() => {
                                        ForgotPassword({ identifier: email });
                                        setTimeLeft(59);
                                    }}
                                    className="w-full"
                                />
                            )}
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

export default VerifyOTP;
