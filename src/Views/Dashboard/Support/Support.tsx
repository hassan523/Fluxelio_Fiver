"use client";

import React, { useState } from "react";
import Table from "@/components/Tables/Table";
import DashboardLayout from "@/Layout/Dashboard/Layout";
import { useRouter } from "next/navigation";
import { useGetSupportHandler, useUpdateSupportHandler } from "@/models/Support/SupportModel";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ShowWarningToast } from "@/components/Toast/Toast";

const Support = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);

    const router = useRouter();

    const StatusArray = ["Resolved", "Pending", "In-Progress"];

    const columns = [
        { key: "_id", header: "ID" },
        { key: "createdByName", header: "Submitted by" },
        { key: "createdAt", header: "Submitted Date" },
        { key: "description", header: "Description" },
        { key: "title", header: "Title" },
        {
            key: "status",
            header: "Status",
            select: StatusArray as string[],
            displayName: "Filter Status",
            render: (_: any, status: any) => (
                <DropdownMenu onOpenChange={(e) => setIsOpenDropDown(e)}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="lg" className="ml-auto  border border-textColorLight dark:border-textColorDark">
                            {status?.status}
                            {isOpenDropdown ? <ChevronDown /> : <ChevronUp />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {StatusArray?.filter((item) => item !== status?.status)?.map((subItem: string | number) => (
                            <DropdownMenuItem key={subItem} onClick={() => handleUpdateStatus({ TicketID: status?._id, status: subItem as string })}>
                                {subItem}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const id = cookiesData?.data?.user?._id;

    const GetSupportData = useGetSupportHandler({ Token, AdminID: id });
    const GetSupportArray = GetSupportData?.data?.tickets;

    const { UpdateStatusHandler } = useUpdateSupportHandler();

    function handleUpdateStatus({ TicketID, status }: { TicketID: string; status: string }) {
        if (!TicketID || !status) {
            ShowWarningToast("Something went wrong please reload the page");
        }

        UpdateStatusHandler({
            AdminID: id,
            Token,
            status,
            TicketID,
        });
    }

    const handleViewClick = (ticketData: any) => {
        router.push(`/support/${ticketData?._id}`);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-4 mt-5">
                <div className="flex [400px]:items-center justify-between w-full max-[400px]:flex-col max-[400px]:gap-2">
                    <h1 className="text-xl font-semibold">Support System</h1>
                </div>
                <div className="w-full bg-white dark:bg-cardBG rounded-sm overflow-x-auto overflow-y-hidden">
                    <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Ticket List" columns={columns} data={GetSupportArray || []} actions={true} keyField="_id" edit={false} onViewClick={handleViewClick} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Support;
