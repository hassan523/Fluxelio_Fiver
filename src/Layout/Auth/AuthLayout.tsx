import Image from "next/image";
import React, { JSX, ReactNode } from "react";
import SideImg from "../../../public/Auth/sideImage.png";

interface Authlayout {
    children: ReactNode;
}

const AuthLayout = ({ children }: Authlayout): JSX.Element => {
    return (
        <div className="flex items-center justify-center bg-white" data-theme="light">
            <div className="w-full h-full flex">
                <div className="w-full">
                    <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
                </div>
                <div className="sm:w-[60%] 2xl:w-[50%] w-0 bg-white h-screen rounded-lg py-4 px-4 max-md:hidden pr-[5rem]">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-BtnColorLight rounded-lg">
                        <h1 className="lg:text-4xl text-2xl text-center pb-10 px-4 text-white">Enabling and empowering the world's supply chains</h1>
                        <Image src={SideImg} width={500} height={500} alt="" className="w-full max-w-[500px] px-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
