import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import { ShowErrorToast } from "@/components/Toast/Toast";
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUpdateParcel } from "@/models/Parcels/ParcelsModel";
import { useUpdateTagParcel } from "@/models/Tags/TagsModel";
import { getCookie } from "cookies-next";
import { ChevronDown } from "lucide-react";
import React, { useState, Dispatch, SetStateAction } from "react";

const UpdateTagStatus = ({ UpdateStatusData, setterFunction }: { UpdateStatusData: { isOpen: boolean; data: any }; setterFunction: Dispatch<SetStateAction<{ isOpen: boolean; data: any }>> }) => {
    const [tagData, setTagData] = useState({
        parcelStatus: "",
        paymentStatus: "",
        partialAmount: null,
    });

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const role = cookiesData?.data?.user?.role?.[0];
    const agencyID = role == "Agency" ? cookiesData?.data?.user?._id : cookiesData?.data?.user?.agencyID;
    const _id = cookiesData?.data?.user?._id;

    const { parcelStatus, partialAmount, paymentStatus } = tagData;
    const { data, isOpen } = UpdateStatusData;

    const statusArray = ["RECEIVED IN WAREHOUSE", "WAITING TO BE GROUPED", "READY FOR SHIPMENT", "SHIPPED", "IN TRANSIT", "ARRIVED AT DESTINATION OFFICE", "WAITING FOR WITHDRAWAL", "DELIVERED/PICKED UP", "UNCLAIMED PACKAGE"];
    const paymentArray = ["PENDING PAYMENT", "PARTIALLY PAID", "DEFERRED PAYMENT", "PAYMENT VALIDATED", "PAYMENT FAILED", "PAYMENT CANCELLED"];

    const { handleUpdateTags, isError, isLoading: updateParcelLoading } = useUpdateTagParcel();

    const handleUpdateStatus = async () => {
        if (data === undefined || data === null) {
            return ShowErrorToast("Something went wrong");
        }

        await handleUpdateTags({
            tagID: data?._id,
            agencyID: role == "Admin" ? data?.agencyID : agencyID,
            officeID: data?.officeID,
            Token,
            updatedBy: _id,
            data: {
                status: parcelStatus || data?.status,
                paymentStatus: paymentStatus || data?.paymentStatus,
                partialAmount: partialAmount,
            },
        });

        setterFunction({ data: null, isOpen: false });
        setTagData({
            parcelStatus: "",
            partialAmount: null,
            paymentStatus: "",
        });
    };
    return (
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto rounded-sm">
            <div className="w-full h-fit flex items-center justify-center px-4 sm:px-6 py-2 border-b border-gray-200">
                <DialogTitle className="text-heading text-xl sm:text-2xl plusJakartaSans capitalize">Update Status</DialogTitle>
            </div>
            <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label>Select Parcel Status</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="dark:bg-layoutDarkBG bg-white px-2.5 py-2 rounded-sm border dark:border-white border-gray-500  outline-none">
                            <span className={`flex justify-between items-center gap-6 w-full dark:text-white text-textColorLight cursor-pointer`}>
                                <span className="w-full">{parcelStatus || UpdateStatusData?.data?.status}</span>
                                <ChevronDown size={16} />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {statusArray?.map((Status) => (
                                <React.Fragment key={Status}>
                                    <DropdownMenuLabel
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setTagData((prev) => ({ ...prev, parcelStatus: Status }));
                                        }}
                                    >
                                        {Status}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-400" />
                                </React.Fragment>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Select Payment Status</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="dark:bg-layoutDarkBG bg-white px-2.5 py-2 rounded-sm border dark:border-white border-gray-500  outline-none">
                            <span className={`flex justify-between items-center gap-6 w-full dark:text-white text-textColorLight cursor-pointer`}>
                                <span className="w-full">{paymentStatus || data?.paymentStatus}</span>
                                <ChevronDown size={16} />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {paymentArray?.map((Status) => (
                                <React.Fragment key={Status}>
                                    <DropdownMenuLabel
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setTagData((prev) => ({ ...prev, paymentStatus: Status }));
                                        }}
                                    >
                                        {Status}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-400" />
                                </React.Fragment>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Office Information</label>
                    <Field
                        placeHolder="Enter Your Partial Amount"
                        type="number"
                        className="gap-2"
                        divStyle={{ padding: "0.75rem 0.8rem" }}
                        onChange={(e: any) => {
                            setTagData((prev) => ({ ...prev, partialAmount: e.target.value }));
                        }}
                        name="Partial Amount"
                        value={partialAmount ? (partialAmount as any)?.toString() : ""}
                        disabled={paymentStatus !== "PARTIALLY PAID" && data?.transaction?.paymentStatus !== "PARTIALLY PAID"}
                    />
                </div>

                <DialogFooter className={"pb-4 "}>
                    <div className=" flex items-center  justify-center px-6 w-full gap-4">
                        <DialogClose
                            className=" rounded-sm text-center w-36 cursor-pointer font-normal h-11 text-RoseRed border-RoseRed border-2 px-10 py-3 transition-all duration-300 hover:scale-[103%]"
                            style={{ lineHeight: "1rem" }}
                            onClick={() =>
                                setTagData({
                                    parcelStatus: "",
                                    partialAmount: null,
                                    paymentStatus: "",
                                })
                            }
                        >
                            Cancel
                        </DialogClose>
                        <Button name={"Update"} isLoading={updateParcelLoading} mainClass="px-4 text-sm w-36 cursor-pointer" onClick={() => handleUpdateStatus()} />
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default UpdateTagStatus;
