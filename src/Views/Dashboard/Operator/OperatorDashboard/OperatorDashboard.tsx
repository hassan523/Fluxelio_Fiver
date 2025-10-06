"use client";

import React, {useState} from "react";
import Layout from "@/Layout/Dashboard/Layout";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import CircleChart from "@/components/Dashboard/CircleChart";
import StatCard from "@/components/Dashboard/StatCard";
import {Archive, ArchiveRestore, Users} from "lucide-react";
import {getCookie} from "cookies-next";
import {useParams, useRouter} from "next/navigation";
import {useGetDashboard} from "@/models/Dashboard/DashboardModel";

const OperatorDashboard = () => {
	const currentDate = new Date();

	const [parcelCount, setParcelCount] = useState({
		month: currentDate.getMonth() + 1,
		year: currentDate.getFullYear(),
	});
	const [transactionStats, setTransactionStats] = useState({
		month: currentDate.getMonth() + 1,
		year: currentDate.getFullYear(),
	});
	const [revenue, setRevenue] = useState({
		month: currentDate.getMonth() + 1,
		year: currentDate.getFullYear(),
	});
	const revenueData = {
		currentRevenue: "$240.8K",
		percentageChange: "+8.2%",
		date: "Jan 31, 2023",
	};

	const router = useRouter();
	const {operatorID} = useParams();
	const operatorIdStr = Array.isArray(operatorID) ? operatorID[0] : operatorID || "";

	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const _id = cookiesData?.data?.user?._id;
	const role = cookiesData?.data?.user?.role?.[0];

	const getDashboardData = useGetDashboard({
		id: role === "Operator" ? _id : operatorIdStr,
		parcelCountMonth: parcelCount.month,
		parcelCountYear: parcelCount.year,
		transactionStatsYear: transactionStats.year,
		revenueYear: revenue.year,
		Token,
	});
	const dashboardData = getDashboardData?.data;
	const isLoading = getDashboardData?.isLoading;

	console.log(dashboardData);

	return (
		<Layout>
			<div className="w-full space-y-6 ">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
					<div>
						<StatCard
							title="Pending Parcels"
							value={dashboardData?.pendingParcelCount || "0"}
							icon={<ArchiveRestore className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div>
						<StatCard
							title="Total Parcels"
							value={dashboardData?.totalParcelCount || "0"}
							icon={<Archive className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div>
						<StatCard
							title="Total Customers"
							value={dashboardData?.customerCount || "0"}
							icon={<Users className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 max-xl:grid-cols-5 gap-6">
					<div className="col-span-2 max-xl:col-span-3 max-lg:col-span-5  rounded-sm h-full flex flex-col overflow-hidden">
						<RevenueChart
							selectedDate={transactionStats}
							setSelectedDate={setTransactionStats}
							currentRevenue={`$${dashboardData?.transactionStatistics?.paymentValidated || "0"}`}
							percentageChange={revenueData.percentageChange}
							chartData={dashboardData?.transactionStatistics?.data || []}
							footer={
								<div className="flex w-full items-center justify-evenly max-sm:flex-col max-sm:gap-8">
									<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
										<div>Payment Pending</div>
										<span className="text-xl font-semibold">${dashboardData?.transactionStatistics?.pendingPayment}</span>
									</div>
									<div className="flex flex-col gap-1 items-center w-full">
										<div>Payment Validated</div>
										<span className="text-xl font-semibold">${dashboardData?.transactionStatistics?.paymentValidated}</span>
									</div>
								</div>
							}
						/>
					</div>
					<div className="h-full max-xl:col-span-2 max-lg:col-span-5">
						<CircleChart
							selectedDate={parcelCount}
							setSelectedDate={setParcelCount}
							totalParcel={dashboardData?.parcelsInMonth || 0}
						/>
					</div>
				</div>

				<RevenueChart
					selectedDate={revenue}
					setSelectedDate={setRevenue}
					currentRevenue={`$${dashboardData?.revenueStatistics?.paymentValidated || "0"}`}
					percentageChange={revenueData.percentageChange}
					chartHead="Revenue Overview"
					chartData={dashboardData?.revenueStatistics?.data || []}
					footer={
						<div className="flex w-full items-center justify-evenly max-sm:flex-col max-sm:gap-8">
							<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
								<div>Customer Pays</div>
								<span className="text-xl font-semibold">${dashboardData?.revenueStatistics?.paymentValidated || "0"}</span>
							</div>
							<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
								<div>Expense</div>
								<span className="text-xl font-semibold">${dashboardData?.revenueStatistics?.pendingPayment}</span>
							</div>
							<div className="flex flex-col gap-1 items-center w-full">
								<div>Balance</div>
								<span className="text-xl font-semibold">${dashboardData?.revenueStatistics?.balance}</span>
							</div>
						</div>
					}
				/>
			</div>
		</Layout>
	);
};

export default OperatorDashboard;
