"use client";
import React, { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from "../../ui/dialog";
import dynamic from "next/dynamic";
import Field from "../../InputField/Field";
import CustomButton from "../../Button/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { ShowWarningToast } from "../../Toast/Toast";
import { PlusCircle, Trash } from "lucide-react";
import { DaySchedule, GetOfficeResponse, TimeSlot, UpdateOfficeState } from "@/redux/Offices/OfficesTypes";
import { getCookie } from "cookies-next";
import { useUpdateOffices } from "@/models/Offices/OfficesModel";

interface Country {
    name: string;
    code: string;
    dial_code: string;
    flag: string;
}
const UpdateOffice = ({ isClose, data, type = "Both", agencyID }: { isClose?: any; data?: UpdateOfficeState; type?: string; agencyID: string }): JSX.Element => {
    const [updateOfficeFields, setUpdateOfficeFields] = useState<UpdateOfficeState>({
        officeName: data?.officeName || "",
        email: "",
        phone: "",
        status: ["Active"],
        address: {
            street: "",
            postalCode: "",
            city: "",
            country: "",
        },
        openingHours: [],
    });
    const [TimeSlot, setTimeSlot] = useState<DaySchedule>({ day: "", slots: [] as { open: string; close: string }[], closed: true });
    const [Time, setTime] = useState<TimeSlot>({ open: "", close: "" });
    const [countries, setCountries] = useState<Country[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [displayAddress, setDisplayAddress] = useState<{ country: string }>({
        country: "",
    });

    const { officeName, email, phone, openingHours } = updateOfficeFields;

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;

    // Set Data in state
    useEffect(() => {
        setUpdateOfficeFields({
            officeName: data?.officeName || "",
            email: data?.email || "",
            phone: data?.phone || "",
            status: data?.status || ["Active"],
            address: data?.address || {
                street: "",
                postalCode: "",
                city: "",
                country: "",
            },
            openingHours: data?.openingHours || [],
        });
        setDisplayAddress({ country: data?.address?.country ?? "" });
    }, [data]);
    console.log(updateOfficeFields);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateOfficeFields((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let debounceTimer: NodeJS.Timeout;

        if (displayAddress?.country) {
            debounceTimer = setTimeout(() => {
                const fetchCountries = async () => {
                    try {
                        const response = await fetch(`https://restcountries.com/v3.1/name/${displayAddress?.country}`, {
                            method: "GET",
                        });
                        const data = await response.json();
                        if (!Array.isArray(data)) {
                            return;
                        }
                        const formattedCountries = data
                            .map((country: any) => ({
                                name: country.name.common,
                                code: country.cca2,
                                dial_code: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}` : "",
                                flag: country.flags?.png || country.flags?.svg,
                            }))
                            .filter((c: any) => c.dial_code);

                        setCountries(formattedCountries);
                    } catch (error) {
                        console.error("Error fetching countries:", error);
                    }
                };

                fetchCountries();
            }, 300);
        }

        return () => clearTimeout(debounceTimer);
    }, [displayAddress?.country]);

    // Create Opening Hours
    const handleCreateTimeSlot = () => {
        if (TimeSlot.slots[0]?.open > TimeSlot.slots[0]?.close) {
            return ShowWarningToast("Incorrect Time");
        }

        if (TimeSlot.day === "" || TimeSlot.slots?.length === 0) {
            return ShowWarningToast("Please fill all Time slot fields");
        }
        setUpdateOfficeFields((prev) => ({ ...prev, openingHours: [...prev.openingHours, TimeSlot] }));
        setTimeSlot({ day: "", slots: [], closed: true });
    };

    // Create Time Only
    const handleCreateTime = () => {
        if (Time?.open > Time?.close) {
            return ShowWarningToast("Incorrect Time");
        }

        if (Time?.open === "" || Time?.close === "") {
            return ShowWarningToast("Please fill open and close Time fields");
        }

        setTimeSlot((prev) => ({ ...prev, slots: [...prev.slots, Time] }));
        setTime({ open: "", close: "" });
    };

    // Remove Time slot
    const removeTimeSlots = (FilterID: number) => {
        setUpdateOfficeFields((prev) => ({ ...prev, openingHours: prev.openingHours.filter((_, index) => index !== FilterID) }));
    };

    // Remove slot from TimeSlot
    const removeSlots = (FilterID: number) => {
        setTimeSlot((prev) => ({ ...prev, slots: prev.slots.filter((_, index) => index !== FilterID) }));
    };

    // set Agency ID
    useEffect(() => {
        setUpdateOfficeFields((prev) => ({ ...prev, agencyID: agencyID }));
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Holiday"];

    // Handle API
    const { handleUpdateOffice, UpdateLoading, UpdateError, isSuccess, status } = useUpdateOffices();

    const handleOffice = () => {
        handleUpdateOffice({ data: updateOfficeFields, Token, AgencyID: agencyID, officeID: (data as any)?._id });
        if (status === "fulfilled") {
            isClose?.();
        }
    };

    return (
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto rounded-sm">
            <div className="w-full h-fit flex items-center justify-center px-4 sm:px-6 py-2 border-b border-gray-200">
                <DialogTitle className="text-heading text-xl sm:text-2xl plusJakartaSans capitalize">Update Office</DialogTitle>
            </div>
            <form className="flex flex-col gap-4">
                <label>Office Information</label>

                {(type == "Both" || type == "Info") && (
                    <>
                        <Field placeHolder="Enter Your Office Name" type="text" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleChange} name="officeName" value={officeName} disabled={false} />
                        <Field placeHolder="Enter Your Email" type="email" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleChange} name="email" value={email} disabled={false} />
                        <Field placeHolder="Enter Your Phone" type="phone" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={handleChange} name="phone" value={phone} disabled={false} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight " size="lg">
                                    {TimeSlot.day || "Select Status"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setUpdateOfficeFields((prev) => ({ ...prev, status: ["Active"] }))}>Active</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUpdateOfficeFields((prev) => ({ ...prev, status: ["Blocked"] }))}>In-Active</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <label>Address</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Field
                                    placeHolder="Enter Your Street"
                                    type="text"
                                    className="gap-2"
                                    divStyle={{ padding: "0.75rem 0.8rem" }}
                                    onChange={(e: any) =>
                                        setUpdateOfficeFields((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                street: e.target.value,
                                            },
                                        }))
                                    }
                                    value={updateOfficeFields.address.street}
                                    disabled={false}
                                />
                            </div>
                            <div>
                                <Field
                                    placeHolder="Enter Your City"
                                    type="text"
                                    className="gap-2"
                                    divStyle={{ padding: "0.75rem 0.8rem" }}
                                    onChange={(e: any) =>
                                        setUpdateOfficeFields((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                city: e.target.value,
                                            },
                                        }))
                                    }
                                    value={updateOfficeFields.address.city}
                                    disabled={false}
                                />
                            </div>
                            <div>
                                <Field
                                    placeHolder="Enter Your Country"
                                    type="text"
                                    className="gap-2"
                                    divStyle={{ padding: "0.75rem 0.8rem" }}
                                    onChange={(e: any) => {
                                        setDisplayAddress({ country: e.target.value });
                                        setIsOpen(true);
                                    }}
                                    value={displayAddress?.country}
                                    disabled={false}
                                />
                                {countries.length > 0 && displayAddress?.country && isOpen && (
                                    <div className="absolute z-50 w-auto bg-layoutLightBG dark:bg-layoutDarkBG rounded-md mt-1 max-h-50 overflow-y-auto border border-gray-300">
                                        {countries.map((item) => (
                                            <div
                                                key={item.code}
                                                onClick={() => {
                                                    setUpdateOfficeFields((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            country: item.code,
                                                        },
                                                    }));
                                                    setDisplayAddress({ country: item.name });
                                                    setIsOpen(false);
                                                }}
                                                className="px-4 py-2 cursor-pointer hover:bg-BtnColorDark dark:hover:bg-BtnColorLight flex items-center gap-2"
                                            >
                                                {item.flag && <img src={item.flag} alt="flag" className="w-5 h-4" />}
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Field
                                    placeHolder="Enter Your PostalCode"
                                    type="number"
                                    className="gap-2"
                                    divStyle={{ padding: "0.75rem 0.8rem" }}
                                    onChange={(e: any) =>
                                        setUpdateOfficeFields((prev) => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                postalCode: e.target.value,
                                            },
                                        }))
                                    }
                                    value={updateOfficeFields.address.postalCode}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </>
                )}
                {(type == "Both" || type == "Time") && (
                    <>
                        <label>Time Slot</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <div className="h-[3rem] flex flex-col gap-2">
                                <small>Select Day:</small>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full" size="lg">
                                            {TimeSlot.day || "Select Day"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center">
                                        {days.map((item, i) => (
                                            <DropdownMenuItem key={i} onClick={() => setTimeSlot((prev) => ({ ...prev, day: item as DaySchedule["day"] }))}>
                                                {item}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="h-[3rem] flex flex-col gap-2">
                                <small>Open or Close:</small>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full" size="lg">
                                            {TimeSlot?.closed ? "Open" : "Close"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center">
                                        <DropdownMenuItem onClick={() => setTimeSlot((prev) => ({ ...prev, closed: true }))}>Open</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTimeSlot((prev) => ({ ...prev, closed: false }))}>Close</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex w-full col-span-2 gap-4 mt-6">
                                <div className=" flex flex-col gap-2 w-full">
                                    <small>Open Time:</small>
                                    <Field placeHolder="Enter Your Phone" type="time" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={(e: any) => setTime((prev: any) => ({ ...prev, open: e.target.value }))} value={Time?.open} disabled={false} />
                                </div>
                                <div className=" flex flex-col gap-2 w-full">
                                    <small>Close Time:</small>
                                    <div className="flex w-full items-center gap-2">
                                        <div className="w-full">
                                            <Field placeHolder="Enter Your Phone" type="time" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} onChange={(e: any) => setTime((prev: any) => ({ ...prev, close: e.target.value }))} value={Time?.close} disabled={false} />
                                        </div>
                                        <PlusCircle className="cursor-pointer" onClick={handleCreateTime} />
                                    </div>
                                </div>
                            </div>
                            {TimeSlot?.slots?.length >= 1 &&
                                TimeSlot?.slots?.map((item, i) => (
                                    <div key={i + 3} className="flex w-full col-span-2 gap-4">
                                        <div className=" flex flex-col gap-2 w-full">
                                            <Field placeHolder="Enter Your Phone" type="time" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} value={item?.open} disabled={true} />
                                        </div>
                                        <div className=" flex flex-col gap-2 w-full">
                                            <div className="flex w-full items-center gap-2">
                                                <div className="w-full">
                                                    <Field placeHolder="Enter Your Phone" type="time" className="gap-2" divStyle={{ padding: "0.75rem 0.8rem" }} value={item?.close} disabled={true} />
                                                </div>
                                                <Trash color="red" size={20} className="cursor-pointer" onClick={() => removeSlots(i)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div>
                            <CustomButton onClick={handleCreateTimeSlot} name={"Add TimeSlot"} mainClass="px-4 text-sm w-36 cursor-pointer" />
                        </div>
                        {openingHours?.map((item, i) => (
                            <div className="flex justify-between px-2 py-3 bg-[#0e0f2a] items-center rounded-sm" key={i + 1}>
                                <div className="flex items-center gap-2">
                                    <label>Day:</label>
                                    <p>{item?.day}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Open At:</label>
                                    <p>{item?.slots[0]?.open}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Close At:</label>
                                    <p>{item?.slots[0]?.close}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Open:</label>
                                    <p>{item?.closed ? "Yes" : "No"}</p>
                                </div>
                                <Trash color="red" size={20} className="cursor-pointer" onClick={() => removeTimeSlots(i)} />
                            </div>
                        ))}
                    </>
                )}
                <DialogFooter className={"pb-4 "}>
                    <div className=" flex items-center  justify-center px-6 w-full gap-4">
                        <DialogClose className=" rounded-sm text-center w-36 cursor-pointer font-normal h-11 text-RoseRed border-RoseRed border-2 px-10 py-3 transition-all duration-300 hover:scale-[103%]" style={{ lineHeight: "1rem" }}>
                            Cancel
                        </DialogClose>
                        <CustomButton onClick={handleOffice} isLoading={UpdateLoading} name={"Update Office"} mainClass="px-4 text-sm w-36 cursor-pointer" />
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default dynamic(() => Promise.resolve(UpdateOffice), { ssr: false });
