"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AlignJustify, LogIn, LogOut, UserPlus, Home, X, MessageCircle, Headset } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const role = "Manager";
    const isLoggin = false;

    const handleLogout = () => {
        deleteCookie("loneStarExpress");
        router.push("/login");
    };
    return (
        <nav className="w-full fixed top-0 z-50 bg-white shadow-lg">
            <div className="mx-auto flex items-center justify-between py-4 xl:px-[18rem] lg:px-[10rem] md:px-[5rem] px-6">
                <div className="flex items-center justify-between w-full">
                    <div className="text-2xl font-bold text-[#202224] cursor-pointer hover:opacity-80 transition-opacity duration-300" onClick={() => router.push("/dashboard")}>
                        <Image src="/Logo/logo-dark.png" alt="Logo" width={200} height={200} quality={100} />
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        {isLoggin ? (
                            <>
                                <div className={`flex items-baseline ${pathname === "/dashboard" ? "text-BtnColorLight font-semibold" : "text-gray-700 hover:text-BtnColorLight"} transition-colors duration-300`}>
                                    <Link href="/dashboard" className="flex items-center gap-1.5">
                                        <Home size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                </div>
                                <div className={`flex items-baseline ${pathname === "/chat" ? "text-BtnColorLight font-semibold" : "text-gray-700 hover:text-BtnColorLight"} transition-colors duration-300`}>
                                    <Link href="/dashboard" className="flex items-center gap-1.5">
                                        <MessageCircle size={18} />
                                        <span>Chat</span>
                                    </Link>
                                </div>
                                {role === "Manager" && (
                                    <div className={`flex items-baseline ${pathname === "/support" ? "text-BtnColorLight font-semibold" : "text-gray-700 hover:text-BtnColorLight"} transition-colors duration-300`}>
                                        <Link href="/dashboard" className="flex items-center gap-1.5">
                                            <Headset size={18} />
                                            <span>Support</span>
                                        </Link>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-BtnColorLight px-5 py-2.5 rounded-lg cursor-pointer hover:bg-BtnColorLight/80 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg" onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 bg-BtnColorLight px-5 py-2.5 rounded-lg cursor-pointer hover:bg-BtnColorLight/80 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg" onClick={() => router.push("/login")}>
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </div>
                                <div className="flex items-center gap-2 border-2 border-BtnColorLight px-5 py-2.5 rounded-lg cursor-pointer text-BtnColorLight font-medium hover:bg-BtnColorLight hover:text-white transition-all duration-300" onClick={() => router.push("/sign-up")}>
                                    <UserPlus size={18} />
                                    <span>Signup</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <button className="lg:hidden text-2xl text-[#202224] focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X /> : <AlignJustify />}
                </button>
            </div>
            <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 lg:hidden flex flex-col p-8 gap-8 z-50`}>
                <button className="self-end text-2xl text-[#202224] hover:text-BtnColorLight transition-colors" onClick={() => setMenuOpen(false)}>
                    <X />
                </button>

                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-5">
                        {isLoggin ? (
                            <>
                                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all" onClick={() => setMenuOpen(false)}>
                                    <Home size={20} />
                                    <span className="font-medium">Home</span>
                                </Link>
                                <div
                                    className="flex items-center gap-2 bg-BtnColorLight px-4 py-3 rounded-lg cursor-pointer hover:bg-BtnColorLight/80 text-white font-medium transition-all"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="flex items-center gap-2 bg-BtnColorLight px-4 py-3 rounded-lg cursor-pointer hover:bg-BtnColorLight/80 text-white font-medium transition-all"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        router.push("/login");
                                    }}
                                >
                                    <LogIn size={20} />
                                    <span>Login</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 border-2 border-BtnColorLight px-4 py-3 rounded-lg cursor-pointer text-BtnColorLight font-medium hover:bg-BtnColorLight hover:text-white transition-all"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        router.push("/sign-up");
                                    }}
                                >
                                    <UserPlus size={20} />
                                    <span>Signup</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
