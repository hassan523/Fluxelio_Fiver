"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { AlignLeft, Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import dynamic from "next/dynamic";
import Field from "@/components/InputField/Field";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLogoutHandler } from "@/models/Auth/AuthModel";
import { getCookie } from "cookies-next";
import AuthGuard from "@/utils/AuthGuard/AuthGuard";

type DashboardLayoutProps = {
    children: ReactNode;
    isField?: boolean;
};

const DashboardLayout = ({ children, isField = true }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const RefreshToken = cookiesData?.data?.refreshToken;

    const { setTheme, theme } = useTheme();

    // Logout API
    const { Logout } = useLogoutHandler();

    const handleLogout = () => {
        Logout(RefreshToken);
    };

    return (
        <div className="min-h-screen bg-cardBG flex overflow-hidden">
            <div className="fixed bottom-0 right-0 bg-no-repeat bg-bottom-right w-full h-full opacity-5 z-0"></div>

            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

            <div className={`h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}  lg:translate-x-0 lg:z-10 `}>
                <Sidebar onClose={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} />
            </div>

            <main
                className={`z-10 transition-all duration-500 ease-in-out flex lg:items-end lg:justify-end items-center justify-center rounded-t-2xl w-full fixed top-0 right-0 overflow-y-hidden lg:mr-4 ${sidebarOpen ? "2xl:w-[96vw] xl:w-[94vw]  lg:w-[93vw] transition-all duration-300 ease-in-out" : "2xl:w-[86vw] xl:w-[84vw] lg:w-[80vw] transition-all duration-500 ease-in-out"}`}
                style={{ marginTop: "0.5rem" }}
            >
                <div className={`dark:bg-layoutDarkBG bg-layoutLightBG rounded-t-2xl px-4 pb-4 lg:px-6 lg:pb-4 w-[98vw] overflow-hidden ${sidebarOpen ? "2xl:w-[96vw] xl:w-[94vw]  lg:w-[93vw] transition-all duration-300 ease-in-out" : "2xl:w-[86vw] xl:w-[84vw]  lg:w-[80vw] transition-all duration-500 ease-in-out"}`} style={{ height: "120vh" }}>
                    <div className="dark:bg-layoutDarkBG bg-layoutLightBG w-full flex items-center justify-between h-20 z-30 rounded-sm px-4">
                        <div className="flex items-center gap-4">
                            <AlignLeft className="cursor-pointer dark:text-textColorDark text-textColorLight transition-all duration-300 ease-in-out sm:w-8 sm:h-8 w-6 h-6" onClick={() => setSidebarOpen(!sidebarOpen)} />
                            {isField && <Field placeHolder="Search" value="" isIcon icon={<Search className="dark:text-secondaryTextColor text-secondaryTextColor mr-2 w-5 h-5" />} className="outline-none md:flex hidden" inputCustomClass="outline-none" />}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            {theme == "dark" ? (
                                <Sun className=" sm:w-7 sm:h-7 w-5 h-5 cursor-pointer dark:text-textColorDark text-textColorLight  transition-all duration-300 ease-in-out" onClick={() => setTheme("light")} />
                            ) : (
                                <Moon className=" sm:w-7 sm:h-7 w-5 h-5 cursor-pointer dark:text-textColorDark text-textColorLight  transition-all duration-300 ease-in-out" onClick={() => setTheme("dark")} />
                            )}
                            <div className="relative">
                                <Bell className=" sm:w-7 sm:h-7 w-5 h-5 cursor-pointer dark:text-textColorDark text-textColorLight  transition-all duration-300 ease-in-out" />
                                <div className="absolute text-textColorDark md:h-4 md:w-4 h-3 w-3 rounded-full flex items-center justify-center bg-RoseRed md:text-[8px] text-[6.5px] md:-top-4 -top-3 -right-1">+9</div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Button variant="outline" onClick={handleLogout} size="icon" className="overflow-hidden rounded-full md:w-[40px] md:h-[40px] w-[30px] h-[30px] cursor-pointer">
                                    {/* <Image src={"/assets/images/Logo.png"} width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full object-contain md:w-[36px] md:h-[36px] w-[26px] h-[26px]" /> */}
                                    <LogOut />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-y-auto xl:h-[89vh] lg:h-[88vh] md:h-[89vh] h-[85vh] px-4 pb-8">{children}</div>
                </div>
            </main>
        </div>
    );
};

export default dynamic(() => Promise.resolve(DashboardLayout), { ssr: false });
