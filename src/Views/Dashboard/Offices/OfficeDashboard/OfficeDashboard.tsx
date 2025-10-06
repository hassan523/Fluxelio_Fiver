"use client";

import Layout from "@/Layout/Dashboard/Layout";
import StatCard from "@/components/Dashboard/StatCard";
import Table from "@/components/Tables/Table";
import {Archive, ArchiveRestore, Building2, Edit, Eye, Trash} from "lucide-react";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import CircleChart from "@/components/Dashboard/CircleChart";
import Data from "../../../../DummyData/Data.json";
import {useState} from "react";
import OpenModal from "@/components/OpenModal/OpenModal";
import BulkOperatorInvite from "@/components/Modals/Operator/BulkOperatorInvite";
import {useGetAllOperators} from "@/models/Operator/OperatorModal";
import {useParams, useRouter} from "next/navigation";
import {getCookie} from "cookies-next";
import {useGetAllUser} from "@/models/Users/UsersModel";
import AddUser from "@/components/Modals/Users/AddUser";
import {useGetOfficeParcel} from "@/models/Parcels/ParcelsModel";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/ui/dialog";
import UpdateStatus from "@/components/Modals/Parcel/UpdateStatus";
import {useGetSingleOffice} from "@/models/Offices/OfficesModel";
import formatDateOnly from "@/utils/FormatedTimeStamp/FormatedTimeStamp";
import UpdateOffice from "@/components/Modals/Office/UpdateOffice";

const OfficeDashboard = () => {
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
	const [currentPageUser, setCurrentPageUser] = useState(1);
	const [currentPageParcel, setCurrentPageParcel] = useState(1);
	const [UpdateStatusData, setUpdateStatusData] = useState({
		isOpen: false,
		data: null,
	});
	const [UpdateOffices, setUpdateOffices] = useState<any>([]);
	const [open, setOpen] = useState({
		info: false,
		time: false,
	});

	const pageLimit = 10;

	const {AgencyID, OfficeID} = useParams();
	const router = useRouter();

	const revenueData = {currentRevenue: "$240.8K", percentageChange: "+8.2%", date: "Jan 31, 2023"};

	const AgencyIdStr = Array.isArray(AgencyID) ? AgencyID[0] : AgencyID || "";
	const OfficeIdStr = Array.isArray(OfficeID) ? OfficeID[0] : OfficeID || "";

	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const _id = cookiesData?.data?.user?._id;
	const role = cookiesData?.data?.user?.role?.[0];

	const columns = [
		{key: "_id", header: "ID"},
		{key: "username", header: "User Name", search: true},
		{key: "phone", header: "Phone"},
		{key: "email", header: "Email"},
		{key: "agencyName", header: "Agency Name"},
		{key: "officeName", header: "Office Name"},
		{
			key: "action",
			header: "Action",
			render: (_: any, item: any) => (
				<div className="flex justify-center gap-4">
					<div
						style={{cursor: "pointer"}}
						onClick={() => (role == "Agency" ? router.push(`/offices/${OfficeIdStr}/operator/${item?._id}`) : router.push(`/agencies/${AgencyIdStr}/Offices/${OfficeIdStr}/operator/${item?._id}`))}
					>
						<Eye className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
					<div style={{cursor: "pointer"}}>
						<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
				</div>
			),
		},
	];

	const customerColumns = [
		{key: "_id", header: "ID"},
		{key: "username", header: "User Name", search: true},
		{key: "email", header: "Email"},
		{key: "phone", header: "Phone"},
		{key: "country", header: "Country"},
		{
			key: "action",
			header: "Action",
			render: (_: any, item: any) => (
				<div className="flex justify-center gap-4">
					<div style={{cursor: "pointer"}}>
						<Edit className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
					<div style={{cursor: "pointer"}}>
						<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
				</div>
			),
		},
	];

	const Parcelscolumns = [
		{key: "_id", header: "ID"},
		{key: "trackingID", header: "Tracking ID", search: true},
		{key: "weight", header: "Weight"},
		{key: "transportMethod", header: "Transport Method"},
		{key: "type", header: "Type", select: ["Single", "Mixed"], displayName: "Parcel Type"},
		{
			key: "status",
			header: "Status",
			displayName: "Filter Status",
			render: (_: any, item: any) => {
				return item?.type === "Mixed" ? (
					<Button className="border dark:border-white border-headingLight bg-transparent dark:text-white text-black hover:bg-transparent">{item?.status?.length > 18 ? `${item.status.slice(0, 18)}...` : item?.status}</Button>
				) : (
					<Button
						onClick={() => setUpdateStatusData((prev) => ({...prev, data: item, isOpen: true}))}
						className="cursor-pointer"
					>
						{item?.status?.length > 18 ? `${item.status.slice(0, 18)}...` : item?.status}
					</Button>
				);
			},
		},
		{
			key: "action",
			header: "Action",
			render: (_: any, item: any) => (
				<div className="flex justify-center gap-4">
					<div
						style={{cursor: "pointer"}}
						onClick={() => router.push(`/parcels/single-parcel/${item?._id}`)}
					>
						<Eye className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>

					<div style={{cursor: "pointer"}}>
						<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
				</div>
			),
		},
	];

	const GetAllOperatorsData = useGetAllOperators({AgencyID: role === "Admin" ? AgencyIdStr : _id, OfficeID: OfficeIdStr, Token: Token});
	const OperatorsData = GetAllOperatorsData?.data;

	const GetALlUsersData = useGetAllUser({agencyID: role === "Admin" ? AgencyIdStr : _id, officeID: OfficeIdStr, Token: Token});
	const UserData = GetALlUsersData?.data;

	const GetParcelData = useGetOfficeParcel({agencyID: role === "Admin" ? AgencyIdStr : _id, officeID: OfficeIdStr, Token: Token, role: role, page: currentPageParcel, limit: pageLimit});
	const ParcelData = GetParcelData?.data?.parcels?.map((item) => ({...item, type: item.mixedPackage ? "Mixed" : "Single"}));
	const isLoading = GetParcelData?.isLoading;

	const GetSingleOfficeData = useGetSingleOffice({
		AgencyID: role === "Admin" ? AgencyIdStr : _id,
		OfficeID: OfficeIdStr,
		parcelCountMonth: parcelCount.month,
		parcelCountYear: parcelCount.year,
		transactionStatsYear: transactionStats.year,
		revenueYear: revenue.year,
		Token: Token,
	});
	const singleOfficeData = GetSingleOfficeData?.data;
	const isSingleOfficeLoading = GetSingleOfficeData?.isLoading;

	console.log(singleOfficeData);

	return (
		<Layout>
			<div className="w-full space-y-6 ">
				<div className=" bg-[#F3F5FA] dark:bg-cardBG px-3 py-4 rounded-sm border-2 dark:border-textColorDark border-transparent flex items-center gap-3 h-full">
					<span className="p-2 text-BtnColorLight dark:text-BtnColorDark dark:bg-[#8b9cad41] bg-gray-300 rounded-md">
						<Building2 size={32} />
					</span>
					{isSingleOfficeLoading ? <h1 className="h1">Loading...</h1> : <h1 className="h1">{singleOfficeData?.office?.officeName}</h1>}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3  gap-3 sm:gap-4 md:gap-5">
					<div>
						<StatCard
							title="Total Operators"
							value={singleOfficeData?.operatorCount || "0"}
							icon={<ArchiveRestore className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div>
						<StatCard
							title="Total Parcels"
							value={singleOfficeData?.parcelCount || "0"}
							icon={<Archive className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
					<div>
						<StatCard
							title="Total Customers"
							value={singleOfficeData?.customerCount || "0"}
							icon={<Archive className="text-textColorLight dark:text-textColorDark" />}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-6">
					<div className="xl:col-span-1 col-span-3 rounded-sm h-full flex flex-col gap-4">
						<div className="bg-[#F3F5FA] dark:bg-cardBG px-5 py-4 rounded-sm border-2 dark:border-textColorDark border-transparent flex flex-col gap-3 h-full">
							<span className="flex items-center justify-between">
								<h1 className="font-semibold">Office Information</h1>
								<span
									className="p-2 text-BtnColorLight dark:text-BtnColorDark dark:bg-[#8b9cad41] bg-gray-300 rounded-md cursor-pointer"
									onClick={() => {
										setUpdateOffices(singleOfficeData?.office);
										setOpen({...open, info: true});
									}}
								>
									<Edit />
								</span>
							</span>
							<div className="flex flex-col gap-2">
								<div className="flex">
									<span className="w-[50%]">
										<p className="font-[200]">Agency Name</p>
										<p>{singleOfficeData?.office?.agencyName}</p>
									</span>
									<span className="w-[50%]">
										<p className="font-[200]">Email</p>
										<p>{singleOfficeData?.office?.email}</p>
									</span>
								</div>
								<div className="flex">
									<span className="w-[50%]">
										<p className="font-[200]">Office Name</p>
										<p>{singleOfficeData?.office?.officeName}</p>
									</span>
									<span className="w-[50%]">
										<p className="font-[200]">Address</p>
										<p>{`${singleOfficeData?.office?.address?.street}, ${singleOfficeData?.office?.address?.postalCode}, ${singleOfficeData?.office?.address?.city}, ${singleOfficeData?.office?.address?.country}`}</p>
									</span>
								</div>
								<div className="flex">
									<span className="w-[50%]">
										<p className="font-[200]">Registered At</p>
										<p>{formatDateOnly(singleOfficeData?.office?.createdAt || "")}</p>
									</span>
									<span className="w-[50%]">
										<p className="font-[200]">Status</p>
										<p>{singleOfficeData?.office?.status?.[0]}</p>
									</span>
								</div>
							</div>
						</div>
						<div className="bg-[#F3F5FA] dark:bg-cardBG px-5 py-4 rounded-sm border-2 dark:border-textColorDark border-transparent flex flex-col gap-3 h-full">
							<span className="flex items-center justify-between">
								<h1 className="font-semibold">Manage Schedule</h1>
								<span
									className="p-2 text-BtnColorLight dark:text-BtnColorDark dark:bg-[#8b9cad41] bg-gray-300 rounded-md cursor-pointer"
									onClick={() => {
										setUpdateOffices(singleOfficeData?.office);
										setOpen({...open, time: true});
									}}
								>
									<Edit />
								</span>
							</span>
							<div className="flex flex-col gap-2">
								{singleOfficeData?.office?.openingHours?.map((item, index) => (
									<div
										key={`openingHours${index}`}
										className="flex justify-between"
									>
										<p className="font-[200]">{item?.day}</p>
										<div className="flex items-center gap-1">
											{item?.slots?.map((time, timeIndex) => (
												<p key={`timeSlot${index}-${timeIndex}`}>
													({time?.open} - {time?.close})
												</p>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="h-full xl:col-span-2 col-span-3">
						<div className="col-span-2 max-xl:col-span-3 max-lg:col-span-5  rounded-sm  h-full flex flex-col overflow-hidden">
							<RevenueChart
								selectedDate={transactionStats}
								setSelectedDate={setTransactionStats}
								currentRevenue={`$${singleOfficeData?.transactionStatistics?.paymentValidated || "0"}`}
								percentageChange={revenueData.percentageChange}
								chartData={singleOfficeData?.transactionStatistics?.data || []}
								footer={
									<div className="flex w-full items-center justify-evenly max-sm:flex-col max-sm:gap-8">
										<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
											<div>Payment Pending</div>
											<span className="text-xl font-semibold">${singleOfficeData?.transactionStatistics?.pendingPayment || "0"}</span>
										</div>
										<div className="flex flex-col gap-1 items-center w-full">
											<div>Payment Validated</div>
											<span className="text-xl font-semibold">${singleOfficeData?.transactionStatistics?.paymentValidated || "0"}</span>
										</div>
									</div>
								}
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2  gap-6">
					<div className=" lg:col-span-1 col-span-2 rounded-sm  h-full flex flex-col  gap-4">
						<RevenueChart
							selectedDate={revenue}
							setSelectedDate={setRevenue}
							currentRevenue={`$${singleOfficeData?.revenueStatistics?.paymentValidated || "0"}`}
							percentageChange={revenueData.percentageChange}
							chartData={singleOfficeData?.revenueStatistics?.data || []}
							chartHead="Revenue Overview"
							footer={
								<div className="flex w-full items-center justify-evenly max-sm:flex-col max-sm:gap-8">
									<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
										<div>Customer Pays</div>
										<span className="text-xl font-semibold">${singleOfficeData?.revenueStatistics?.paymentValidated || "0"}</span>
									</div>
									<div className="flex flex-col gap-1 items-center w-full border-2 border-r-headingDark border-l-transparent border-b-transparent border-t-transparent">
										<div>Expense</div>
										<span className="text-xl font-semibold">${singleOfficeData?.revenueStatistics?.paymentValidated || "0"}</span>
									</div>
									<div className="flex flex-col gap-1 items-center w-full">
										<div>Balance</div>
										<span className="text-xl font-semibold">${singleOfficeData?.revenueStatistics?.balance || "0"}</span>
									</div>
								</div>
							}
						/>
					</div>
					<div className="h-full  lg:col-span-1 col-span-2">
						<CircleChart
							selectedDate={parcelCount}
							setSelectedDate={setParcelCount}
							totalParcel={singleOfficeData?.parcelsInMonth || 0}
						/>
					</div>
				</div>

				<div className="w-full flex flex-col gap-2 rounded-sm  overflow-x-auto overflow-y-hidden dark:border-textColorDark border-transparent">
					<Table
						isModal
						ModalName="Add Operator"
						Modal={<BulkOperatorInvite />}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						tableName="Operators List"
						columns={columns}
						data={OperatorsData?.operators || []}
						actions={false}
						keyField="_id"
						selectKey="name"
						isLoading={GetAllOperatorsData?.isLoading}
					/>
				</div>

				<div className="w-full flex flex-col gap-2 rounded-sm  overflow-x-auto overflow-y-hidden dark:border-textColorDark border-transparent">
					<Table
						isModal
						ModalName="Add Customer"
						Modal={<AddUser />}
						currentPage={currentPageUser}
						setCurrentPage={setCurrentPageUser}
						tableName="Customers List"
						columns={customerColumns}
						data={UserData?.users || []}
						actions={false}
						keyField="_id"
						selectKey="name"
						isLoading={GetALlUsersData?.isLoading}
					/>
				</div>

				<div className="w-full flex flex-col gap-2 rounded-sm  overflow-x-auto overflow-y-hidden dark:border-textColorDark border-transparent">
					<Table
						isBtn
						BtnName="Create Parcel"
						BtnClick={() => (role == "Admin" ? router.push(`/create-parcel/${AgencyIdStr}`) : router.push("/parcels/create-parcel"))}
						currentPage={currentPageParcel}
						setCurrentPage={setCurrentPageParcel}
						isLoading={isLoading}
						tableName="Parcels List"
						columns={Parcelscolumns}
						data={ParcelData || []}
						actions={false}
						keyField="_id"
						selectKey="name"
						pageLimit={pageLimit}
						dataLength={GetParcelData?.data?.meta?.totalItems || 0}
					/>
				</div>

				<div>
					<OpenModal
						isOpen={open.info}
						changeOpen={(e) => setOpen((prev: any) => ({...prev, info: e}))}
						Modal={
							<UpdateOffice
								isClose={() => setOpen({...open, info: false})}
								data={UpdateOffices}
								type="Info"
								agencyID={role == "Agency" ? _id : AgencyIdStr}
							/>
						}
					/>
					<OpenModal
						isOpen={open.time}
						changeOpen={(e) => setOpen((prev: any) => ({...prev, time: e}))}
						Modal={
							<UpdateOffice
								isClose={() => setOpen({...open, time: false})}
								data={UpdateOffices}
								type="Time"
								agencyID={role == "Agency" ? _id : AgencyIdStr}
							/>
						}
					/>
				</div>
			</div>
			<Dialog
				open={UpdateStatusData?.isOpen}
				onOpenChange={(e) => setUpdateStatusData((prev) => ({...prev, isOpen: e, data: null}))}
			>
				<UpdateStatus
					agencyID={role == "Admin" ? AgencyIdStr : role == "Agency" ? _id : cookiesData?.data?.user?.agencyID}
					UpdateStatusData={UpdateStatusData}
					setterFunction={setUpdateStatusData}
				/>
			</Dialog>
		</Layout>
	);
};

export default OfficeDashboard;
