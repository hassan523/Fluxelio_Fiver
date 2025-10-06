"use client";
import React, {JSX, useEffect, useState} from "react";
import {DialogClose, DialogContent, DialogFooter, DialogTitle} from "../../ui/dialog";
import dynamic from "next/dynamic";
import Field from "../../InputField/Field";
import CustomButton from "../../Button/Button";
import {getCookie} from "cookies-next";
import {useParams} from "next/navigation";
import {useCreateUser} from "@/models/Users/UsersModel";

interface Country {
	name: string;
	code: string;
	dial_code: string;
	flag: string;
}

interface UserData {
	username: string;
	country: string;
	countryCode: string;
	phone: string;
	email: string;
	password: string;
}

const AddUser = (): JSX.Element => {
	const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
	const Token = cookiesData?.data?.accessToken;
	const _id = cookiesData?.data?.user?._id;
	const role = cookiesData?.data?.user?.role?.[0];

	const [userData, setUserData] = useState<UserData>({
		username: "",
		country: "",
		countryCode: "",
		phone: "",
		email: "",
		password: "",
	});
	const {username, country, countryCode, phone, email, password} = userData;

	const [countries, setCountries] = useState<Country[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const params = useParams();
	const {AgencyID, OfficeID} = params;

	const {handleCreateUser, isLoading, isSuccess} = useCreateUser();

	const handleAddUser = () => {
		handleCreateUser({agencyID: role === "Admin" ? AgencyID : role == "Operator" ? cookiesData?.data?.user?.agencyID : _id, officeID: role == "Operator" ? cookiesData?.data?.user?.officeID : OfficeID, Token, username, country, countryCode, phone, email, password, createdBy: _id});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "country") {
			setIsOpen(true);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			setUserData({
				username: "",
				country: "",
				countryCode: "",
				phone: "",
				email: "",
				password: "",
			});
		}
	}, [isSuccess]);

	useEffect(() => {
		let debounceTimer: NodeJS.Timeout;

		if (country) {
			debounceTimer = setTimeout(() => {
				const fetchCountries = async () => {
					try {
						const response = await fetch(`https://restcountries.com/v3.1/name/${country}`, {
							method: "GET",
						});
						const data = await response.json();
						if (!Array.isArray(data)) {
							return;
						}
						const formattedCountries = data
							.map((country: any) => ({
								name: country.name.common,
								code: country.cca2,
								dial_code: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}` : "",
								flag: country.flags?.png || country.flags?.svg,
							}))
							.filter((c: any) => c.dial_code);

						setCountries(formattedCountries);
					} catch (error) {
						console.error("Error fetching countries:", error);
					}
				};

				fetchCountries();
			}, 300);
		}

		return () => clearTimeout(debounceTimer);
	}, [country]);

	return (
		<DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto rounded-sm">
			<DialogTitle className="text-heading text-md sm:text-lg plusJakartaSans capitalize">Add Customer</DialogTitle>
			<div className="flex flex-col gap-4">
				<Field
					placeHolder="Enter User Name"
					type="text"
					className="gap-2"
					divStyle={{padding: "0.75rem 0.8rem"}}
					onChange={handleInputChange}
					name="username"
					value={userData.username}
					disabled={isLoading}
				/>
				<Field
					placeHolder="Enter User Email"
					type="email"
					className="gap-2"
					divStyle={{padding: "0.75rem 0.8rem"}}
					onChange={handleInputChange}
					name="email"
					value={userData.email}
					disabled={isLoading}
				/>
				<div className="relative">
					<Field
						placeHolder="Enter User Country"
						type="text"
						className="gap-2"
						divStyle={{padding: "0.75rem 0.8rem"}}
						onChange={handleInputChange}
						name="country"
						value={userData.country}
						disabled={isLoading}
					/>

					{countries.length > 0 && country && isOpen && (
						<div className="absolute z-50 w-full bg-layoutLightBG dark:bg-layoutDarkBG rounded-md mt-1 max-h-50 overflow-y-auto border border-gray-300">
							{countries.map((item) => (
								<div
									key={item.code}
									onClick={() => {
										setUserData((prev) => ({
											...prev,
											country: item.name,
											countryCode: item.code,
											phone: item.dial_code ? (prev.phone.includes("+") ? item.dial_code : `${item.dial_code} ${prev.phone}`) : prev.phone,
										}));
										setIsOpen(false);
									}}
									className="px-4 py-2 cursor-pointer hover:bg-BtnColorDark dark:hover:bg-BtnColorLight flex items-center gap-2"
								>
									{item.flag && (
										<img
											src={item.flag}
											alt="flag"
											className="w-5 h-4"
										/>
									)}
									<span>{item.name}</span>
								</div>
							))}
						</div>
					)}
				</div>
				<Field
					placeHolder="Enter User Phone"
					type="tel"
					className="gap-2"
					divStyle={{padding: "0.75rem 0.8rem"}}
					onChange={handleInputChange}
					name="phone"
					value={userData.phone}
					disabled={isLoading}
				/>
				<Field
					placeHolder="Enter User Password"
					type="password"
					className="gap-2"
					divStyle={{padding: "0.75rem 0.8rem"}}
					onChange={handleInputChange}
					name="password"
					value={userData.password}
					disabled={isLoading}
				/>
				<DialogFooter className={"pb-4"}>
					<div className="flex items-center justify-center px-6 w-full gap-4">
						<DialogClose
							className="rounded-sm text-center w-36 cursor-pointer font-normal h-11 text-RoseRed border-RoseRed border-2 px-10 py-3 transition-all duration-300 hover:scale-[103%]"
							style={{lineHeight: "1rem"}}
						>
							Cancel
						</DialogClose>
						<CustomButton
							isLoading={isLoading}
							name={"Add Customer"}
							mainClass="px-4 text-sm w-36 cursor-pointer"
							onClick={handleAddUser}
							disabled={isLoading}
						/>
					</div>
				</DialogFooter>
			</div>
		</DialogContent>
	);
};

export default dynamic(() => Promise.resolve(AddUser), {ssr: false});
