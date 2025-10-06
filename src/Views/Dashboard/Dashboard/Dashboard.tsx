"use client";
import { useRouter } from "next/navigation";
import Layout from "@/Layout/Dashboard/Layout";
import StatCard from "@/components/Dashboard/StatCard";
import Table from "@/components/Tables/Table";
import { Archive, ArchiveRestore, Users } from "lucide-react";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import CircleChart from "@/components/Dashboard/CircleChart";
import Map from "@/components/Map/Map";
import { useState } from "react";
import { useGetTransactionAPI } from "@/models/Transaction/Transaction";
import { getCookie } from "cookies-next";
import { useGetDashboard } from "@/models/Dashboard/DashboardModel";

const Dashboard = () => {
    const currentDate = new Date();

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [parcelCount, setParcelCount] = useState({ month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });

    const [transactionStats, setTransactionStats] = useState({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
    });

    const [revenue, setRevenue] = useState({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
    });

    const router = useRouter();
    const revenueData = {
        currentRevenue: "$240.8K",
        percentageChange: "+8.2%",
        date: "Jan 31, 2023",
    };

    const pageLimit = 10;

    const cookiesData = getCookie("fluxelio") ? JSON?.parse(getCookie("fluxelio") as string) : undefined;
    const Token = cookiesData?.data?.accessToken;
    const _id = cookiesData?.data?.user?._id;

    const columns = [
        { key: "trackingID", header: "Tracking ID", search: true },
        { key: "customer", header: "Customer" },
        { key: "status", header: "Status" },
        { key: "updatedByUsername", header: "Updated By Username" },
        { key: "paymentStatus", header: "Payment Status" },
        { key: "partialAmount", header: "Partial Amount" },
        { key: "updatedByType", header: "Updated By Type" },
        { key: "grossProfit", header: "Gross Profit" },
        { key: "actualCarrierCost", header: "Actual Carrier Cost" },
        { key: "totalPrice", header: "Total Price" },
        { key: "pricePerKilo", header: "Price Per Kilo" },
    ];

    const { data, isLoading: transactionLoading } = useGetTransactionAPI({ Token, id: _id, page: currentPage, limit: pageLimit, search: search });
    const TransactionData = data?.transaction;
    const getDashboardData = useGetDashboard({ id: _id, parcelCountMonth: parcelCount.month, parcelCountYear: parcelCount.year, transactionStatsYear: transactionStats.year, revenueYear: revenue.year, Token });
    const isLoading = getDashboardData?.isLoading;
    const dashboardData = getDashboardData?.data;

    const handleSearchChange = (key: string, value: string | number) => {
        if (typeof value == "string") {
            setSearch(value);
        }
    };

    return (
        <Layout>
            <div className="w-full space-y-6">
                <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-2">
                    <div className="w-full">
                        <StatCard title="All Agencies" value={dashboardData?.agencyCount || "0"} icon={<Users className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
                    </div>
                    <div className="w-full">
                        <StatCard title="Pending Parcels" value={dashboardData?.pendingParcelCount || "0"} icon={<ArchiveRestore className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
                    </div>
                    <div className="w-full">
                        <StatCard title="Total Parcels" value={dashboardData?.totalParcelCount || "0"} icon={<Archive className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
                    </div>
                    <div className="w-full">
                        <StatCard title="Total Customers" value={dashboardData?.customerCount || "0"} icon={<Archive className="text-textColorLight dark:text-textColorDark" />} isLoading={isLoading} />
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
                        <CircleChart selectedDate={parcelCount} setSelectedDate={setParcelCount} totalParcel={dashboardData?.parcelsInMonth || 0} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1 max-xl:col-span-3 max-lg:col-span-5 rounded-sm  h-full flex flex-col overflow-hidden">
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
                    </div>
                    <div className="col-span-1 max-xl:col-span-3 max-lg:col-span-5 rounded-sm  h-full flex flex-col overflow-hidden">
                        <Map height="100%" topCountries={dashboardData?.topCountries || []} />
                    </div>
                </div>

                <div className="w-full bg-white dark:bg-cardBG rounded-sm  overflow-x-auto overflow-y-hidden dark:border-textColorDark border-textColorLight">
                    <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Transactions" columns={columns} data={TransactionData || []} actions={false} keyField="_id" selectKey="name" tableWidth="w-[150rem]" setStatusFilter={handleSearchChange} isLoading={transactionLoading} pageLimit={pageLimit} dataLength={data?.meta?.totalItems || 0} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
