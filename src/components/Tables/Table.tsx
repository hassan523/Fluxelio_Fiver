"use client";

import dynamic from "next/dynamic";
import React, {useState, useEffect, useRef, ReactNode, Dispatch, SetStateAction} from "react";
import {useRouter} from "next/navigation";
import {ChevronDown, ChevronUp, Edit, Eye, Search, Trash} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import UIButton from "../Button/Button";
import Field from "../InputField/Field";
import OpenModal from "../OpenModal/OpenModal";
import {useTheme} from "next-themes";

interface TableProps<T> {
	tableName?: string;
	data: T[];
	columns: any[];
	onRowClick?: (item: T) => void;
	onViewClick?: (item: T) => void;
	onEditClick?: (item: T) => void;
	keyField?: string;
	selectKey?: string;
	statusField?: string;
	statusStyles?: Record<string, string>;
	defaultStatusStyles?: {
		active: string;
		inactive: string;
		delivered: string;
		picking_up: string;
		on_way: string;
	};
	href?: string;
	actions?: boolean;
	eye?: boolean;
	edit?: boolean;
	trash?: boolean;
	isLoading?: boolean;
	setId?: (id: string) => void;
	setSelectedRowData?: (data: any) => void;
	maxTextLength?: number;
	deleteFunctions?: () => void;
	tableStyle?: React.CSSProperties;
	theadStyle?: React.CSSProperties;
	trStyle?: React.CSSProperties;
	tbodyStyle?: React.CSSProperties;
	isSelect?: boolean;
	currentPage?: number;
	setCurrentPage: (page: number) => void;
	setStatusFilter?: (key: string, value: string | number) => void;
	pageLimit?: number;
	dataLength?: number;
	IsModalOpen?: boolean;
	HandleChangeModal?: Dispatch<SetStateAction<boolean>>;
	Modal?: ReactNode;
	isModal?: boolean;
	ModalName?: string;
	BtnName?: string;
	isBtn?: boolean;
	BtnClick?: () => void;
	tableWidth?: string;
	onSearchChange?: (key: string, value: string) => void;
}

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

const Table = <T extends Record<string, any>>({
	tableName,
	data,
	columns,
	onRowClick,
	onViewClick,
	onEditClick,
	keyField = "id",
	selectKey,
	statusField,
	href,
	actions = true,
	eye = true,
	edit = true,
	trash = true,
	isLoading = false,
	setId = () => {},
	setSelectedRowData = () => {},
	maxTextLength = 20,
	deleteFunctions = () => {},
	tableStyle,
	theadStyle,
	trStyle,
	tbodyStyle,
	isSelect,
	currentPage = 1, // Add currentPage prop
	setCurrentPage,
	pageLimit = 10,
	dataLength = 10,
	setStatusFilter,
	IsModalOpen,
	HandleChangeModal,
	Modal,
	isModal,
	ModalName,
	BtnName,
	isBtn,
	BtnClick,
	tableWidth,
}: TableProps<T>) => {
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

	const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);
	const [tableIds, setTableIds] = useState<string[]>([]);
	const [filterObject, setFilterObject] = useState({});
	const [filteredData, setFilteredData] = useState<T[]>([]);
	const router = useRouter();

	const pageRangeDisplayed = 5;
	const rowsPerPage = pageLimit || 2;

	const truncateText = (text: string, maxLength: number) => {
		if (!text) return "-";
		if (text?.length > maxLength) {
			return text?.substring(0, maxLength) + "...";
		}
		return text;
	};

	const totalPages = Math.ceil(dataLength / rowsPerPage);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	// const currentData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	const handleViewClick = (id: string) => {
		if (href) {
			router.push(`${href}/${id}`);
		}
	};

	const getAllIds = () => {
		const IdsArr = filteredData.map((item) => (selectKey ? item[selectKey] : item?._id));

		setTableIds((prevIds) => {
			const allExist = IdsArr.every((id) => prevIds.includes(id));

			if (allExist) {
				return prevIds.filter((id) => !IdsArr.includes(id));
			} else {
				const newIds = [...new Set([...prevIds, ...IdsArr])];
				return newIds;
			}
		});
	};

	const getSingleIds = (id: string) => {
		setTableIds((prevIds) => {
			if (prevIds.includes(id)) {
				return prevIds.filter((itemId) => itemId !== id);
			} else {
				return [...prevIds, id];
			}
		});
	};

	const generatePageNumbers = () => {
		let startPage = Math.max(currentPage - Math.floor(pageRangeDisplayed / 2), 1);
		let endPage = startPage + pageRangeDisplayed - 1;

		if (endPage > totalPages) {
			endPage = totalPages;
			startPage = Math.max(endPage - pageRangeDisplayed + 1, 1);
		}

		const pages = [];
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	const getFilterObjects = columns.filter((item) => "select" in item || "search" in item);

	const HandleFilterChange = (key: string, value: string | number) => {
		setFilterObject((prev) => ({...prev, [key]: value}));
		setStatusFilter?.(key, value);
		setCurrentPage(1);
	};

	useEffect(() => {
		if (setStatusFilter !== undefined) {
			return setFilteredData(data);
		}

		const result = data?.filter((item) =>
			Object.entries(filterObject).every(([key, value]) => {
				const itemValue = item[key];

				if (typeof itemValue === "string") {
					return itemValue.toLowerCase().includes(String(value).toLowerCase());
				}

				if (typeof itemValue === "number") {
					return itemValue.toString().includes(String(value));
				}

				return false;
			})
		);
		setFilteredData(result);
	}, [data, filterObject]);

	return (
		<div
			className={`overflow-x-auto ${tableName ? "py-6" : "py-2"} rounded-sm flex flex-col border-2 dark:border-textColorDark border-transparent bg-[#F3F5FA] dark:bg-cardBG`}
			style={{maxWidth: "100%"}}
		>
			<div className="flex px-6 justify-between ">
				{tableName && <h2 className="text-lg font-medium">{tableName}</h2>}
				<div className="flex gap-2 items-center">
					<div className="h-full flex gap-2">
						{getFilterObjects?.map(
							(item) =>
								"search" in item && (
									<Field
										key={item?.key}
										onChange={(e: any) => HandleFilterChange(item?.key, e.target.value)}
										placeHolder={`Search ${item?.header}`}
										isIcon
										icon={<Search className="dark:text-secondaryTextColor text-secondaryTextColor mr-2 w-5 h-5" />}
										className="outline-none md:flex hidden h-full"
										inputCustomClass="outline-none"
									/>
								)
						)}
					</div>

					<div className="md:flex hidden gap-2">
						{getFilterObjects?.map(
							(item) =>
								"select" in item && (
									<DropdownMenu
										onOpenChange={(e) => setIsOpenDropDown(e)}
										key={item?.key}
									>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												size="lg"
												className="ml-auto  border border-textColorLight dark:border-textColorDark"
											>
												{(filterObject as string)[item.key] === "" || (filterObject as string)[item.key] === undefined ? item.displayName : (filterObject as string)[item.key]}
												{isOpenDropdown ? <ChevronDown /> : <ChevronUp />}
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												key={item.key}
												onClick={() => HandleFilterChange(item?.key, "")}
											>
												{item?.displayName}
											</DropdownMenuItem>
											{item?.select?.map((subItem: string | number) => (
												<DropdownMenuItem
													key={subItem}
													onClick={() => HandleFilterChange(item?.key, subItem)}
												>
													{subItem}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								)
						)}
					</div>
					<div className=" flex gap-2 items-center">
						{isModal && (
							<OpenModal
								isModal
								ModalName={ModalName}
								isOpen={IsModalOpen}
								changeOpen={HandleChangeModal}
								Modal={Modal}
							/>
						)}
						{isBtn && (
							<UIButton
								name={BtnName || "Add Name"}
								onClick={BtnClick}
							/>
						)}
					</div>
				</div>
			</div>

			<div className="max-h-[calc(100vh)] overflow-hidden  ">
				<div className={"w-[100%] overflow-y-auto overflow-x-auto "}>
					<table
						cellPadding="10"
						className={tableWidth ? tableWidth : "md:w-[100%] sm:w-[50rem] w-[38rem]"}
						style={{...tableStyle, borderCollapse: "separate", borderSpacing: "0 0rem"}}
					>
						<thead
							className="bg-[#F3F5FA] dark:bg-cardBG sticky top-0"
							style={{...theadStyle, zIndex: 10}}
						>
							<tr
								style={{...trStyle}}
								className="text-center text-gray-500 text-xs border-b border-gray-200"
							>
								{!isLoading && isSelect && (
									<th className={`pb-3 font-medium pt-4 `}>
										<input
											type="checkbox"
											className="accent-primary"
											checked={filteredData?.length === tableIds?.length && filteredData?.length !== 0}
											onChange={() => getAllIds()}
										/>
									</th>
								)}
								{columns.map((column) => (
									<th
										key={column.key}
										className={`py-6 font-medium dark:text-textColorDark text-textColorLight ${column.className || ""}`}
									>
										{column.header}
									</th>
								))}
								{actions && <th className={`py-6 font-medium dark:text-textColorDark text-textColorLight`}>Action</th>}
							</tr>
						</thead>
						<tbody
							className="bg-[#F3F5FA] dark:bg-cardBG"
							style={{...tbodyStyle}}
						>
							{isLoading ? (
								Array.from({length: 5}).map((_, index) => (
									<tr
										key={index}
										className="hover:bg-gray-100 dark:hover:bg-layoutDarkBG cursor-pointer shadow"
										style={{marginBottom: "0.5rem"}}
									>
										{columns.map((_, i) => (
											<td
												key={i}
												className="py-4 text-sm font-normal text-center"
												style={{padding: "0.75rem"}}
											>
												<div style={skeletonStyle}></div>
											</td>
										))}
										{actions && (
											<td
												className="py-4 text-sm font-normal text-center"
												style={{padding: "0.75rem"}}
											>
												<div className="flex justify-center gap-4">
													<div style={smallSkeletonStyle}></div>
													<div style={smallSkeletonStyle}></div>
													<div style={smallSkeletonStyle}></div>
												</div>
											</td>
										)}
									</tr>
								))
							) : filteredData?.length > 0 ? (
								filteredData.map((item, index) => (
									<tr
										key={keyField ? item[keyField] : index}
										className="hover:bg-gray-100 dark:hover:bg-layoutDarkBG border h-auto "
										style={{...trStyle}}
										onClick={() => {
											if (onRowClick) {
												onRowClick(item);
												setId(item[keyField]);
											} else {
												setId(item[keyField]);
											}
										}}
									>
										{isSelect && (
											<td
												key={keyField ? item[keyField] : index}
												className="py-4 text-sm font-normal text-center border-t w-[15rem] border-headingLight  pl-[1.8rem] pr-[2rem]"
											>
												<input
													type="checkbox"
													className="accent-primary"
													checked={tableIds?.includes(selectKey ? item[selectKey] : item?._id)}
													onChange={() => getSingleIds(selectKey ? item[selectKey] : item?._id)}
												/>
											</td>
										)}

										{columns.map((column, i) => {
											if (column.key === statusField && statusField) {
												const status = item[statusField];
												return (
													<td
														key={column.key}
														className="py-5 text-sm font-normal text-center border-t w-[15rem]  border-headingLight"
													>
														<span className={`inline-block  rounded-sm `}>{truncateText(status, maxTextLength)}</span>
													</td>
												);
											}

											if (column.render) {
												return (
													<td
														key={column.key}
														className={`py-5 text-sm font-normal text-center w-[15rem]  border-t border-headingLight ${column.className || ""}`}
													>
														{column.render(item[column.key], item)}
													</td>
												);
											}

											return (
												<td
													key={column.key}
													className={`py-5 text-sm font-normal text-center  border-t  border-headingLight w-[15rem] ${column.className || ""} ${isSelect === true ? i === 0 && "w-[1rem]" : i === 0 && "w-[15rem]"}`}
												>
													{truncateText(item[column.key], maxTextLength)}
												</td>
											);
										})}
										{actions && (
											<td className="py-4 text-sm font-normal text-right border-t  border-headingLight w-[15rem]">
												<div className="flex gap-4 items-center justify-center">
													{eye && (
														<div
															onClick={(e) => {
																e.stopPropagation();
																if (onViewClick) {
																	onViewClick(item);
																} else {
																	handleViewClick(item[keyField]);
																}
																setSelectedRowData(item);
															}}
															style={{cursor: "pointer"}}
														>
															<Eye className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
														</div>
													)}
													{edit && (
														<div
															onClick={(e) => {
																e.stopPropagation();
																if (onEditClick) {
																	onEditClick(item);
																}
																setSelectedRowData(item);
															}}
															style={{cursor: "pointer"}}
														>
															<Edit className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
														</div>
													)}
													{trash && (
														<div
															onClick={(e) => {
																e.stopPropagation();
																setId(item[keyField]);
																deleteFunctions();
															}}
															style={{cursor: "pointer"}}
														>
															<Trash className="w-5 h-5 text-headingLight hover:text-black dark:text-textColorDark" />
														</div>
													)}
												</div>
											</td>
										)}
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={columns.length + 2}
										className="py-4 px-2 text-sm font-normal text-center text-gray-500 md:px-4"
										style={{padding: "1.5rem 0.75rem"}}
									>
										No Data Found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex items-end justify-between flex-row-reverse px-8 w-full">
					<div className={`mt-4 flex gap-2 items-end justify-end-safe`}>
						<div className={`flex gap-0 px-4  border border-headingLight/70 rounded-sm text-sm `}>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="py-2 pr-4  cursor-pointer"
							>
								Previous
							</button>

							{generatePageNumbers().map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`w-8 border cursor-pointer ${currentPage === page ? "bg-[#1a40ff] border-[#1a40ff] text-textColorDark " : "border-headingLight/70"}`}
								>
									{page}
								</button>
							))}

							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="py-2 pl-4 cursor-pointer"
							>
								Next
							</button>
						</div>
					</div>
					<div>
						<span>Total Page : {totalPages}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(Table), {ssr: false});
