"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, User, LogOut, X, Users, Phone, Archive, Building, Tags } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { deleteCookie, getCookie } from "cookies-next";
import smLogo from "../../../public/Logo/logo-sm.png";
import lightLogo from "../../../public/Logo/logo-light.png";
import { useLogoutHandler } from "@/models/Auth/AuthModel";
import { useTheme } from "next-themes";

type SidebarProps = {
    onClose?: () => void;
    sidebarOpen?: boolean;
};

const Sidebar = ({ onClose, sidebarOpen }: SidebarProps) => {
    const [sidebarLinks, setSidebarLinks] = useState<{ name: string; href: string; icon: React.ComponentType }[]>([]);

    const pathname = usePathname();
    const router = useRouter();

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const RefreshToken = cookiesData?.data?.refreshToken;

    const [activeTab, setActiveTab] = useState(pathname);

    const Loggin = cookiesData?.data?.user ? true : false;
    const role = cookiesData?.data?.user?.role?.[0];

    const AdminSidebar = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: () => (
                <>
                    <LayoutDashboard size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Agencies",
            href: "/agencies",
            icon: () => (
                <>
                    <Users size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Tags",
            href: "/tags",
            icon: () => (
                <>
                    <Tags size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Invites",
            href: "/invite",
            icon: () => (
                <>
                    <Package size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Support",
            href: "/support",
            icon: () => (
                <>
                    <Phone size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Profile",
            href: "/profile",
            icon: () => (
                <>
                    <User size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
    ];

    const AgencySidebar = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: () => (
                <>
                    <LayoutDashboard size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Offices",
            href: "/offices",
            icon: () => (
                <>
                    <Building size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Tags",
            href: "/tags",
            icon: () => (
                <>
                    <Tags size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Parcels",
            href: "/parcels",
            icon: () => (
                <>
                    <Archive size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Support",
            href: "/support",
            icon: () => (
                <>
                    <Phone size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Profile",
            href: "/profile",
            icon: () => (
                <>
                    <User size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
    ];

    const operatorSidebar = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: () => (
                <>
                    <LayoutDashboard size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Customers",
            href: "/customers",
            icon: () => (
                <>
                    <Users size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Parcels",
            href: "/parcels",
            icon: () => (
                <>
                    <Archive size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Tags",
            href: "/tags",
            icon: () => (
                <>
                    <Tags size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Support",
            href: "/support",
            icon: () => (
                <>
                    <Phone size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
        {
            name: "Profile",
            href: "/profile",
            icon: () => (
                <>
                    <User size={sidebarOpen ? 18 : 14} />
                </>
            ),
        },
    ];

    const { setTheme, theme } = useTheme();

    const UserSidebar = [
        { name: "Parcels", href: "/parcels", icon: Package },
        { name: "Profile", href: "/profile", icon: User },
    ];

    useEffect(() => {
        if (role === "Admin") {
            setSidebarLinks(AdminSidebar);
        } else if (role === "Users") {
            setSidebarLinks(UserSidebar);
        } else if (role === "Agency") {
            setSidebarLinks(AgencySidebar);
        } else if (role === "Operator") {
            setSidebarLinks(operatorSidebar);
        }
    }, [Loggin, sidebarOpen]);

    useEffect(() => {
        if (pathname) {
            const matchedLink = sidebarLinks.find((link) => (pathname.includes(link.href) && link.href !== "/dashboard") || pathname === link.href);
            if (matchedLink) {
                setActiveTab(matchedLink.href);
            }
        }
    }, [pathname]);

    const handleTabClick = (href: string) => {
        setActiveTab(href);
        router.push(href);
        if (onClose) onClose();
    };

    // Logout API
    const { Logout } = useLogoutHandler();

    const handleLogout = async () => {
        Logout(RefreshToken);
    };

    return (
        <aside className={`${sidebarOpen ? "lg:w-[4vw] md:w-[20vw] sm:w-[30vw] w-[50vw]" : "2xl:w-[13vw]"} transition-all delay-200 ease-in-out xl:w-[15vw] lg:w-[19vw]  h-full max-h-screen p-0 sticky top-0 z-20 overflow-hidden`}>
            <div className="h-full flex flex-col bg-cardBG text-white relative overflow-hidden shadow-xl">
                <div className="absolute inset-0  bg-no-repeat bg-cover bg-center z-0 opacity-20 mix-blend-lighten animate-pulse-slow" />

                <div className="relative z-10 px-4 pb-6  pt-8 flex items-center justify-center">
                    <div className="relative w-full flex items-start justify-self-start" onClick={() => router.push("/")}>
                        {sidebarOpen && window.innerWidth >= 1024 ? <Image src={smLogo} alt="Logo" width={28} height={28} priority /> : <Image src={lightLogo} alt="Logo" width={120} height={120} priority />}
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-1 rounded-full hover:bg-white/20 absolute right-4 top-4 transition-all">
                            <X size={20} className="text-headingDark" />
                        </button>
                    )}
                </div>

                <div className="relative z-10 flex flex-col h-full overflow-y-auto px-2 py-6 items-center justify-center w-full">
                    <div className="flex flex-col gap-2 w-full">
                        {!sidebarOpen && (
                            <p className="text-secondaryTextColor pl-3 " style={{ fontSize: "14px" }}>
                                Menu
                            </p>
                        )}
                        <nav className={`flex-1 flex flex-col gap-1  ${sidebarOpen ? "lg:w-fit w-full " : "w-full"}`}>
                            {sidebarLinks.map((link) => (
                                <button key={link.name} onClick={() => handleTabClick(link.href)} className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-300 cursor-pointer w-auto ${activeTab === link.href || (link.href !== "/dashboard" && pathname.includes(link.href)) ? "border border-textColorDark text-white font-medium shadow-md" : "text-textColorDark "}`}>
                                    {React.createElement(link.icon)}
                                    <span className={`text-sm font-medium  ${sidebarOpen ? "lg:hidden flex" : "flex"}`}>{link.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto pt-4 w-full">
                        <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 p-3 rounded-lg text-white transition-all w-full text-left">
                            <LogOut size={sidebarOpen ? 20 : 16} className="text-white/80" />
                            <span className={`text-sm font-medium ${sidebarOpen ? "lg:hidden flex" : "flex"}`}>Log out</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
