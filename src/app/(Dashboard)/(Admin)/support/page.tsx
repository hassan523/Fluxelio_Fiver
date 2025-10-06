"use client";
import SplashSupport from "@/Views/Dashboard/Support/SplashSupport";
import Support from "@/Views/Dashboard/Support/Support";
import { getCookie } from "cookies-next";

const page = () => {
    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const role = cookiesData?.data?.user?.role?.[0];

    return role === "Admin" ? <Support /> : <SplashSupport />;
};

export default page;
