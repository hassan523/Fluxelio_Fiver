"use client";
import {TrendingDown, TrendingUp} from "lucide-react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from "recharts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {ReactNode, useEffect, useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "../ui/button";
import dynamic from "next/dynamic";
import data2 from "../../DummyData/Data.json";
import {DatePicker} from "../DataPicker";

interface DateSelection {
	month: number;
	year: number;
	day?: number;
}

type RevenueChartProps = {
	currentRevenue: string | number;
	percentageChange: string;
	positive?: boolean;
	startDate?: string;
	endDate?: string;
	onDateChange?: (startDate: string, endDate: string) => void;
	footer?: ReactNode;
	chartHead?: string;
	selectedDate: DateSelection;
	setSelectedDate: (date: DateSelection) => void;
	chartData?: {
		balance: number;
		expenses: number;
		month: number;
		name: string;
		revenue: number;
		year: number;
	}[];
};

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-1)",
	},
	expenses: {
		label: "Expenses",
		color: "var(--chart-2)",
	},
	balance: {
		label: "Balance",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

const RevenueChart = ({chartHead, currentRevenue, percentageChange, positive = true, footer, selectedDate, setSelectedDate, chartData}: RevenueChartProps) => {
	const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

	const handleDateChange = (date: {month: number; year: number; day?: number}) => {
		setSelectedDate({month: date.month + 1, year: date.year});
	};

	const formatDisplayDate = () => {
		return `${selectedDate.year}`;
	};

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<Card className="bg-[#F3F5FA] dark:bg-cardBG rounded-sm overflow-hidden border-2 dark:border-textColorDark border-transparent">
			<CardHeader className="max-sm:px-2">
				<div className="flex items-center justify-between w-full ">
					<div className="flex flex-col gap-1 pl-2">
						<CardTitle>{chartHead || "Transactions Statistics"}</CardTitle>
						<CardDescription className="text-headingLight dark:text-textColorDark">{formatDisplayDate()}</CardDescription>
					</div>
					<DatePicker
						onDateChange={handleDateChange}
						placeholder="Select Period"
						// includeDay={true}
						includeMonth={false}
						className="w-48"
					/>
				</div>
			</CardHeader>

			<CardContent style={{padding: "0", paddingRight: "1.5rem"}}>
				<div className="flex items-baseline gap-2 mb-4 px-8">
					<span className="text-2xl font-semibold">{currentRevenue}</span>
				</div>

				<ChartContainer
					config={chartConfig}
					className="h-[255px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={chartData || data2?.RevenueStatistics}
					>
						<CartesianGrid vertical={true} />
						<XAxis
							dataKey="name"
							tickLine={true}
							axisLine={true}
							tickMargin={8}
							tickFormatter={(value) => (windowWidth < 400 ? value[0] : value)}
						/>
						<YAxis
							tickLine={true}
							axisLine={true}
							tickFormatter={(value) => `${value === 0 ? "0" : value / 1000 + "k"}`}
						/>
						<ChartTooltip
							cursor={true}
							content={<ChartTooltipContent />}
						/>
						<Line
							dataKey="revenue"
							type="monotone"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="expenses"
							type="monotone"
							stroke="var(--chart-2)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="balance"
							type="monotone"
							stroke="var(--chart-3)"
							strokeWidth={2}
							dot={true}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="max-sm:px-2">{footer}</CardFooter>
		</Card>
	);
};
export default dynamic(() => Promise.resolve(RevenueChart), {ssr: false});
