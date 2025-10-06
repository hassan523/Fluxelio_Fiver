"use client";

import {useTheme} from "next-themes";

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

const StatusBox = ({color = "green", value, isLoading = false}: {color: string; value: string; isLoading?: boolean}) => {
	const {theme} = useTheme();

	const smallSkeletonStyle = {
		height: "20px",
		width: "20px",
		...(theme == "dark" ? shimmerDark : shimmerLight),
	};
	return (
		<>
			{isLoading ? (
				<div style={{...smallSkeletonStyle, width: "60px"}}></div>
			) : (
				<div className={`px-3 py-1 rounded-sm flex items-center justify-center ${color == "green" ? "bg-statusGreen/15" : color == "yellow" ? "bg-statusYellow/15" : color == "red" ? "bg-statusRed/15" : ""}`}>
					<span className={`text-sm ${color == "green" ? "text-statusGreen" : color == "yellow" ? "text-statusYellow" : color == "red" ? "text-statusRed" : ""}`}>{value}</span>
				</div>
			)}
		</>
	);
};

export default StatusBox;
