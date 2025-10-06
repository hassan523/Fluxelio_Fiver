"use client";

import StatCard from "@/components/Dashboard/StatCard";
import StatusBox from "@/components/StatusBox/StatusBox";
import Layout from "@/Layout/Dashboard/Layout";
import { useGetSingleParcel } from "@/models/Parcels/ParcelsModel";
import formatDateOnly from "@/utils/FormatedTimeStamp/FormatedTimeStamp";
import { getCookie } from "cookies-next";
import { Calendar, Clock3, HandCoins, Info, Package } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import fakeImage from "../../../../../public/assets/images/fakeImage.jpg";
import CustomButton from "@/components/Button/Button";
import { Dialog } from "@/components/ui/dialog";
import UpdateStatus from "@/components/Modals/Parcel/UpdateStatus";

const SingleParcel = () => {
  const { parcelID } = useParams();

  const apiUrl = process.env.NEXT_PUBLIC_PORT;
  const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
  const Token = cookiesData?.data?.accessToken;

  const allStatus = ["RECEIVED IN WAREHOUSE", "WAITING TO BE GROUPED", "READY FOR SHIPMENT", "SHIPPED", "IN TRANSIT", "ARRIVED AT DESTINATION OFFICE", "WAITING FOR WITHDRAWAL", "DELIVERED/PICKED UP", "UNCLAIMED PACKAGE"];
  const allPaymentStatus = ["PENDING PAYMENT", "PARTIALLY PAID", "DEFERRED PAYMENT", "PAYMENT VALIDATED", "PAYMENT FAILED", "PAYMENT CANCELLED"];
  const tabs = ["Parcel Details", "Departure", "Customer Info"];

  const [activeTab, setActiveTab] = useState("Parcel Details");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [UpdateStatusData, setUpdateStatusData] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: null,
  });

  const getSinleParcel = typeof parcelID === "string" ? useGetSingleParcel({ parcelID, Token }) : null;
  const singleParcel = getSinleParcel?.data?.parcel ?? null;
  const isLoading = getSinleParcel?.isLoading ?? false;

  useEffect(() => {
    if (singleParcel && singleParcel.packagePicture.length > 0) {
      setActiveImage(singleParcel.packagePicture[0]);
    }
  }, [singleParcel]);

  return (
    <Layout>
      <div className="w-full mx-auto flex flex-col gap-6 overflow-hidden">
        <div className="bg-layoutLightBG dark:bg-layoutDarkBG rounded-lg shadow-sm">
          <div className="flex [420px]:items-center justify-between w-full max-[420px]:flex-col max-[420px]:gap-2">
            {isLoading ? (
              <h2 className="text-xl font-semibold">Loading...</h2>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="text-xl font-semibold">Tracking ID: {singleParcel?.trackingID}</h2>
                  <p className="text-gray-500 text-sm">Created on {formatDateOnly(singleParcel?.createdAt ?? "N/A")}</p>
                </div>
                <CustomButton
                  name="Update Status"
                  pClass="font-semibold"
                  className="border border-BtnColorLight"
                  onClick={() =>
                    setUpdateStatusData({
                      isOpen: true,
                      data: singleParcel || null,
                    })
                  }
                  isLoading={isLoading}
                  disabled={singleParcel?.mixedPackage}
                />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
          <StatCard title="Current Status" value={singleParcel?.status ?? "N/A"} icon={<Package className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
          <StatCard title="Parcel Time" value={formatDateOnly(singleParcel?.createdAt ?? "N/A")} icon={<Calendar className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
          <StatCard title="Package Value" value={singleParcel?.transaction?.totalPrice ? `${singleParcel?.transaction?.totalPrice}` : "N/A"} icon={<HandCoins className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
        </div>
        <div className="bg-[#F3F5FA] dark:bg-cardBG rounded-sm border-2 dark:border-textColorDark w-full border-transparent flex flex-col gap-4" style={{ padding: "0.75rem" }}>
          <div className="w-full flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Parcel Status</h2>
              <StatusBox value={singleParcel?.status == "DELIVERED/PICKED UP" ? "Paid" : "In-Progress"} color={singleParcel?.status == "DELIVERED/PICKED UP" ? "green" : "yellow"} isLoading={isLoading} />
            </div>
            <div className="flex items-center gap-2">
              <Clock3 />
              <p>
                Estimated Shipping: <strong>{isLoading ? "Loading..." : singleParcel?.estimateArrival}</strong>
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {allStatus.map((item, index) => {
              const currentIndex = allStatus.findIndex((status) => status === singleParcel?.status);
              const isBeforeCurrent = index < currentIndex;
              const isCurrent = index === currentIndex;

              const trackingRecord = singleParcel?.parcel_trackings?.find((parcelTrack) => parcelTrack?.status === item);

              const lineColor = isCurrent ? "bg-statusGreen" : isBeforeCurrent ? "bg-statusYellow" : "bg-white";

              const textColor = isCurrent ? "text-statusGreen" : isBeforeCurrent ? "text-statusYellow" : "";

              return (
                <div key={`status${index}`} className="flex flex-col gap-1 w-[12rem] max-lg:w-[22.5%] max-md:w-[30%] max-sm:w-full">
                  <div className={`w-full h-1.5 rounded-full ${lineColor}`}></div>
                  <div className="flex justify-between">
                    <p className={textColor}>{item}</p>
                    {trackingRecord && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="cursor-pointer w-[20%]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-3">
                              <div>
                                <p>Updated Date:</p>
                                <p className="text-statusGreen">
                                  <strong>{formatDateOnly(trackingRecord?.createdAt) || "N/A"}</strong>
                                </p>
                              </div>
                              <div>
                                <p>Updated By:</p>
                                <p className="text-statusGreen">
                                  <strong>
                                    {trackingRecord?.trackingUpdatedBy?.username} ({trackingRecord?.trackingUpdatedBy?.type})
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#F3F5FA] dark:bg-cardBG rounded-sm border-2 dark:border-textColorDark w-full border-transparent flex flex-col gap-4" style={{ padding: "0.75rem" }}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Payment Status</h2>
            <StatusBox value={singleParcel?.transaction?.paymentStatus == "PAYMENT VALIDATED" ? "Paid" : "Pending"} color={singleParcel?.transaction?.paymentStatus == "PAYMENT VALIDATED" ? "green" : "yellow"} />
          </div>
          <div className="flex gap-4 flex-wrap">
            {allPaymentStatus.map((item, index) => {
              const isCurrent = singleParcel?.transaction?.paymentStatus === item;
              const isCompleted = allPaymentStatus.indexOf(singleParcel?.transaction?.paymentStatus || "") > index;

              const trackingRecord = singleParcel?.transaction_tracking?.find((transactionTrack) => transactionTrack?.status === item);

              return (
                <div key={`paymentStatus${index}`} className="flex flex-col gap-1 w-[12rem] max-lg:w-[22.5%] max-md:w-[30%] max-sm:w-full">
                  <div className={`w-full h-1.5 rounded-full ${isCurrent ? "bg-statusGreen" : isCompleted ? "bg-statusYellow" : "bg-white"}`}></div>
                  <div className="flex justify-between">
                    <p className={isCurrent ? "text-statusGreen" : isCompleted ? "text-statusYellow" : ""}>{item}</p>
                    {trackingRecord && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="cursor-pointer w-[20%]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-3">
                              <div>
                                <p>Updated Date:</p>
                                <p className="text-statusGreen">
                                  <strong>{formatDateOnly(trackingRecord?.createdAt) || "N/A"}</strong>
                                </p>
                              </div>
                              <div>
                                <p>Updated By:</p>
                                <p className="text-statusGreen">
                                  <strong>
                                    {trackingRecord?.updatedByInfo?.username} ({trackingRecord?.updatedByInfo?.type})
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#F3F5FA] dark:bg-cardBG rounded-sm border-2 dark:border-textColorDark w-full border-transparent flex flex-col gap-4" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
          <div className="flex items-center gap-4 border-b dark:border-b-textColorDark border-b-transparent w-full" style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
            {tabs.map((tab, index) => (
              <p key={`tabs${index}`} className={`cursor-pointer border-b-2 ${activeTab === tab ? "text-[#155dfc] border-b-[#155dfc]" : "border-b-transparent"}`} style={{ paddingBottom: "0.75rem" }} onClick={() => setActiveTab(tab)}>
                {tab}
              </p>
            ))}
          </div>
          {activeTab == "Parcel Details" ? (
            <div className="grid grid-cols-4 gap-4 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-2" style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
              <div className="flex flex-col gap-1 w-full">
                <p>PARCEL IMAGES:</p>
                {singleParcel?.packagePicture?.length == 0 ? (
                  <div className="flex flex-col gap-1 w-full">
                    <Image src={fakeImage} alt="img" width={350} height={150} className="w-full h-[150px] object-cover rounded-md" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Image key={index} src={fakeImage} alt="img" width={150} height={50} className="w-[32.5%] h-[70px] object-cover rounded-md" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 w-full">
                    <Image src={`${apiUrl}${activeImage}`} alt="img" width={350} height={150} className="w-full h-[150px] object-cover rounded-md" />
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {singleParcel?.packagePicture?.map((item, index) => (
                        <Image key={index} src={`${apiUrl}${item}`} alt="img" width={150} height={50} className="w-[32.5%] h-[70px] object-cover rounded-md cursor-pointer" onClick={() => setActiveImage(item)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                  <p>Parcel ID:</p>
                  <p>{singleParcel?._id}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Tracking ID:</p>
                  <p>{singleParcel?.trackingID}</p>
                </div>
                {singleParcel?.mixedPackage && (
                  <div className="w-full flex items-center justify-between">
                    <p>Tag ID:</p>
                    <p>{singleParcel?.tagID}</p>
                  </div>
                )}
                <div className="w-full flex items-center justify-between">
                  <p>Transport Method:</p>
                  <p>{singleParcel?.transportMethod}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Parcel Type:</p>
                  <p>{singleParcel?.mixedPackage ? "Mixed" : "Single"}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Status:</p>
                  <p>{singleParcel?.status}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Estimated Arrival:</p>
                  <p>{singleParcel?.estimateArrival}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                  <p>Weight:</p>
                  <p>{singleParcel?.weight}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Price Per Kilo:</p>
                  <p>{singleParcel?.transaction?.pricePerKilo}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Actual Carrier Cost:</p>
                  <p>{singleParcel?.transaction?.actualCarrierCost}</p>
                </div>
                {singleParcel?.whatsappNotif && (
                  <div className="w-full flex items-center justify-between">
                    <p>Notification Cost:</p>
                    <p>{singleParcel?.notificationCost}</p>
                  </div>
                )}
                <div className="w-full flex items-center justify-between">
                  <p>Gross Profit:</p>
                  <p>{singleParcel?.transaction?.grossProfit}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Total Price:</p>
                  <p>{singleParcel?.transaction?.totalPrice}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p>Payment Status:</p>
                  <p>{singleParcel?.transaction?.paymentStatus}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 max-2xl:col-span-2 max-xl:col-span-1">
                <p>Description:</p>
                <p>{singleParcel?.description}</p>
              </div>
            </div>
          ) : activeTab == "Departure" ? (
            <div className="flex flex-col gap-2 w-[20rem] max-md:w-full" style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
              <div className="flex items-center justify-between">
                <p>Office Name:</p>
                <p>{singleParcel?.departure?.officeName}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Phone Number:</p>
                <p>{singleParcel?.departure?.phone}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Postal Code:</p>
                <p>{singleParcel?.departure?.address?.street}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Phone Number:</p>
                <p>{singleParcel?.departure?.address?.postalCode}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>City:</p>
                <p>{singleParcel?.departure?.address?.city}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Country:</p>
                <p>{singleParcel?.departure?.address?.country}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[20rem] max-md:w-full" style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
              <div className="flex items-center justify-between">
                <p>Customer Name:</p>
                <p>{singleParcel?.customer?.username}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Phone Number:</p>
                <p>{singleParcel?.customer?.phone}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Email:</p>
                <p>{singleParcel?.customer?.email}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Country:</p>
                <p>{singleParcel?.customer?.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={UpdateStatusData?.isOpen} onOpenChange={(e) => setUpdateStatusData((prev) => ({ ...prev, isOpen: e, data: null }))}>
        <UpdateStatus agencyID={singleParcel?.agency?._id ?? ""} UpdateStatusData={UpdateStatusData} setterFunction={setUpdateStatusData} />
      </Dialog>
    </Layout>
  );
};

export default SingleParcel;
