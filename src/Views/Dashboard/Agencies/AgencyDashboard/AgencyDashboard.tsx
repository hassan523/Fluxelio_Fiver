"use client";

import React, {useEffect, useState} from "react";
import Table from "@/components/Tables/Table";
import Layout from "@/Layout/Dashboard/Layout";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import CircleChart from "@/components/Dashboard/CircleChart";
import StatCard from "@/components/Dashboard/StatCard";
import {Archive, ArchiveRestore, Edit, Eye, Landmark, Trash, Users} from "lucide-react";
import OpenModal from "@/components/OpenModal/OpenModal";
import AddOffice from "@/components/Modals/Office/AddOffice";
import UpdateOffice from "@/components/Modals/Office/UpdateOffice";
import {getCookie} from "cookies-next";
import {useGetAllOffices} from "@/models/Offices/OfficesModel";
import {useParams, useRouter} from "next/navigation";
import {useGetDashboard} from "@/models/Dashboard/DashboardModel";
import {useDebounce} from "@/hooks/useDebounce/useDebounce";

const AgencyDashboard = () => {
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
	const [currentPage, setCurrentPage] = useState(1);
	const revenueData = {
		currentRevenue: "$240.8K",
		percentageChange: "+8.2%",
		date: "Jan 31, 2023",
	};
	const [UpdateOffices, setUpdateOffices] = useState<any>([]);
	const [officesData, setOfficesData] = useState<any>([]);
	const [open, setOpen] = useState({createOffice: false, UpdateOffice: false});
	const [searchTerm, setSearchTerm] = useState("");
	const [search, setSearch] = useState("");

	const debouncedSearchTerm = useDebounce(searchTerm);

	const router = useRouter();
	const {AgencyID} = useParams();
	const agencyIdStr = Array.isArray(AgencyID) ? AgencyID[0] : AgencyID || "";

	const pageLimit = 10;

	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const _id = cookiesData?.data?.user?._id;
	const role = cookiesData?.data?.user?.role?.[0];

	const columns = [
		{key: "_id", header: "ID"},
		{key: "email", header: "Email"},
		{key: "officeName", header: "Office Name", search: true},
		{key: "phone", header: "Phone"},
		{key: "street", header: "Street"},
		{key: "postalCode", header: "Postal Code"},
		{key: "city", header: "City"},
		{key: "country", header: "Country"},
		{key: "status", header: "Status"},
		{
			key: "action",
			header: "Action",
			render: (_: any, item: any) => (
				<div className="flex justify-center gap-4">
					<div style={{cursor: "pointer"}}>
						<Eye
							className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark"
							onClick={() => (role == "Agency" ? router.push(`/offices/${item?._id}`) : router.push(`/agencies/${agencyIdStr}/Offices/${item?._id}`))}
						/>
					</div>
					<div style={{cursor: "pointer"}}>
						<Edit
							className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark"
							onClick={() => {
								setUpdateOffices(item?.AllData);
								setOpen((prev: any) => ({...prev, UpdateOffice: true}));
							}}
						/>
					</div>
					<div style={{cursor: "pointer"}}>
						<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
				</div>
			),
		},
	];

	const GetAllOfficesAPI = useGetAllOffices({page: currentPage, limit: pageLimit, AgencyID: role === "Agency" ? _id : agencyIdStr, Token, search: search});
	const getDashboardData = useGetDashboard({
		id: role === "Agency" ? _id : agencyIdStr,
		parcelCountMonth: parcelCount.month,
		parcelCountYear: parcelCount.year,
		transactionStatsYear: transactionStats.year,
		revenueYear: revenue.year,
		Token,
	});
	const dashboardData = getDashboardData?.data;

	const StructuredData = () => {
		const data = GetAllOfficesAPI?.data?.offices?.map((item) => ({
			_id: item?._id,
			email: item?.email,
			officeName: item?.officeName,
			phone: item?.phone,
			street: item?.address?.street,
			postalCode: item?.address?.postalCode,
			city: item?.address?.city,
			country: item?.address?.country,
			status: item?.status?.[0],
			AllData: item,
		}));
		setOfficesData(data);
	};

	const handleSearchChange = (key: string, value: string | number) => {
		if (typeof value == "string") {
			setSearchTerm(value);
		}
	};

	useEffect(() => {
		StructuredData();
	}, [GetAllOfficesAPI?.data || GetAllOfficesAPI?.isLoading]);

	useEffect(() => {
		setSearch(debouncedSearchTerm);
		setCurrentPage(1);
	}, [debouncedSearchTerm]);

	return (
		<Layout>
			<div className="w-full space-y-6 ">
				<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4  gap-3 sm:gap-4 md:gap-5 lg:gap-6">
					<div>
						<StatCard
							title="All Offices"
							value={dashboardData?.officeCount || "0"}
							icon={<Landmark className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div>
						<StatCard
							title="Pending Parcels"
							value={dashboardData?.pendingParcelCount || "0"}
							icon={<ArchiveRestore className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div className="max-md:col-span-2 max-sm:col-span-1">
						<StatCard
							title="Total Parcels"
							value={dashboardData?.totalParcelCount || "0"}
							icon={<Archive className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div className="max-md:col-span-2 max-sm:col-span-1">
						<StatCard
							title="Total Customers"
							value={dashboardData?.customerCount || "0"}
							icon={<Users className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 max-xl:grid-cols-5 gap-6">
					<div className="col-span-2 max-xl:col-span-3 max-lg:col-span-5  rounded-sm  h-full flex flex-col overflow-hidden">
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
					chartData={dashboardData?.revenueStatistics?.data || []}
					chartHead="Revenue Overview"
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

				<div className="w-full gap-3 flex flex-col rounded-sm  overflow-x-auto overflow-y-hidden dark:border-textColorDark border-textColorLight">
					<Table
						isModal
						IsModalOpen={open?.createOffice}
						setStatusFilter={handleSearchChange}
						HandleChangeModal={(e) => setOpen((prev: any) => ({...prev, createOffice: e}))}
						Modal={<AddOffice isClose={() => setOpen((prev: any) => ({...prev, createOffice: false}))} />}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						tableName="Office List"
						data={officesData}
						columns={columns}
						actions={false}
						keyField="_id"
						pageLimit={pageLimit}
						dataLength={GetAllOfficesAPI?.data?.meta?.totalItems || 0}
					/>
					<div className="flex justify-end">
						<OpenModal
							isOpen={open?.UpdateOffice}
							changeOpen={(e) => setOpen((prev: any) => ({...prev, UpdateOffice: e}))}
							Modal={
								<UpdateOffice
									isClose={() => setOpen((prev: any) => ({...prev, UpdateOffice: false}))}
									data={UpdateOffices}
									agencyID={role == "Agency" ? _id : agencyIdStr}
								/>
							}
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default AgencyDashboard;
