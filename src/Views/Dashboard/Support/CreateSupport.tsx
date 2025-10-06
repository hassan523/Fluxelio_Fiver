"use client";
import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import Layout from "@/Layout/Dashboard/Layout";
import { useCreateTicketHandler } from "@/models/Support/SupportModel";
import { getCookie } from "cookies-next";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateSupport = () => {
    const { theme } = useTheme();
    const [ticketData, setTicketData] = useState({
        title: "",
        description: "",
        images: [],
    });

    const router = useRouter();

    const { title, description, images } = ticketData;

    const handleTicket = (e: any) => {
        setTicketData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const id = cookiesData?.data?.user?._id;

    const { CreateTicketHandler, isLoading, isError, isSuccess } = useCreateTicketHandler();

    const handleCreateTicket = () => {
        CreateTicketHandler({
            CreatedBy: id,
            Token,
            title,
            description,
            images,
        });
        setTicketData({
            title: "",
            description: "",
            images: [],
        });
        router.push("/support");
    };

    return (
        <Layout isField={false}>
            <div className="flex h-auto justify-center py-[5rem]">
                <div className="flex flex-col items-start gap-6 justify-self-start w-[60vh] py-10 px-8 border-2 dark:border-textColorDark border-[#6b6b6b8e] rounded-xl dark:bg-cardBG bg-white">
                    <h1 className="h1 text-start">Support System</h1>
                    <span className="border dark:border-textColorDark border-[#6b6b6b8e] py-2 px-4 rounded-lg dark:bg-layoutDarkBG bg-white ">
                        <p style={{ fontSize: "0.95em" }}>We are sorry for the inconvenience. Please select the reason for the issue you are facing and provide the details below so we can assist you better. We are sorry for the inconvenience. Please select the reason for the issue you are facing and provide the details below so we can assist you better.</p>
                    </span>
                    <div className="w-full">
                        <Field type="text" placeHolder="Enter Title" value={title} onChange={handleTicket} name="title" />
                    </div>
                    <textarea placeholder="Enter Description" rows={8} name="description" className="dark:bg-layoutDarkBG bg-white px-4 py-3 border dark:border-textColorDark border-[#6b6b6b8e] w-full h-full rounded-sm " onChange={handleTicket} value={description} />
                    <div className=" flex items-center  justify-center px-6 w-full gap-4">
                        <Button name={"Send Ticket"} mainClass="px-4 text-sm w-36 cursor-pointer" isLoading={isLoading} onClick={handleCreateTicket} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateSupport;
