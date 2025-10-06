import { SelectAgencyResponse } from "@/redux/Agency/AgencyTypes";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

const DropDown = ({ arraList, onClick, selectedKey, displayKey, label }: { arraList?: any; onClick?: (value: string) => void; selectedKey?: string; displayKey?: string; label?: string }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [SelectedValue, setSelectedValue] = useState("");

    let ArrayLength;

    const length = arraList?.length ?? 0;

    if (length === 1 || length === 2) {
        ArrayLength = 2;
    } else if (length > 2) {
        ArrayLength = 4;
    } else {
        ArrayLength = 0;
    }

    const height = 2.5 + 3.5 * ArrayLength + "rem";

    return (
        <span className={`flex flex-col gap-2  w-full cursor-pointer`} style={{ height: isOpen ? height : "5rem" }}>
            <label>{label ? label : "Select Agency"}</label>
            <span className="flex items-center justify-center  px-4 border dark:border-white border-gray-600 rounded-sm ">
                <ol className="w-full outline-0 py-3 relative">
                    <span className="w-full flex items-center justify-between " onClick={() => setIsOpen(!isOpen)}>
                        <li>{SelectedValue || label}</li>
                        {isOpen ? <ChevronDown /> : <ChevronUp />}
                    </span>
                    <span className={`top-12 w-full ${isOpen ? "absolute " : "hidden"} mt-1 rounded-sm ${isOpen && `overflow-y-scroll `} overflow-x-hidden`} style={{ height: (arraList?.length ?? 0) <= 2 ? "auto" : "10rem", overflowY: (arraList?.length ?? 0) <= 3 ? "hidden" : "scroll" }}>
                        {arraList?.map((item: string) => (
                            <li
                                className="bg-white dark:bg-layoutDarkBG w-full px-4 py-2 nth-1:border-none border-t border-gray-500 cursor-pointer"
                                key={(item as any)?._id || (selectedKey ? item[selectedKey as any] : undefined)}
                                onClick={(e) => {
                                    const value = selectedKey && typeof item === "object" ? item[selectedKey] : typeof item === "string" ? item : (e.target as HTMLElement).innerText;
                                    const Display = displayKey && typeof item === "object" ? item[displayKey] : typeof item === "string" ? item : (e.target as HTMLElement).innerText;
                                    onClick?.(value);
                                    setSelectedValue(Display);
                                    setIsOpen(false);
                                }}
                            >
                                {typeof item === "object" ? (displayKey ? item[displayKey] : "") : item}
                            </li>
                        ))}
                    </span>
                </ol>
            </span>
        </span>
    );
};

export default DropDown;
