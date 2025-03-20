'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DollarCircleFilled, DoubleRightOutlined, ReconciliationFilled, SmileFilled } from '@ant-design/icons';
import { Card, Col, Row, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const TotalRevenueCard = () => {

    const getStartOfWeek = (): string => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        return monday.toISOString().split("T")[0];
    }

    const getEndOfWeek = (): string => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + diff);
        return sunday.toISOString().split("T")[0];
    }

    const [type, setType] = useState<string>("week");
    const [revenue, setRevenue] = useState<number>(0)
    const [students, setStudents] = useState<number>(0)
    const [courseSold, setCourseSold] = useState<number>(0)
    const [percentSale, setPercentSale] = useState<number>(0)
    const [totalSalesToday, setTotalSalesToday] = useState<number>(0)
    const [totalSalesYesterday, setTotalSalesYesterday] = useState<number>(0)
    const [percentStudent, setPercentStudent] = useState<number>(0)
    const [totalStudentsToday, setTotalStudentsToday] = useState<number>(0)
    const [totalStudentsYesterday, setTotalStudentsYesterday] = useState<number>(0)
    const [percentCoursesSell, setPercentCoursesSell] = useState<number>(0)
    const [totalCoursesSellToday, setTotalCoursesSellToday] = useState<number>(0)
    const [totalCoursesSellYesterday, setTotalCoursesSellYesterday] = useState<number>(0)
    const [currentText, setCurrentText] = useState<string>("");

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await sendRequest<ApiResponse<DashboardResponse>>({
                url: `${apiUrl}/orders/dashboard-statistics/${type}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {

                setRevenue(response.data.revenue)
                setStudents(response.data.students)
                setCourseSold(response.data.orders)

                const percentSale = response.data.yesterdayRevenue > 0
                    ? ((response.data.todayRevenue - response.data.yesterdayRevenue) / response.data.yesterdayRevenue) * 100
                    : response.data.todayRevenue === 0 ? 0 : 100;
                setTotalSalesToday(response.data.todayRevenue);
                setPercentSale(percentSale);
                setTotalSalesYesterday(response.data.yesterdayRevenue);

                const percentStudent = response.data.yesterdayStudents > 0
                    ? ((response.data.todayStudents - response.data.yesterdayStudents) / response.data.yesterdayStudents) * 100
                    : response.data.todayRevenue === 0 ? 0 : 100;
                setTotalStudentsToday(response.data.todayStudents);
                setPercentStudent(percentStudent);
                setTotalStudentsYesterday(response.data.yesterdayStudents);

                const percentCoursesSell = response.data.yesterdayOrders > 0
                    ? ((response.data.todayOrders - response.data.yesterdayOrders) / response.data.yesterdayOrders) * 100
                    : response.data.todayRevenue === 0 ? 0 : 100;
                setTotalCoursesSellToday(response.data.todayOrders);
                setPercentCoursesSell(percentCoursesSell);
                setTotalCoursesSellYesterday(response.data.yesterdayOrders);

            }
        };
        fetchData();
        if (type === 'month') {
            setCurrentText(getCurrentMonth());
        } else if (type === 'quarter') {
            setCurrentText(getCurrentQuarter())
        } else if (type === 'year') {
            setCurrentText(getCurrentYear())
        }
    }, [type]);

    const handleChange = (value: string) => {
        setType(value);
    };



    const getCurrentMonth = (): string => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${year}-${month}`;
    }

    const getCurrentQuarter = (): string => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const quarter = Math.ceil(month / 3);
        const startMonth = (quarter - 1) * 3 + 1;
        const endMonth = quarter * 3;

        return `Q${quarter} (${year}): Tháng ${startMonth} - Tháng ${endMonth}`;
    };

    const getCurrentYear = (): string => {
        var currentYear = new Date().getFullYear();
        return `Năm ${currentYear}`
    };

    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8 w-[52vw]">
            <div className='flex justify-between'>
                <h2 className="text-lg font-semibold pb-5">Thống kê số liệu</h2>
                <div className='flex gap-5'>
                    <div className='border w-[13vw] h-[32px] flex justify-center p-1 rounded-md'>
                        {type === 'week' ? (
                            <>
                                {getStartOfWeek()} <DoubleRightOutlined style={{ color: 'green' }} className="ml-2 mr-2" /> {getEndOfWeek()}
                            </>
                        ) : (
                            currentText
                        )}
                    </div>
                    <Select
                        className='w-[150px]'
                        showSearch
                        placeholder="Chọn số lượng khóa học"
                        optionFilterProp="label"
                        defaultValue="week"
                        onChange={handleChange}
                        options={[
                            { value: 'week', label: 'Tuần hiện tại' },
                            { value: 'month', label: 'Tháng hiện tại' },
                            { value: 'quarter', label: 'Quý hiện tại' },
                            { value: 'year', label: 'Năm hiện tại' },
                        ]}
                    />
                </div>

            </div>
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
                                    <CountUp className="font-bold text-lg mr-2" end={revenue} duration={1.5} separator="," />₫
                                </p>

                                <p className="text-[17px]">Tổng doanh số</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <Tooltip
                                        title={
                                            <>
                                                Doanh số hôm nay: {formatNumber(totalSalesToday) ?? 0} ₫<br />
                                                Doanh số hôm qua: {formatNumber(totalSalesYesterday) ?? 0} ₫
                                            </>
                                        }
                                        color='#fa5a7d'
                                        placement='bottom'
                                    >
                                        <span>
                                            {percentSale >= 0 ? "+" : ""}{percentSale.toFixed(1) ?? 0}% hôm qua
                                        </span>
                                    </Tooltip>
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
                                    <CountUp className="font-bold text-lg mr-2" end={students} duration={1.5} separator="," />người
                                </p>
                                <p className="text-[17px]">Tổng học viên</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <Tooltip
                                        title={
                                            <>
                                                Số lượng học viên mới hôm nay: {formatNumber(totalStudentsToday) ?? 0} học viên<br />
                                                Số lượng học viên mới hôm qua: {formatNumber(totalStudentsYesterday) ?? 0} học viên
                                            </>
                                        }
                                        color='#3dd857'
                                        placement='bottom'
                                    >                                        <span >
                                            {percentStudent >= 0 ? "+" : ""}{percentStudent.toFixed(1) ?? 0}% hôm qua
                                        </span>
                                    </Tooltip>
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
                                    <CountUp className="font-bold text-lg mr-2" end={courseSold} duration={1.5} separator="," />khóa
                                </p>
                                <p className="text-[17px]">Khóa học đã bán</p>
                                <p className="text-xs mt-1 text-blue-500 cursor-pointer" >
                                    <Tooltip
                                        title={
                                            <>
                                                Khóa học đã bán hôm nay: {formatNumber(totalCoursesSellToday) ?? 0} khóa học<br />
                                                Khóa học đã bán hôm qua: {formatNumber(totalCoursesSellYesterday) ?? 0} khóa học
                                            </>
                                        }
                                        color='#bf83ff'
                                        placement='bottom'
                                    >                                        <span >
                                            {percentCoursesSell >= 0 ? "+" : ""}{percentCoursesSell.toFixed(1) ?? 0}% hôm qua
                                        </span>
                                    </Tooltip>
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col >
            </Row >
        </div >
    );
}

export default TotalRevenueCard;
