"use client";

import Field from "@/components/InputField/Field";
import Layout from "@/Layout/Dashboard/Layout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChangeEvent, InputEvent, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { CreateParcelType } from "@/Redux/Parcels/ParcelType";
import { Delete, Plus, Trash } from "lucide-react";
import Image from "next/image";
import router from "next/router";
import CustomButton from "@/components/Button/Button";
import { useGetSingleParcel } from "@/models/Parcels/ParcelsModel";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const UpdateParcel = () => {
  const [data, setData] = useState<CreateParcelType>({
    weight: 0,
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
    notificationCost: 0,
    pricePerKilo: "",
    actualCarrierCost: "",
    paymentStatus: "",
    status: "",
    partialAmount: "",
    packagePictures: [],
  });
  const { weight, officeID, officeName, customerID, customerName, transportMethod, destinationID, destinationName, tagID, tagName, estimateArrival, description, mixedPackage, whatsappNotif, notificationCost, pricePerKilo, actualCarrierCost, paymentStatus, status, partialAmount, packagePictures } = data;

  const router = useRouter();
  const { parcelID } = useParams();
  const ParcelIdStr = Array.isArray(parcelID) ? parcelID[0] : parcelID || "";

  const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
  const Token = cookiesData?.data?.accessToken;

  const handleData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };

  const handleDropdown = ({ name, value }: { name: string; value: string }) => {
    setData({ ...data, [name]: value });
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

  const getSingleParcelAPI = useGetSingleParcel({ parcelID: ParcelIdStr, Token });

  // useEffect(() => {
  //     const data = parcelData?.parcel;

  //     if (!data) return

  //     setData({
  //         weight: data?.weight,
  //         officeID: "",
  //         officeName: "",
  //         customerID: "",
  //         customerName: "",
  //         transportMethod: data?.transportMethod,
  //         destinationID: data?.destination?._id,
  //         destinationName: data?.destination?.officeName,
  //         tagID: data?.tagID,
  //         tagName: data?.tag || "",
  //         estimateArrival: data?.estimateArrival,
  //         description: data?.description,
  //         mixedPackage: data?.mixedPackage,
  //         whatsappNotif: data?.whatsappNotif,
  //         pricePerKilo: data?.transaction,
  //         actualCarrierCost: "",
  //         paymentStatus: "",
  //         status: "",
  //         createdBy: "",
  //         partialAmount: "",
  //         packagePictures: [],
  //     });
  // }, []);

  return (
    <Layout>
      <div className="w-full mx-auto pt-6 flex flex-col gap-4">
        <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
          <div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
            <div>
              <h2 className="text-xl font-semibold">Update Parcel</h2>
              <p className="text-gray-500 text-sm">Update your parcels in the system</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 px-4 py-3 dark:bg-cardBG rounded-sm bg-layoutLightBG  dark:border-textColorDark border-2 border-transparent w-full">
          <div className="flex flex-col gap-1">
            <label>Add Pictures</label>
            <div className="flex gap-4 flex-wrap">
              {packagePictures.length != 0 &&
                packagePictures.map((item, index) => (
                  <div key={`parcelImage${index}`} className="w-20 h-20 relative">
                    <Image src={URL.createObjectURL(item)} alt="img" className="w-20 h-20 rounded-lg" width={64} height={64} />
                    <div className="bg-white p-1 rounded-sm absolute top-1 right-1 flex items-center justify-center cursor-pointer text-RoseRed" onClick={() => handleDeleteImg(index)}>
                      <Trash size={15} />
                    </div>
                  </div>
                ))}
              <div className="w-20 h-20 flex items-center justify-center bg-transparent border dark:border-textColorDark border-textColorLight rounded-lg cursor-pointer dark:text-textColorDark text-textColorLight relative">
                <Plus size={25} />
                <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" onChange={handleUploadImg} accept="image/*" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-sm:grid-cols-1">
            <div className="flex flex-col gap-1 h-12">
              <label>Select Office</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {officeName ? officeName : "Select Office"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "officeName", value: "Office 1" })}>Office 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "officeName", value: "Office 2" })}>Office 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 h-12 max-sm:mt-4">
              <label>Select Customer</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {customerName ? customerName : "Select Customer"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "customerName", value: "Customer 1" })}>Customer 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "customerName", value: "Customer 2" })}>Customer 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 h-12 max-sm:mt-4">
              <label>Select Tag</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {tagName ? tagName : "Select Tag"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "tagName", value: "Tag 1" })}>Tag 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "tagName", value: "Tag 2" })}>Tag 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 h-12 max-lg:mt-4">
              <label>Transport Method</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {transportMethod ? transportMethod : "Select Method"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "transportMethod", value: "Air" })}>Air</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "transportMethod", value: "Sea" })}>Sea</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 h-12 mt-4">
              <label>Destination Office</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {destinationName ? destinationName : "Select Office"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "destinationName", value: "Office 1" })}>Office 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "destinationName", value: "Office 2" })}>Office 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <label>Estimate Arrival</label>
              <Field placeHolder="Estimate Arrival" type="text" value={estimateArrival} name="estimateArrival" onChange={handleData} />
            </div>
            <div className="flex flex-col gap-1 mt-4 max-lg:mt-0">
              <label>Weight</label>
              <Field placeHolder="Weight in kg" type="number" value={String(weight ?? 0)} name="weight" onChange={handleData} />
            </div>
            <div className="flex flex-col gap-1 mt-4 max-lg:mt-0">
              <label>Price Per kg</label>
              <Field placeHolder="Price Per kg" type="number" value={pricePerKilo} name="pricePerKilo" onChange={handleData} />
            </div>
            <div className="flex flex-col gap-1">
              <label>Actual Carrier Cost</label>
              <Field placeHolder="Actual Carrier Cost" type="number" value={actualCarrierCost} name="actualCarrierCost" onChange={handleData} />
            </div>
            <div className="flex flex-col gap-1">
              <label>Partial Amount</label>
              <Field placeHolder="Partial Amount" type="number" value={partialAmount} name="partialAmount" onChange={handleData} />
            </div>
            <div className="flex flex-col gap-1 h-12">
              <label>Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {status ? status : "Select Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "status", value: "Status 1" })}>Status 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "status", value: "Status 2" })}>Status 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1 h-12 max-sm:mt-4">
              <label>Payment Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" border dark:border-textColorDark border-textColorLight w-full h-full bg-transparent" size="lg">
                    {paymentStatus ? paymentStatus : "Select Payment Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "paymentStatus", value: "Payment Status 1" })}>Payment Status 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDropdown({ name: "paymentStatus", value: "Payment Status 2" })}>Payment Status 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 max-sm:mt-4">
              <label>Mixed Parcel?</label>
              <div className="flex mt-1">
                <Switch id="airplane-mode" className="border border-textColorLight darK:border-textColorDark" />
              </div>
            </div>
            <div className="flex gap-2 ">
              <label>Whatsapp Notfication?</label>
              <div className="flex mt-1">
                <Switch id="airplane-mode" className="border border-textColorLight darK:border-textColorDark" />
              </div>
            </div>
            <div className="flex flex-col gap-1 col-span-2 max-sm:col-span-1">
              <label>Parcel Description</label>
              <Field placeHolder="Parcel Description" type="textarea" row={6} value={description} name="description" onChange={handleData} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 sm:flex-row flex-col">
            <CustomButton name="Create Parcel" pClass="font-semibold" className="border border-BtnColorLight" />
            <CustomButton isDark={false} name="Back" pClass="font-semibold" className="border dark:border-white border-gray-400 w-[8rem]" onClick={() => router.push("/parcels")} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateParcel;
