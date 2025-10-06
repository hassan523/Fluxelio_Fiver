"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash, Edit, ChevronDown } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/Layout/Dashboard/Layout";
import Table from "@/components/Tables/Table";
import { getCookie } from "cookies-next";
import { useGetAgencyParcel, useGetOfficeParcel } from "@/models/Parcels/ParcelsModel";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import UpdateStatus from "@/components/Modals/Parcel/UpdateStatus";

const Parcels = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [UpdateStatusData, setUpdateStatusData] = useState({
        isOpen: false,
        data: null,
    });

    const pageLimit = 10;

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const role = cookiesData?.data?.user?.role?.[0];
    const agencyID = role == "Agency" ? cookiesData?.data?.user?._id : cookiesData?.data?.user?.agencyID;
    const officeID = cookiesData?.data?.user?.officeID;

    const columns = [
        { key: "_id", header: "ID" },
        { key: "trackingID", header: "Tracking ID", search: true },
        { key: "weight", header: "Weight" },
        { key: "transportMethod", header: "Transport Method" },
        { key: "type", header: "Type", select: ["Single", "Mixed"], displayName: "Parcel Type" },
        {
            key: "status",
            header: "Status",
            displayName: "Filter Status",
            render: (_: any, item: any) => {
                return item?.type === "Mixed" ? (
                    <Button className="border dark:border-white border-headingLight bg-transparent dark:text-white text-black hover:bg-transparent">{item?.status?.length > 18 ? `${item.status.slice(0, 18)}...` : item?.status}</Button>
                ) : (
                    <Button onClick={() => setUpdateStatusData((prev) => ({ ...prev, data: item, isOpen: true }))} className="cursor-pointer">
                        {item?.status?.length > 18 ? `${item.status.slice(0, 18)}...` : item?.status}
                    </Button>
                );
            },
        },
        {
            key: "action",
            header: "Action",
            render: (_: any, item: any) => (
                <div className="flex justify-center gap-4">
                    <div style={{ cursor: "pointer" }} onClick={()=>router.push(`/parcels/single-parcel/${item?._id}`)}>
                        <Eye className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
                    </div>

                    <div style={{ cursor: "pointer" }}>
                        <Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
                    </div>
                </div>
            ),
        },
    ];

    const GetParcelData = role == "Agency" ? useGetAgencyParcel({ agencyID: agencyID, Token: Token, role: role, limit: pageLimit, page: currentPage }) : useGetOfficeParcel({ agencyID: agencyID, officeID: officeID, Token: Token, role: role, limit: pageLimit, page: currentPage });
    const ParcelData = GetParcelData?.data?.parcels?.map((item) => ({
        ...item,
        type: item.mixedPackage ? "Mixed" : "Single",
    }));
    const isLoading = GetParcelData?.isLoading;
    const isFetching = GetParcelData?.isFetching;

    return (
        <Layout>
            <div className="w-full mx-auto pt-6 flex flex-col gap-4">
                <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
                    <div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
                        <div>
                            <h2 className="text-xl font-semibold">Parcel Management</h2>
                            <p className="text-gray-500 text-sm">Track and manage your parcels in the system</p>
                        </div>
                    </div>
                </div>

                <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
                    <Table
                        isBtn
                        BtnName="Create Parcel"
                        BtnClick={() => router.push("/parcels/create-parcel")}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        tableName="Parcel List"
                        data={ParcelData || []}
                        columns={columns}
                        actions={false}
                        keyField="_id"
                        selectKey="_id"
                        isSelect
                        isLoading={isLoading || isFetching}
                        pageLimit={pageLimit}
                        dataLength={GetParcelData?.data?.meta?.totalItems || 0}
                    />
                </div>
            </div>
            <Dialog open={UpdateStatusData?.isOpen} onOpenChange={(e) => setUpdateStatusData((prev) => ({ ...prev, isOpen: e, data: null }))}>
                <UpdateStatus agencyID={agencyID} UpdateStatusData={UpdateStatusData} setterFunction={setUpdateStatusData} />
            </Dialog>
        </Layout>
    );
};

export default Parcels;
