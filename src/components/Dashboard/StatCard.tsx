"use client";

import {Eye} from "lucide-react";
import {useTheme} from "next-themes";
import dynamic from "next/dynamic";

export type StatCardProps = {
	title: string;
	value: string | number;
	percentageChange?: string;
	change?: string;
	positive?: boolean;
	icon?: React.ReactNode;
	onClick?: () => void;
	isLoading?: boolean;
};

const shimmerDark = {
	backgroundImage: "linear-gradient(90deg, #303943 25%, #303943 50%, #303943 75%)",
	backgroundSize: "200% 100%",
	backgroundRepeat: "no-repeat",
	animation: "shimmer 1.5s infinite",
	borderRadius: "4px",
};

const shimmerLight = {
	backgroundImage: "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
	backgroundSize: "200% 100%",
	backgroundRepeat: "no-repeat",
	animation: "shimmer 1.5s infinite",
	borderRadius: "4px",
};

const StatCard = ({title, value, percentageChange, change, positive = true, icon, onClick, isLoading = false}: StatCardProps) => {
	const {theme} = useTheme();

	const skeletonStyle = {
		height: "20px",
		width: "100%",
		...(theme == "dark" ? shimmerDark : shimmerLight),
	};

	const smallSkeletonStyle = {
		height: "20px",
		width: "20px",
		...(theme == "dark" ? shimmerDark : shimmerLight),
	};
	return (
		<div
			className="bg-[#F3F5FA] dark:bg-cardBG rounded-sm border-2 dark:border-textColorDark border-transparent "
			style={{padding: "0.75rem"}}
		>
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						{isLoading ? <div style={{...smallSkeletonStyle, width: "80px"}}></div> : <h3 className="text-sm sm:text-lg dark:text-headingDark text-black mb-1">{title}</h3>}
						<div className="flex items-baseline gap-1 sm:gap-2">
							{isLoading ? (
								<div style={{...smallSkeletonStyle, width: "50px"}}></div>
							) : (
								<span
									className="sm:text-lg md:text-xl font-semibold dark:text-headingDark text-black"
									style={{margin: "0"}}
								>
									{value}
								</span>
							)}
							{percentageChange && (
								<span
									className={`text-xs px-1 sm:px-1.5 py-0.5 rounded ${positive ? "text-green-500 dark:bg-[#253c3b] bg-[#ddf4e7]" : "text-red-500 bg-[#e9524434] darK:bg-[#3c2e37]"}`}
									style={{marginLeft: "0.25rem"}}
								>
									{percentageChange}
								</span>
							)}
						</div>
					</div>
					<div className="flex flex-col">{icon && <div className="p-2 text-BtnColorLight dark:text-BtnColorDark dark:bg-[#8b9cad41] bg-gray-300 rounded-lg">{icon}</div>} </div>
				</div>

				{change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(StatCard), {ssr: false});
