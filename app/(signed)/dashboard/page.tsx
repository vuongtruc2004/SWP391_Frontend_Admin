
import AgeRangeColumns from "@/components/dashboard/age.range.bar";
import CourseDayLine from "@/components/dashboard/course.day.line";
import CourseTrendingChart from "@/components/dashboard/course.trend.chart";
import GenderPieChart from "@/components/dashboard/gender.pie.chart";
import TotalRevenueCard from "@/components/dashboard/total.revenue.card";
import { Col, Row } from "antd";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thống kê",
};

const DashboardPage = () => {
    return (
        <div className="max-h-[87vh] overflow-y-auto overflow-x-hidden">
            <Row gutter={[16, 24]}>
                <Col span={16}>
                    <TotalRevenueCard />
                </Col>

                <Col span={8}>
                    <GenderPieChart />
                </Col>

                <Col span={24}>
                    <CourseTrendingChart />
                </Col>

                <Col span={16}>
                    <CourseDayLine />
                </Col>

                <Col span={8}>
                    <AgeRangeColumns />
                </Col>
            </Row>
        </div>

    );
};

export default DashboardPage;
