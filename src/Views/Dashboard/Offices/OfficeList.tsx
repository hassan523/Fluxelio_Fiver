"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Eye, Trash, Edit} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/Layout/Dashboard/Layout";
import Table from "@/components/Tables/Table";
import {getCookie} from "cookies-next";
import {useGetAllOffices} from "@/models/Offices/OfficesModel";
import AddOffice from "@/components/Modals/Office/AddOffice";
import OpenModal from "@/components/OpenModal/OpenModal";
import UpdateOffice from "@/components/Modals/Office/UpdateOffice";
import {useDebounce} from "@/hooks/useDebounce/useDebounce";

const OfficeList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [officesData, setOfficesData] = useState<any>([]);
	const [UpdateOffices, setUpdateOffices] = useState<any>([]);
	const [open, setOpen] = useState({createOffice: false, UpdateOffice: false});
	const [searchTerm, setSearchTerm] = useState("");
	const [search, setSearch] = useState("");
	const router = useRouter();

	const debouncedSearchTerm = useDebounce(searchTerm);

	const pageLimit = 10;

	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const _id = cookiesData?.data?.user?._id;

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
							onClick={() => router.push(`/offices/${item?._id}`)}
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

	const GetAllOfficesAPI = useGetAllOffices({page: currentPage, limit: pageLimit, AgencyID: _id, Token, search: search});

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
			<div className="w-full mx-auto pt-6 flex flex-col gap-4">
				<div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg ">
					<div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
						<div>
							<h2 className="text-xl font-semibold">Office Management</h2>
							<p className="text-gray-500 text-sm">manage your office in the system</p>
						</div>
						<div>
							<OpenModal
								isModal
								isOpen={open?.createOffice}
								changeOpen={(e) => setOpen((prev: any) => ({...prev, createOffice: e}))}
								Modal={<AddOffice isClose={() => setOpen((prev: any) => ({...prev, createOffice: false}))} />}
							/>
							<OpenModal
								isOpen={open?.UpdateOffice}
								changeOpen={(e) => setOpen((prev: any) => ({...prev, UpdateOffice: e}))}
								Modal={
									<UpdateOffice
										isClose={() => setOpen((prev: any) => ({...prev, UpdateOffice: false}))}
										data={UpdateOffices}
										agencyID={_id}
									/>
								}
							/>
						</div>
					</div>
				</div>

				<div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg ">
					<Table
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						tableName="Office List"
						data={officesData}
						columns={columns}
						actions={false}
						keyField="_id"
						pageLimit={pageLimit}
						setStatusFilter={handleSearchChange}
						dataLength={GetAllOfficesAPI?.data?.meta?.totalItems || 0}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default OfficeList;
