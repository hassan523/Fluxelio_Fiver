"use client";
import Layout from "@/Layout/Dashboard/Layout";
import Image from "next/image";
import React from "react";
import SplashImg from "../../../../public/Support/SupportSplash.png";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";

const SplashSupport = () => {
    const router = useRouter();
    return (
        <Layout isField={false}>
            <div className="gap-4 mt-5 flex flex-col items-center justify-center h-[90%]">
                <Image src={SplashImg} width={1000} height={1000} alt="Support" className="w-[70vh] h-auto text-[70vh]" loading="lazy" quality={100} />
                <div className="flex flex-col gap-4 items-center justify-center">
                    <h1 className="xl:text-6xl lg:text-4xl sm:text-2xl text-lg font-semibold">Welcome to Support System</h1>
                    <p className="md:w-[40vw] w-[60vw] text-center">Need assistance? If you’re facing any difficulties or need assistance with our platform, we’re here to guide you every step of the way and ensure a smooth experience.</p>
                    <div className="w-[12rem] ">
                        <Button name={"Get Started"} onClick={() => router.push("/support/create-support")} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SplashSupport;
