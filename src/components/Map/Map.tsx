"use client";

import React, {useState, useEffect} from "react";
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api";
import {useTheme} from "next-themes";
import {darkModeStyle} from "./DarkStyles";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Search} from "lucide-react";
import Field from "../InputField/Field";
import dynamic from "next/dynamic";

const Map = ({height = "600px", topCountries = []}: {height?: string; topCountries: {count: number; country: string}[]}) => {
	const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY_URL;
	const {isLoaded} = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: apiUrl || "",
		libraries: ["places", "maps", "geocoding"],
	});

	const {theme} = useTheme();
	const [countryCoords, setCountryCoords] = useState<Record<string, {lat: number; lng: number}>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isLoaded || topCountries.length === 0) {
			setLoading(false);
			return;
		}

		const geocoder = new window.google.maps.Geocoder();
		const newCoords: Record<string, {lat: number; lng: number}> = {};

		const geocodePromises = topCountries.map((country) => {
			return new Promise<void>((resolve) => {
				if (countryCoords[country.country]) {
					newCoords[country.country] = countryCoords[country.country];
					resolve();
					return;
				}

				geocoder.geocode({address: country.country}, (results, status) => {
					if (status === "OK" && results?.[0]?.geometry?.location) {
						newCoords[country.country] = {
							lat: results[0].geometry.location.lat(),
							lng: results[0].geometry.location.lng(),
						};
					}
					resolve();
				});
			});
		});

		Promise.all(geocodePromises).then(() => {
			setCountryCoords({...countryCoords, ...newCoords});
			setLoading(false);
		});
	}, [isLoaded, topCountries]);

	const calculateCenter = () => {
		if (topCountries.length > 0 && countryCoords[topCountries[0].country]) {
			return countryCoords[topCountries[0].country];
		}
		return {lat: 48.8566, lng: 2.3522};
	};

	const calculateZoom = () => {
		if (topCountries.length === 1) return 6;
		if (topCountries.length <= 3) return 4;
		return 3;
	};

	if (loading) {
		return <div>Loading map...</div>;
	}

	return (
		<Card className="bg-[#F3F5FA] dark:bg-cardBG overflow-hidden rounded-sm h-full border-2 dark:border-textColorDark border-transparent">
			<CardHeader className="max-sm:px-2">
				<div className="flex items-center justify-between w-full">
					<div className="flex flex-col gap-1">
						<CardTitle>Most Sales Location</CardTitle>
						<CardDescription className="text-headingLight dark:text-textColorDark">{topCountries.length > 0 ? `Top ${topCountries.length} countries by sales` : "Map"}</CardDescription>
					</div>
					<div className="flex items-center gap-4">
						<Field
							placeHolder="Search location"
							value=""
							isIcon
							icon={<Search className="dark:text-secondaryTextColor text-secondaryTextColor mr-2 w-5 h-5" />}
							className="outline-none md:flex hidden"
							inputCustomClass="outline-none"
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent style={{padding: "0"}}>
				<div className="relative w-full h-[15.5rem]">
					{isLoaded && (
						<GoogleMap
							mapContainerStyle={{
								width: "100%",
								height: height || "600px",
								borderRadius: "0px",
							}}
							center={calculateCenter()}
							zoom={calculateZoom()}
							options={{
								disableDefaultUI: true,
								styles: theme === "dark" ? darkModeStyle : undefined,
							}}
						>
							{topCountries.map((country, index) => {
								const coords = countryCoords[country.country];
								if (!coords) return null;

								return (
									<Marker
										key={index}
										position={coords}
										label={{
											text: country.count.toString(),
											color: theme === "dark" ? "white" : "black",
											fontSize: "14px",
											fontWeight: "bold",
										}}
									/>
								);
							})}
						</GoogleMap>
					)}
				</div>
			</CardContent>

			{topCountries.length > 0 && (
				<CardFooter className="max-sm:px-2">
					<div className="w-full flex items-start">
						{topCountries
							.map((country) => {
								const totalCount = topCountries.reduce((sum, c) => sum + c.count, 0);
								const percentage = Math.round((country.count / totalCount) * 100 * 10) / 10;
								return {...country, percentage};
							})
							.sort((a, b) => b.percentage - a.percentage)
							.map((country, index, sortedCountries) => {
								const opacity = country.percentage / 100;

								return (
									<div
										key={country.country}
										className="flex flex-col gap-1 flex-1 max-w-[20%]"
									>
										<span className="dark:text-headingDark text-headingLight truncate">{country.country}</span>
										<span className="bg-headingDark/50 h-[1rem] w-[0.5px] flex ml-1"></span>
										<span
											className={`flex flex-col pl-2 dark:text-white text-textColorLight ${index === 0 ? "rounded-tl-sm rounded-bl-sm" : index === sortedCountries.length - 1 ? "rounded-tr-sm rounded-br-sm" : ""}`}
											style={{
												backgroundColor: `rgba(26, 64, 255, ${opacity})`,
											}}
										>
											<span className="font-medium">{country.count}</span>
											<span className="text-xs opacity-80">{country.percentage}%</span>
										</span>
									</div>
								);
							})}
					</div>
				</CardFooter>
			)}
		</Card>
	);
};

export default dynamic(() => Promise.resolve(Map), {ssr: false});
