"use client";

import Table from "@/components/Tables/Table";
import Layout from "@/Layout/Dashboard/Layout";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetAgencyTags, useGetAllTags, useGetOperatorTags } from "@/models/Tags/TagsModel";
import { getCookie } from "cookies-next";
import CreateTag from "@/components/Modals/Tags/CreateTag";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import UpdateTagStatus from "@/components/Modals/Tags/UpdateTagStatus";

const Tags = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [TagsData, setTagsData] = useState<any[]>([]);
    const [UpdateStatusData, setUpdateStatusData] = useState({
        isOpen: false,
        data: null,
    });
    const router = useRouter();

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const _id = cookiesData?.data?.user?._id;
    const agencyID = cookiesData?.data?.user?.agencyID;
    const officeID = cookiesData?.data?.user?.officeID;
    const role = cookiesData?.data?.user?.role?.[0];

    const columns = [
        { key: "_id", header: "ID" },
        { key: "tagName", header: "Tag Name", search: true },
        { key: "agencyName", header: "Agency" },
        { key: "officeName", header: "Office" },
        {
            key: "status",
            header: "Status",
            render: (_: any, item: any) => {
                return item?.status === null ? (
                    <Button className="border dark:border-white border-headingLight bg-transparent dark:text-white text-black hover:bg-transparent px-12">No parcels</Button>
                ) : (
                    <Button className="cursor-pointer" onClick={() => setUpdateStatusData((prev) => ({ ...prev, data: item, isOpen: true }))}>
                        {item?.status?.length > 18 ? `${item.status.slice(0, 18)}...` : item?.status}
                    </Button>
                );
            },
        },
    ];

    const getOperatorTagsResult = useGetOperatorTags({ agencyID: agencyID, officeID, Token, role: role });
    const getAllTagsResult = useGetAllTags({ Token, role: role });
    const getAgencyTagsResult = useGetAgencyTags({ Token, agencyID: _id, role: role });

    const isLoading = getOperatorTagsResult?.isLoading || getAllTagsResult?.isLoading;
    const APITagsData = getOperatorTagsResult?.data?.tags || getAllTagsResult?.data?.tags || getAgencyTagsResult?.data?.tags;

    useEffect(() => {
        const data = APITagsData?.map((item, i) => ({
            _id: item?._id,
            tagName: item?.tagName,
            agencyName: item?.agency?.agencyName,
            officeName: item?.office?.officeName,
            agencyID: (item?.agency as any)?.agencyID,
            officeID: (item?.office as any)?.officeID,
            status: (item as any)?.parcelStatus,
            paymentStatus: (item as any)?.parcelPaymentStatus,
        }));
        setTagsData(data || []);
    }, [APITagsData]);

    return (
        <Layout>
            <div className="flex flex-col gap-4 mt-5">
                <div className="flex [400px]:items-center justify-between w-full max-[400px]:flex-col max-[400px]:gap-2">
                    <h1 className="text-xl font-semibold">Tags</h1>
                </div>
                <div className="w-full bg-white dark:bg-cardBG rounded-sm overflow-x-auto overflow-y-hidden">
                    <Table isModal ModalName="Create Tag" Modal={<CreateTag />} currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Tag List" columns={columns} data={TagsData} actions={false} keyField="_id" isLoading={isLoading} />
                </div>
            </div>
            <Dialog open={UpdateStatusData?.isOpen} onOpenChange={(e) => setUpdateStatusData((prev) => ({ ...prev, isOpen: e, data: null }))}>
                <UpdateTagStatus UpdateStatusData={UpdateStatusData} setterFunction={setUpdateStatusData} />
            </Dialog>
        </Layout>
    );
};

export default Tags;
