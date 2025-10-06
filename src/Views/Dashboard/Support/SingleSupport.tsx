"use client";

import { ShowWarningToast } from "@/components/Toast/Toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Layout from "@/Layout/Dashboard/Layout";
import { useGetSingleSupportHandler, useUpdateSupportHandler } from "@/models/Support/SupportModel";
import { getCookie } from "cookies-next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const SingleSupport = () => {
    const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);

    const statusColorMap: Record<string, string> = {
        Open: "bg-blue-600 hover:bg-blue-500",
        "In Progress": "bg-yellow-700 hover:bg-yellow-600",
        Resolved: "bg-green-700 hover:bg-green-600",
        Closed: "bg-gray-600 hover:bg-gray-500",
    };

    const [selectedStatus, setSelectedStatus] = useState("Resolved");
    const [isOpen, setIsOpen] = useState(false);

    const buttonColor = statusColorMap[selectedStatus] || "bg-gray-700";

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const userId = cookiesData?.data?.user?._id;

    const { id } = useParams();
    const TicketID = Array.isArray(id) ? id[0] : id || "";

    const { data } = useGetSingleSupportHandler({ Token, TicketID, AdminID: userId });
    const SingleSupport = data?.ticket;

    const { UpdateStatusHandler } = useUpdateSupportHandler();

    function handleUpdateStatus({ TicketID, status }: { TicketID: string; status: string }) {
        if (!TicketID || !status) {
            ShowWarningToast("Something went wrong please reload the page");
        }

        UpdateStatusHandler({
            AdminID: userId,
            Token,
            status,
            TicketID,
        });
    }

    const StatusArray = ["Resolved", "Pending", "In-Progress"];
    return (
        <Layout>
            <div className="flex flex-col gap-4 mt-5">
                <h1 className="text-3xl font-semibold">Ticket Overview</h1>
                <div className="grid grid-cols-4 grid-rows-4 w-full gap-5 max-lg:grid-rows-7 max-md:grid-rows-6 max-sm:flex max-sm:flex-col">
                    <div className="bg-white dark:bg-cardBG rounded-xl flex flex-col gap-2 px-6 py-4  max-lg:col-span-2 border dark:border-textColorDark border-textColorLight">
                        <p>Ticket Status</p>
                        <h2 className="text-2xl font-semibold max-xl:text-xl">{SingleSupport?.status}</h2>
                    </div>
                    <div className="bg-white dark:bg-cardBG rounded-xl flex flex-col gap-2 px-6 py-4  max-lg:col-span-2 border dark:border-textColorDark border-textColorLight">
                        <p>Ticket Number</p>
                        <h2 className="text-2xl font-semibold max-xl:text-xl">{SingleSupport?._id}</h2>
                    </div>
                    <div className="bg-white dark:bg-cardBG col-span-2 rounded-xl flex flex-col gap-2 px-6 py-4  max-lg:col-span-4 border dark:border-textColorDark border-textColorLight">
                        <p>Title</p>
                        <h2 className="text-2xl font-semibold max-xl:text-xl">{SingleSupport?.title}</h2>
                    </div>
                    <div className="bg-white dark:bg-cardBG row-span-3 rounded-xl flex flex-col gap-4 px-6 py-4  max-lg:col-span-2 max-sm:col-span-4 border dark:border-textColorDark border-textColorLight">
                        <h2 className="text-2xl font-semibold max-xl:text-xl">Customer Information</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 items-start">
                                <p>Reason :</p>
                                <p>{SingleSupport?.title}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <p>Ticket Number :</p>
                                <p>{SingleSupport?._id}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-cardBG row-span-3 rounded-xl flex flex-col gap-4 px-6 py-4  max-lg:col-span-2 max-sm:col-span-4 border dark:border-textColorDark border-textColorLight">
                        <h2 className="text-2xl font-semibold max-xl:text-xl">Ticket Information</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 items-start">
                                <p>Created Date :</p>
                                <p>{SingleSupport?.createdAt?.split("T")}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <p>Reason :</p>
                                <p>{SingleSupport?.title}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <p>Ticket Number :</p>
                                <p>{SingleSupport?._id}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-start justify-start">
                                <p>Status :</p>

                                <div className="flex items-start">
                                    <DropdownMenu onOpenChange={(e) => setIsOpenDropDown(e)}>
                                        <DropdownMenuTrigger asChild>
                                            <button onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer inline-flex justify-center items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-white transition ${buttonColor}`}>
                                                {SingleSupport?.status}
                                                {isOpenDropdown ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {StatusArray?.filter((item) => item !== SingleSupport?.status)?.map((subItem: string | number) => (
                                                <DropdownMenuItem key={subItem} onClick={() => handleUpdateStatus({ TicketID: SingleSupport?._id || "", status: subItem as string })}>
                                                    {subItem}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-cardBG row-span-3 col-span-2 rounded-xl flex flex-col gap-4 px-6 py-4  max-lg:col-span-4 border dark:border-textColorDark border-textColorLight">
                        <h2 className="text-2xl font-semibold max-xl:text-xl">Description</h2>
                        <p>{SingleSupport?.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SingleSupport;
