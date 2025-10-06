"use client";

import { Eye } from "lucide-react";

export type StatCardProps = {
    title: string;
    value: string | number;
    percentageChange?: string;
    change?: string;
    positive?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
};

const StatCard = ({ title, value, percentageChange, change, positive = true, icon, onClick }: StatCardProps) => {
    return (
        <div className="bg-white rounded-lg" style={{ padding: "0.75rem", marginBottom: "0.5rem" }}>
            <div className="flex flex-col">
                <h3 className="text-xs sm:text-sm text-gray-600 mb-1">{title}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg md:text-xl font-semibold" style={{ margin: "0" }}>
                            {value}
                        </span>
                        {percentageChange && (
                            <span className={`text-xs px-1 sm:px-1.5 py-0.5 rounded ${positive ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}`} style={{ marginLeft: "0.25rem" }}>
                                {percentageChange}
                            </span>
                        )}
                    </div>
                    {icon ? (
                        <div className="bg-gray-100 p-2 rounded-full">{icon}</div>
                    ) : (
                        <button className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 sm:p-1.5 rounded-full cursor-pointer" onClick={onClick}>
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                    )}
                </div>
                {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
            </div>
        </div>
    );
};

export default StatCard;
