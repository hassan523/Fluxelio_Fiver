"use client";

import Field from "@/components/InputField/Field";
import Layout from "@/Layout/Dashboard/Layout";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../../../../components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChangeEvent, useEffect, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {CreateParcelType} from "@/redux/Parcels/ParcelType";
import {Delete, Plus, Trash} from "lucide-react";
import Image from "next/image";
import CustomButton from "@/components/Button/Button";
import {getCookie} from "cookies-next";
import {useCreateParcelApi, useGetParcelFilters} from "@/models/Parcels/ParcelsModel";
import {useGetOperatorTags} from "@/models/Tags/TagsModel";
import {useParams, useRouter} from "next/navigation";

interface OfficeType {
	_id: string;
	officeName: string;
	customers?: CustomerType[];
}

interface CustomerType {
	_id: string;
	username: string;
}

const CreateParcel = () => {
	const [data, setData] = useState<CreateParcelType>({
		weight: "",
		officeID: "",
		officeName: "",
		customerID: "",
		customerName: "",
		transportMethod: "",
		destinationID: "",
		destinationName: "",
		tagID: "",
		tagName: "",
		estimateArrival: "",
		description: "",
		mixedPackage: false,
		whatsappNotif: false,
		notificationCost: "",
		pricePerKilo: "",
		actualCarrierCost: "",
		paymentStatus: "",
		status: "",
		partialAmount: "",
		packagePictures: [],
	});

	const allStatus = ["RECEIVED IN WAREHOUSE", "WAITING TO BE GROUPED", "READY FOR SHIPMENT", "SHIPPED", "IN TRANSIT", "ARRIVED AT DESTINATION OFFICE", "WAITING FOR WITHDRAWAL", "DELIVERED/PICKED UP", "UNCLAIMED PACKAGE"];
	const allPaymentStatus = ["PENDING PAYMENT", "PARTIALLY PAID", "DEFERRED PAYMENT", "PAYMENT VALIDATED", "PAYMENT FAILED", "PAYMENT CANCELLED"];

	const cookiesData = getCookie("fluxelio") ? JSON.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const role = cookiesData?.data?.user?.role?.[0];
	const params = useParams();

	const agencyID = 
		role === "Admin" ? params.AgencyID 
		: role === "Agency" ? cookiesData?.data?.user?._id 
  			: cookiesData?.data?.user?.agencyID;

const officeIDLocal = cookiesData?.data?.user?.officeID;

	const router = useRouter();

	const filterParcelData = useGetParcelFilters({search: {_id: agencyID, officeID: role == "Agency" ? null : officeIDLocal}, Token});

	const allOffices: OfficeType[] = filterParcelData?.data?.agencies?.find((item: any) => item._id === agencyID)?.offices || [];

	const selectedOfficeCustomers: CustomerType[] = data.officeID ? allOffices.find((office: OfficeType) => office._id === data.officeID)?.customers || [] : [];

	const selectedOfficesTags = useGetOperatorTags({agencyID: agencyID, officeID: data.officeID, Token: Token, role: role});

	const {handleCreateParcel, isLoading, isError, error, isSuccess} = useCreateParcelApi();

	const handleData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setData({...data, [name]: value});
	};

	const handleDropdown = ({name, value, id}: {name: string; value: string; id?: string}) => {
		if (name === "officeName") {
			setData({
				...data,
				[name]: value,
				officeID: id || "",
				customerName: "",
				customerID: "",
				tagID: "",
				tagName: "",
				destinationName: "",
				destinationID: "",
			});
		} else if (name === "customerName") {
			setData({
				...data,
				[name]: value,
				customerID: id || "",
			});
		} else if (name === "tagName") {
			setData({
				...data,
				[name]: value,
				tagID: id || "",
			});
		} else if (name === "destinationName") {
			setData({
				...data,
				[name]: value,
				destinationID: id || "",
			});
		} else if(name === "paymentStatus" && value == "PENDING PAYMENT"){
			setData({...data, [name]: value, partialAmount: ""});
		} else {
			setData({...data, [name]: value});
		}
	};

	const handleUploadImg = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setData((prev) => ({
					...prev,
					packagePictures: [...prev.packagePictures, file],
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteImg = (indexToDelete: number) => {
		setData((prev) => ({
			...prev,
			packagePictures: prev.packagePictures.filter((_, index) => index !== indexToDelete),
		}));
	};

	const handleSubmit = async () => {
		await handleCreateParcel({createdBy: cookiesData?.data?.user?._id, agencyID: agencyID, officeID: data.officeID, data: {...data, tagID: data.mixedPackage ? data.tagID : null, notificationCost: data.whatsappNotif ? data.notificationCost || null : null, partialAmount: data.partialAmount || null}, Token: Token});

		if(!isError){
			setData({
				weight: "",
				officeID: "",
				officeName: "",
				customerID: "",
				customerName: "",
				transportMethod: "",
				destinationID: "",
				destinationName: "",
				tagID: "",
				tagName: "",
				estimateArrival: "",
				description: "",
				mixedPackage: false,
				whatsappNotif: false,
				notificationCost: "",
				pricePerKilo: "",
				actualCarrierCost: "",
				paymentStatus: "",
				status: "",
				partialAmount: "",
				packagePictures: [],
			})
		}
	};

	return (
		<Layout>
			<div className="w-full mx-auto pt-6 flex flex-col gap-4">
				<div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
					<div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
						<div>
							<h2 className="text-xl font-semibold">Create New Parcel</h2>
							<p className="text-gray-500 text-sm">Create your parcels in the system</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-6 px-4 py-3 dark:bg-cardBG rounded-sm bg-layoutLightBG  dark:border-textColorDark border-2 border-transparent w-full">
					<div className="flex flex-col gap-1">
						<label>Add Pictures</label>
						<div className="flex gap-4 flex-wrap">
							{data.packagePictures.length != 0 &&
								data.packagePictures.map((item, index) => (
									<div
										key={`parcelImage${index}`}
										className="w-20 h-20 relative"
									>
										<Image
											src={URL.createObjectURL(item)}
											alt="img"
											className="w-20 h-20 rounded-lg"
											width={64}
											height={64}
										/>
										<div
											className="bg-white p-1 rounded-sm absolute top-1 right-1 flex items-center justify-center cursor-pointer text-RoseRed"
											onClick={() => handleDeleteImg(index)}
										>
											<Trash size={15} />
										</div>
									</div>
								))}
							<div className="w-20 h-20 flex items-center justify-center bg-transparent border dark:border-textColorDark border-textColorLight rounded-lg cursor-pointer dark:text-textColorDark text-textColorLight relative">
								<Plus size={25} />
								<input
									type="file"
									className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
									onChange={handleUploadImg}
									accept="image/*"
								/>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-sm:grid-cols-1">
						<div className="flex flex-col gap-1 h-12">
							<label>Select Office</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
									>
										{data.officeName ? data.officeName : "Select Office"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{role === "Operator"
										? allOffices
												.filter((items) => items._id === officeIDLocal)
												.map((item: OfficeType) => (
													<DropdownMenuItem
														key={item._id}
														onClick={() =>
															handleDropdown({
																name: "officeName",
																value: item.officeName,
																id: item._id,
															})
														}
													>
														{item.officeName}
													</DropdownMenuItem>
												))
										: allOffices.map((item: OfficeType) => (
												<DropdownMenuItem
													key={item._id}
													onClick={() =>
														handleDropdown({
															name: "officeName",
															value: item.officeName,
															id: item._id,
														})
													}
												>
													{item.officeName}
												</DropdownMenuItem>
										  ))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 h-12 max-sm:mt-4">
							<label>Select Customer</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
										disabled={!data.officeID}
									>
										{data.customerName ? data.customerName : "Select Customer"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{selectedOfficeCustomers.map((customer: CustomerType) => (
										<DropdownMenuItem
											key={customer._id}
											onClick={() =>
												handleDropdown({
													name: "customerName",
													value: customer.username,
													id: customer._id,
												})
											}
										>
											{customer.username}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 h-12 max-sm:mt-4">
							<label>Select Tag</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
										disabled={!data.officeID || !data.mixedPackage}
									>
										{data.tagName ? data.tagName : "Select Tag"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{selectedOfficesTags?.data?.tags?.map((item) => (
										<DropdownMenuItem
											key={item?._id}
											onClick={() => handleDropdown({name: "tagName", value: item?.tagName, id: item?._id})}
										>
											{item?.tagName}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 h-12 max-lg:mt-4">
							<label>Transport Method</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
									>
										{data.transportMethod ? data.transportMethod : "Select Method"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem onClick={() => handleDropdown({name: "transportMethod", value: "Air"})}>Air</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleDropdown({name: "transportMethod", value: "Sea"})}>Sea</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 h-12 mt-4">
							<label>Destination Office</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
										disabled={!data.officeID}
									>
										{data.destinationName ? data.destinationName : "Select Office"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{allOffices
										?.filter((items: OfficeType) => data.officeID !== items?._id)
										.map((item: OfficeType) => (
											<DropdownMenuItem
												key={item._id}
												onClick={() =>
													handleDropdown({
														name: "destinationName",
														value: item.officeName,
														id: item._id,
													})
												}
											>
												{item.officeName}
											</DropdownMenuItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 mt-4">
							<label>Estimate Arrival</label>
							<Field
								placeHolder="Estimate Arrival"
								type="text"
								value={data.estimateArrival}
								name="estimateArrival"
								onChange={handleData}
							/>
						</div>
						<div className="flex flex-col gap-1 mt-4 max-lg:mt-0">
							<label>Weight</label>
							<Field
								placeHolder="Weight in kg"
								type="number"
								value={data.weight}
								name="weight"
								onChange={handleData}
							/>
						</div>
						<div className="flex flex-col gap-1 mt-4 max-lg:mt-0">
							<label>Price Per kg</label>
							<Field
								placeHolder="Price Per kg"
								type="number"
								value={data.pricePerKilo}
								name="pricePerKilo"
								onChange={handleData}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label>Actual Carrier Cost</label>
							<Field
								placeHolder="Actual Carrier Cost"
								type="number"
								value={data.actualCarrierCost}
								name="actualCarrierCost"
								onChange={handleData}
							/>
						</div>
						<div className="flex flex-col gap-1 h-12">
							<label>Status</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
									>
										{data.status ? data.status : "Select Status"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{allStatus.map((item, index) => (
										<DropdownMenuItem
											key={`status${index}`}
											onClick={() => handleDropdown({name: "status", value: item})}
										>
											{item}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 h-12 max-sm:mt-4">
							<label>Payment Status</label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent"
										size="lg"
									>
										{data.paymentStatus ? data.paymentStatus : "Select Payment Status"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{allPaymentStatus.map((item, index) => (
										<DropdownMenuItem
											key={`paymentStatus${index}`}
											onClick={() => handleDropdown({name: "paymentStatus", value: item})}
										>
											{item}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex flex-col gap-1 max-sm:mt-4">
							<label>Partial Amount</label>
							<Field
								placeHolder="Partial Amount"
								type="number"
								value={data.partialAmount}
								name="partialAmount"
								onChange={handleData}
								disabled={data.paymentStatus == "PENDING PAYMENT"}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 max-sm:mt-4">
								<label>Mixed Parcel?</label>
								<div className="flex mt-1">
									<Switch
										id="airplane-mode"
										className="border border-textColorLight darK:border-textColorDark"
										value={data.mixedPackage}
										onCheckedChange={(checked) => setData({...data, mixedPackage: checked,tagID: checked? data.tagID:""})}
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 ">
								<label>Whatsapp Notfication?</label>
								<div className="flex mt-1">
									<Switch
										id="airplane-mode"
										className="border border-textColorLight darK:border-textColorDark"
										value={data.whatsappNotif}
										onCheckedChange={(checked) => setData({...data, whatsappNotif: checked, notificationCost: checked ? data.notificationCost : ""})}
									/>
								</div>
							</div>
							{data.whatsappNotif && (
								<Field
									placeHolder="Notification Cost"
									type="number"
									value={data.notificationCost}
									name="notificationCost"
									onChange={handleData}
								/>
							)}
						</div>
						<div className="flex flex-col gap-1 col-span-2 max-sm:col-span-1">
							<label>Parcel Description</label>
							<Field
								placeHolder="Parcel Description"
								type="textarea"
								row={6}
								value={data.description}
								name="description"
								onChange={handleData}
							/>
						</div>
					</div>
					<div className="flex items-center justify-center gap-4 sm:flex-row flex-col">
						<CustomButton
							name="Create Parcel"
							pClass="font-semibold"
							className="border border-BtnColorLight"
							onClick={handleSubmit}
							isLoading={isLoading}
							disabled={isLoading}
						/>
						<CustomButton
							isDark={false}
							name="Back"
							pClass="font-semibold"
							className="border dark:border-white border-gray-400 w-[8rem]"
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default CreateParcel;
