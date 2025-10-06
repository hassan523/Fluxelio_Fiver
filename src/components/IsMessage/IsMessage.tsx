import Layout from "@/Layout/Dashboard/Layout";
import React from "react";

const IsMessage = ({ message }: { message: string }) => {
    return (
        <div className="w-full h-[calc(84vh-10rem)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <p className="text-gray-500">{message || "Something went wrong"}</p>
            </div>
        </div>
    );
};

export default IsMessage;
