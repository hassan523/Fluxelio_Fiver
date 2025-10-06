"use client";

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/Layout/Dashboard/Layout";
import Table from "@/components/Tables/Table";
import Button from "@/components/Button/Button";
import { Edit, Eye, Trash } from "lucide-react";
import { useGetAllUser } from "@/models/Users/UsersModel";
import { getCookie } from "cookies-next";
import AddUser from "@/components/Modals/Users/AddUser";

const Users = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const agencyID = cookiesData?.data?.user?.agencyID;
    const officeID = cookiesData?.data?.user?.officeID;

    const columns = [
        { key: "_id", header: "ID" },
        { key: "username", header: "User Name", search: true },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        { key: "country", header: "Country" },
        {
            key: "action",
            header: "Action",
            render: (_: any, item: any) => (
                <div className="flex justify-center gap-4">
                    <div style={{ cursor: "pointer" }}>
                        <Edit className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
                    </div>
                    <div style={{ cursor: "pointer" }}>
                        <Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
                    </div>
                </div>
            ),
        },
    ];

    const GetALlUsersData = useGetAllUser({ agencyID: agencyID, officeID: officeID, Token: Token });
    const UserData = GetALlUsersData?.data;
    const isLoading = GetALlUsersData?.isLoading;

    return (
        <Layout>
            <div className="w-full mx-auto pt-6 flex flex-col gap-4">
                <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg ">
                    <div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
                        <div>
                            <h2 className="text-xl font-semibold">Users Management</h2>
                            <p className="text-gray-500 text-sm">manage your users in the system</p>
                        </div>
                    </div>
                </div>

                <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
                    <Table isModal ModalName="Add Customer" Modal={<AddUser />} currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Customer List" columns={columns} data={UserData?.users || []} actions={false} keyField="_id" selectKey="name" isLoading={isLoading} />
                </div>
            </div>
        </Layout>
    );
};

export default Users;
