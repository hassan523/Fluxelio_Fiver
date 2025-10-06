import Button from "@/components/Button/Button";
import DropDown from "@/components/DropDown/DropDown";
import Field from "@/components/InputField/Field";
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useSelectAgencies } from "@/models/Agency/AgencyModel";
import { useCreateTags } from "@/models/Tags/TagsModel";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useState } from "react";

const CreateTag = () => {
    const [createTagData, setCreateTagData] = useState<{ tagName: string }>({ tagName: "" });
    const [selectedID, setSelectedID] = useState<{ AgencyID: string; OfficeID: string }>({ AgencyID: "", OfficeID: "" });

    // Destructured
    const { tagName } = createTagData;
    const { AgencyID, OfficeID } = selectedID;

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const _id = cookiesData?.data?.user?._id;
    const role = cookiesData?.data?.user?.role?.[0];
    const Token = cookiesData?.data?.accessToken;

    const SelectAgencyAPI = useSelectAgencies({ Token, _id: role === "Admin" ? AgencyID : _id });
    const AllAgencies = SelectAgencyAPI?.data?.agencies;
    const AgencyOffice = AllAgencies ? SelectAgencyAPI?.data?.agencies?.[0]?.offices : [];

    // Create Tag API
    const { handleCreateTag, isLoading } = useCreateTags();

    const handleTags = () => {
        handleCreateTag({ agencyID: role === "Admin" ? AgencyID : _id, officeID: OfficeID, Token, tagName });
    };

    return (
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto rounded-sm">
            <div className="w-full h-fit flex items-center justify-center px-4 sm:px-6 py-2 border-b border-gray-200">
                <DialogTitle className="text-heading text-xl sm:text-2xl plusJakartaSans capitalize">Create Tag</DialogTitle>
            </div>
            <form className="flex flex-col gap-3">
                <span className="flex flex-col gap-2">
                    <label>Tag Name</label>
                    <Field placeHolder="Enter Your Tag Name" type="text" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={(e: ChangeEvent<HTMLInputElement>) => setCreateTagData({ tagName: e.target.value })} value={tagName} disabled={false} />
                </span>
                {role === "Admin" && <DropDown arraList={AllAgencies} onClick={(e: any) => setSelectedID({ AgencyID: e, OfficeID: "" })} displayKey="agencyName" selectedKey="_id" label="Select Agency" />}

                {(AgencyOffice?.length ?? 0) > 0 && <DropDown arraList={AgencyOffice} onClick={(e: any) => setSelectedID((prev) => ({ ...prev, OfficeID: e }))} displayKey="officeName" selectedKey="officeID" label="Select Office" />}

                <DialogFooter className={"my-2 "}>
                    <div className=" flex items-center  justify-center sm:flex-row flex-col px-6 w-full gap-4">
                        <DialogClose className=" rounded-sm text-center w-36 cursor-pointer font-normal h-11 text-RoseRed border-RoseRed border-2 px-10 py-3 transition-all duration-300 hover:scale-[103%]" style={{ lineHeight: "1rem" }}>
                            Cancel
                        </DialogClose>
                        <Button name={"Create Office"} onClick={handleTags} isLoading={isLoading} mainClass="px-4 text-sm w-36 cursor-pointer" />
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default dynamic(() => Promise.resolve(CreateTag), { ssr: false });
