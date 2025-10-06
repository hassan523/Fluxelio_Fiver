"use client";
import Table from "@/components/Tables/Table";
import Layout from "@/Layout/Dashboard/Layout";
import Data from "../../../DummyData/Data.json";
import React, { useEffect, useState } from "react";
import { useGetAllInvites } from "@/models/Operator/OperatorModal";
import { getCookie } from "cookies-next";
import type { Invites } from "@/redux/Operator/OperatorTypes";
import { useRouter } from "next/navigation";

const Invites = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [invites, setInvites] = useState<Array<{ _id: string; email: string; agencyName: string; officeName: string; used: string }>>([]);
    const columns = [
        { key: "_id", header: "ID" },
        { key: "email", header: "Email", select: ["Niko", "b", "c", "d", "e"], displayName: "Month" },
        { key: "agencyName", header: "Agency Name", select: ["Niko", "b", "c", "d", "e"], displayName: "Month" },
        { key: "officeName", header: "Office Name", select: ["1", "2", "3", "4", "5"], displayName: "Year" },
        { key: "used", header: "Status", search: true },
    ];

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const id = cookiesData?.data?.user?._id;

    const { data, isLoading } = useGetAllInvites({ AdminID: id, Token });
    const invitesData = data?.invites;

    const router = useRouter();

    useEffect(() => {
        if (!invitesData) return;
        const structuredData = invitesData?.map((item: Invites) => ({
            _id: item?._id,
            email: item?.email,
            agencyName: item?.agency?.agencyName,
            officeName: item?.office?.officeName,
            used: item?.used ? "Active" : "In-Active",
        }));
        setInvites(structuredData);
    }, [isLoading]);

    const handleViewClick = (ticketData: any) => {
        router.push(`/invite/123`);
    };

    return (
        <Layout>
            <div className="flex flex-col gap-4 mt-5">
                <h1 className="text-xl font-semibold">Invites</h1>
                <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="All Invites List" columns={columns} data={invites} actions={true} keyField="_id" isLoading={isLoading} onViewClick={handleViewClick} edit={false} />
            </div>
        </Layout>
    );
};

export default Invites;
