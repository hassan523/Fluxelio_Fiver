"use client";

import Table from "@/components/Tables/Table";
import Layout from "@/Layout/Dashboard/Layout";
import React, {useEffect, useState} from "react";
import {Eye, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import {getCookie} from "cookies-next";
import {useGetAllAgencies} from "@/models/Agency/AgencyModel";
import {useDebounce} from "@/hooks/useDebounce/useDebounce";

const Agencies = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [agenciesData, setAgenciesData] = useState<any>([]);
	const [statusFilter, setStatusFilter] = useState<any>({});
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	const pageLimit = 10;

	const debouncedSearchTerm = useDebounce(searchTerm);

	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;

	const columns = [
		{key: "_id", header: "ID"},
		{key: "username", header: "User Name"},
		{key: "agencyName", header: "Agency Name", search: true},
		{key: "email", header: "Email"},
		{
			key: "status",
			header: "Status",
			select: ["Active", "Blocked"],
			displayName: "Select Status",
			// render: (_: any, item: any) => (
			// 	<DropdownMenu>
			// 		<DropdownMenuTrigger className="dark:bg-layoutDarkBG bg-white px-2.5 py-2 rounded-sm dark:border border-gray-500 cursor-pointer outline-none">
			// 			<span className="flex justify-between items-center gap-6">
			// 				Open
			// 				<ChevronDown size={16} />
			// 			</span>
			// 		</DropdownMenuTrigger>
			// 		<DropdownMenuContent>
			// 			<DropdownMenuLabel>My Account</DropdownMenuLabel>
			// 			<DropdownMenuSeparator />
			// 			<DropdownMenuItem>Profile</DropdownMenuItem>
			// 			<DropdownMenuItem>Billing</DropdownMenuItem>
			// 			<DropdownMenuItem>Team</DropdownMenuItem>
			// 			<DropdownMenuItem>Subscription</DropdownMenuItem>
			// 		</DropdownMenuContent>
			// 	</DropdownMenu>
			// ),
		},
		{
			key: "action",
			header: "Action",
			render: (_: any, item: any) => (
				<div className="flex justify-center gap-4">
					<div style={{cursor: "pointer"}}>
						<Eye
							className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark"
							onClick={() => router.push(`/agencies/${item?._id}`)}
						/>
					</div>

					<div style={{cursor: "pointer"}}>
						<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
					</div>
				</div>
			),
		},
	];

	const GetAllAgenciesAPI = useGetAllAgencies({page: currentPage, limit: pageLimit, Token, status: statusFilter?.status, search: statusFilter?.agencyName});

	const StructuredData = () => {
		const data = GetAllAgenciesAPI?.data?.agencies?.map((item) => ({
			_id: item?._id,
			username: item?.username,
			agencyName: item?.agencyName,
			email: item?.email,
			status: item?.status?.[0],
		}));
		setAgenciesData(data);
	};

	const handleSearchChange = (key: string, value: string | number) => {
		if (typeof value == "string") {
			if (key === "agencyName") {
				setSearchTerm(value);
			} else {
				setStatusFilter({...statusFilter, [key]: value});
			}
		}
	};

	useEffect(() => {
		StructuredData();
	}, [GetAllAgenciesAPI?.data || GetAllAgenciesAPI?.isLoading]);

	useEffect(() => {
		setStatusFilter({...statusFilter, agencyName: debouncedSearchTerm});
		setCurrentPage(1);
	}, [debouncedSearchTerm]);

	return (
		<Layout>
			<div className="flex flex-col gap-4 mt-5">
				<h1 className="text-xl font-semibold">Agencies</h1>
				<Table
					dataLength={GetAllAgenciesAPI?.data?.meta?.totalItems || 0}
					setStatusFilter={handleSearchChange}
					pageLimit={pageLimit}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					tableName="All Agencies List"
					columns={columns}
					data={agenciesData}
					isLoading={GetAllAgenciesAPI?.isLoading}
					actions={false}
					keyField="_id"
					selectKey="_id"
				/>
			</div>
		</Layout>
	);
};

export default Agencies;
