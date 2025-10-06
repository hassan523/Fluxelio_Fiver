"use client";

import {TrendingUp} from "lucide-react";
import {Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer} from "@/components/ui/chart";
import {DatePicker} from "@/components/DataPicker";
import dynamic from "next/dynamic";

export const description = "A radial chart with text";

const chartData = [{browser: "safari", visitors: 200, fill: "var(--color-safari)"}];

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	safari: {
		label: "Safari",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

interface DateSelection {
	month: number;
	year: number;
	day?: number;
}

interface CircleChartProps {
	selectedDate: DateSelection;
	setSelectedDate: (date: DateSelection) => void;
	totalParcel?: number;
}

const CircleChart = ({selectedDate, setSelectedDate, totalParcel = 200}: CircleChartProps) => {
	const handleDateChange = (date: {month: number; year: number; day?: number}) => {
		setSelectedDate({month: date.month + 1, year: date.year});
	};

	const formatDisplayDate = () => {
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return `${months[selectedDate.month - 1]} ${selectedDate.year}`;
	};

	return (
		<Card className="flex flex-col bg-[#F3F5FA] dark:bg-cardBG rounded-sm overflow-hidden border-2 dark:border-textColorDark border-transparent">
			<CardHeader className="items-start pb-0 max-sm:px-2">
				<div className="flex justify-between w-full items-center">
					<div className="flex flex-col gap-1">
						<CardTitle>Parcels</CardTitle>
						<CardDescription className="text-headingLight dark:text-textColorDark">{formatDisplayDate()}</CardDescription>
					</div>
					<DatePicker
						onDateChange={handleDateChange}
						placeholder="Select Period"
						// includeDay={true}
						className="w-48"
					/>
				</div>
			</CardHeader>
			<CardContent className="flex-1 pb-0 max-sm:px-2">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square h-[21.8rem] w-full"
				>
					<RadialBarChart
						data={[{...chartData[0], totalParcel}]}
						startAngle={0}
						endAngle={250}
						innerRadius={80}
						outerRadius={110}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted dark:last:fill-cardBG"
							polarRadius={[86, 74]}
						/>
						<RadialBar
							dataKey="visitors"
							background
							cornerRadius={10}
						/>
						<PolarRadiusAxis
							tick={false}
							tickLine={false}
							axisLine={false}
						>
							<Label
								content={({viewBox}) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-4xl font-bold"
												>
													{totalParcel.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Parcels
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm max-sm:px-2">
				<div className="text-textColorLight dark:text-textColorDark leading-none">Showing total parcels for {formatDisplayDate()}</div>
			</CardFooter>
		</Card>
	);
};
export default dynamic(() => Promise.resolve(CircleChart), {ssr: false});
