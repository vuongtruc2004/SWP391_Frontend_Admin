'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DollarCircleFilled, ReconciliationFilled, SmileFilled } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const TotalRevenueCard = () => {

    const [percentSale, setPercentSale] = useState<number>(0)
    const [totalSales, setTotalSales] = useState<number>(0)
    const [totalSalesToday, setTotalSalesToday] = useState<number>(0)
    const [totalSalesYsterday, setTotalSalesYsterday] = useState<number>(0)
    const [percentStudent, setPercentStudent] = useState<number>(0)
    const [totalStudents, setTotalStudents] = useState<number>(0)
    const [totalStudentsToday, setTotalStudentsToday] = useState<number>(0)
    const [totalStudentsYesterday, setTotalStudentsYesterday] = useState<number>(0)
    const [percentCoursesSell, setPercentCoursesSell] = useState<number>(0)
    const [totalCoursesSell, setTotalCoursesSell] = useState<number>(0)
    const [totalCoursesSellToday, setTotalCoursesSellToday] = useState<number>(0)
    const [totalCoursesSellYesterday, setTotalCoursesSellYesterday] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const response = await sendRequest<ApiResponse<DashboardResponse>>({
                url: `${apiUrl}/orders/dashboard-statistics`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {

                const percentSale = response.data.yesterdayRevenue > 0
                    ? ((response.data.todayRevenue - response.data.yesterdayRevenue) / response.data.yesterdayRevenue) * 100
                    : 100;
                setTotalSalesToday(response.data.todayRevenue);
                setPercentSale(percentSale);
                setTotalSales(response.data.totalRevenue);
                setTotalSalesYsterday(response.data.yesterdayRevenue);

                const percentStudent = response.data.yesterdayStudents > 0
                    ? ((response.data.todayStudents - response.data.yesterdayStudents) / response.data.yesterdayStudents) * 100
                    : 100;
                setTotalStudentsToday(response.data.todayStudents);
                setPercentStudent(percentStudent);
                setTotalStudents(response.data.totalStudents);
                setTotalStudentsYesterday(response.data.yesterdayStudents);

                const percentCoursesSell = response.data.yesterdayOrders > 0
                    ? ((response.data.todayOrders - response.data.yesterdayOrders) / response.data.yesterdayOrders) * 100
                    : 100;
                setTotalCoursesSellToday(response.data.todayOrders);
                setPercentCoursesSell(percentCoursesSell);
                setTotalCoursesSell(response.data.totalOrders);
                setTotalCoursesSellYesterday(response.data.yesterdayOrders);

            }
        };
        fetchData();
    }, []);


    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8 w-[52vw]">
            <h2 className="text-lg font-semibold pb-5">Tổng Doanh Số</h2>
            <Row gutter={10} className='flex justify-between'>
                <Col span={7}>
                    <Card
                        title={
                            <DollarCircleFilled style={{ color: '#fa5a7d' }} className="text-3xl" />
                        }
                        style={{ width: 200, backgroundColor: '#ffe2e6' }}
                        styles={{ body: { paddingTop: 0 } }}
                    >
                        <div className="flex items-center">
                            <div>
                                <p>
                                    <CountUp className="font-bold text-lg mr-2" end={totalSales} duration={1.5} separator="," />₫
                                </p>

                                <p className="text-[17px]">Tổng doanh số</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <span title={`Hôm nay thu được ${totalSalesToday ?? 0} ₫\nHôm qua thu được ${totalSalesYsterday} ₫`}>
                                        {percentSale >= 0 ? "+" : ""}{percentSale ?? 0}% hôm qua
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={7} className='mr-3'>
                    <Card
                        title={
                            <SmileFilled style={{ color: '#3dd857' }} className="text-3xl" />
                        }
                        style={{ width: 200, backgroundColor: '#dcfce7' }}
                        styles={{ body: { paddingTop: 0 } }}
                    >
                        <div className="flex items-center">
                            <div>
                                <p>
                                    <CountUp className="font-bold text-lg mr-2" end={totalStudents} duration={1.5} separator="," />người
                                </p>
                                <p className="text-[17px]">Tổng học viên</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <span title={`Hôm nay có ${totalStudentsToday ?? 0} học viên\nHôm qua có ${totalStudentsYesterday ?? 0} học viên`}>
                                        {percentStudent >= 0 ? "+" : ""}{percentStudent ?? 0}% hôm qua
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>

                </Col>

                <Col span={7}>
                    <Card
                        title={
                            <ReconciliationFilled style={{ color: '#bf83ff' }} className="text-3xl" />
                        }
                        style={{ width: 200, backgroundColor: '#f4e8ff' }}
                        styles={{ body: { paddingTop: 0 } }}
                    >
                        <div className="flex items-center">
                            <div>
                                <p>
                                    <CountUp className="font-bold text-lg mr-2" end={totalCoursesSell} duration={1.5} separator="," />khóa
                                </p>
                                <p className="text-[17px]">Khóa học đã bán</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <span title={`Hôm nay đã bán ${totalCoursesSellToday ?? 0} khóa học\nHôm qua đã bán ${totalCoursesSellYesterday ?? 0} khóa học`}>
                                        {percentCoursesSell >= 0 ? "+" : ""}{percentCoursesSell ?? 0}% hôm qua
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default TotalRevenueCard;
