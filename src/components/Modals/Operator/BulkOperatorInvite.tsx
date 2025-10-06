"use client";
import React, { JSX, useState } from "react";
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from "../../ui/dialog";
import dynamic from "next/dynamic";
import CustomButton from "../../Button/Button";
import { getCookie } from "cookies-next";
import { useSendBulkInvite } from "@/models/Operator/OperatorModal";
import { useParams } from "next/navigation";

const BulkOperatorInvite = ({ isClose }: { isClose?: any }): JSX.Element => {
    const [BlukEmails, setBlukEmails] = useState<{ email: string[] }>({
        email: [],
    });

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const _id = cookiesData?.data?.user?._id;
    const role = cookiesData?.data?.user?.role?.[0];

    const params = useParams();
    const { AgencyID, OfficeID } = params;

    const { handleSendBulkInvite, isLoading } = useSendBulkInvite();

    const handleBulkInvite = () => {
        handleSendBulkInvite({ AgencyID: role === "Admin" ? AgencyID : _id, OfficeID, Token, Data: BlukEmails?.email });
    };

    return (
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto rounded-sm">
            <div className="w-full h-fit flex items-center justify-center px-4 sm:px-6 py-2 border-b border-gray-200">
                <DialogTitle className="text-heading text-xl sm:text-2xl plusJakartaSans capitalize">Add Operator</DialogTitle>
            </div>
            <div className="flex flex-col gap-4">
                <textarea placeholder="Enter Your Office Name" rows={8} className="dark:bg-layoutDarkBG bg-white px-4 py-3 dark:border-white border-gray-600 rounded-sm" onChange={(e) => setBlukEmails({ email: e.target.value.split("\n") })} />
                <DialogFooter className={"pb-4 "}>
                    <div className=" flex items-center  justify-center px-6 w-full gap-4">
                        <DialogClose className=" rounded-sm text-center w-36 cursor-pointer font-normal h-11 text-RoseRed border-RoseRed border-2 px-10 py-3 transition-all duration-300 hover:scale-[103%]" style={{ lineHeight: "1rem" }}>
                            Cancel
                        </DialogClose>
                        <CustomButton isLoading={isLoading} name={"Send Invite"} mainClass="px-4 text-sm w-36 cursor-pointer" onClick={handleBulkInvite} />
                    </div>
                </DialogFooter>
            </div>
        </DialogContent>
    );
};

export default dynamic(() => Promise.resolve(BulkOperatorInvite), { ssr: false });
