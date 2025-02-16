
import TotalRevenueCard from "@/components/dashboard/total.revenue.card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thống kê",
};
const DashboardPage = () => {
    return (
        <div>
            <TotalRevenueCard />
        </div>)
}

export default DashboardPage