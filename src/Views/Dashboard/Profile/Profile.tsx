"use client";

import Button from "@/components/Button/Button";
import Field from "@/components/InputField/Field";
import Layout from "@/Layout/Dashboard/Layout";
import { useGetProfileHandler, useUpdateProfileHandler } from "@/models/Auth/AuthModel";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import React, { useEffect, useState } from "react";

const Profile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        agencyName: "",
        phone: "",
    });

    const { username, email, password, agencyName, phone } = userData;

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const userID = cookiesData?.data?.user?._id;
    const Role = cookiesData?.data?.user?.role?.[0];
    const Token = cookiesData?.data?.accessToken;

    const handleField = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const { data, isLoading } = useGetProfileHandler(userID, Token);
    const profileData = data?.profile;

    const { UpdateProfileHandler, isLoading: updateLoading } = useUpdateProfileHandler();

    const handleUpdateProfile = async () => {
        await UpdateProfileHandler({ userID, Token, data: userData });
        setIsEdit(false);
    };

    useEffect(() => {
        setUserData({
            email: profileData?.email || "",
            username: profileData?.username || "",
            password: (profileData as any)?.password || "",
            agencyName: (profileData as any)?.agencyName || "",
            phone: (profileData as any)?.phone || "",
        });
    }, [isLoading]);

    return (
        <Layout>
            <div className="rounded-lg py-6 flex flex-col gap-4">
                <h1 className="text-xl font-semibold">Profile Overview</h1>
                <div className="w-full flex items-center justify-center">
                    <div className="xl:w-[30vw] lg:w-[40vw] md:w-[50vw] sm:w-[70vw] w-[80vw] sm:px-8 sm:py-4 px-4 py-2 sm:pb-8 pb-4 rounded-sm h-auto dark:bg-cardBG bg-cardLightBG border-2 border-white flex flex-col gap-6">
                        <div className="flex items-center justify-between sm:flex-row flex-col">
                            <h2 className="sm:text-xl text-md"> Customer Information</h2>
                            <span className="p-2 text-BtnColorLight dark:text-BtnColorDark dark:bg-[#8b9cad41] bg-gray-300 rounded-lg cursor-pointer items-end" onClick={() => setIsEdit(!isEdit)}>
                                <Edit />
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>
                                <p>User ID:</p>
                                <p className="font-semibold">{profileData?._id}</p>
                            </span>
                            <span>
                                <p>Role:</p>
                                <p className="font-semibold">{profileData?.role?.[0]}</p>
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="flex flex-col gap-2">
                                <label>User Name</label>
                                <Field placeHolder="Enter Your Name" type="text" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleField} name="username" value={username} disabled={!isEdit} />
                            </span>
                            {Role === "Agency" && (
                                <span className="flex flex-col gap-2">
                                    <span className="flex justify-between">
                                        <label>Agency Name</label>
                                    </span>
                                    <Field placeHolder="Enter Your Agency Name" type="text" className="gap-2" inputCustomClass="outline-none w-full" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleField} name="agencyName" value={agencyName} disabled={!isEdit} />
                                </span>
                            )}
                            {Role === "Operator" && (
                                <span className="flex flex-col gap-2">
                                    <span className="flex justify-between">
                                        <label>Phone</label>
                                    </span>
                                    <Field placeHolder="Enter Your Phone" type="number" className="gap-2" inputCustomClass="outline-none w-full" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleField} name="phone" value={phone} disabled={!isEdit} />
                                </span>
                            )}
                            <span className="flex flex-col gap-2">
                                <span className="flex justify-between">
                                    <label>Email</label>
                                </span>
                                <Field placeHolder="Enter Your Email" type="email" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleField} name="email" value={email} disabled={true} />
                            </span>
                        </div>
                        <div className={`${isEdit ? "flex" : "hidden"} items-center justify-center gap-4 sm:flex-row flex-col`}>
                            <Button name={"Cancel"} mainClass="px-4 text-sm text-white w-36 cursor-pointer border-2 border-white" bgcolor="bg-transparent" textColor="dark:text-white text-black" />
                            <Button name={"Save Profile"} mainClass="px-4 text-sm w-36 cursor-pointer" onClick={handleUpdateProfile} isLoading={updateLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
