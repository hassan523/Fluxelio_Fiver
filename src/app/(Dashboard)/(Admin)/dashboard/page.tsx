"use client"

import AgencyDashboard from "@/Views/Dashboard/Agencies/AgencyDashboard/AgencyDashboard";
import Dashboard from "@/Views/Dashboard/Dashboard/Dashboard";
import OperatorDashboard from "@/Views/Dashboard/Operator/OperatorDashboard/OperatorDashboard";
import { getCookie } from "cookies-next";
import React from "react";

const page = () => {
    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const role = cookiesData?.data?.user?.role?.[0];

    return <> {role == 'Admin'&& <Dashboard /> }{role == 'Agency' && <AgencyDashboard />}
    {role == 'Operator' && <OperatorDashboard />}
    </>;
};

export default page;
