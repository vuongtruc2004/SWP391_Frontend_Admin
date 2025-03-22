'use client'

import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { Bar } from '@ant-design/plots'
import { Divider, Select } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const CourseTrendingChart = () => {
    const [chartData, setChartData] = useState<{ type: string; value: number }[]>([]);
    const [courseNumber, setCourseNumber] = useState<number>(5);
    const { data: session, status } = useSession();
    const [cachedSession, setCachedSession] = useState<any>(null);

    useEffect(() => {
        if (session && typeof window !== "undefined") {
            localStorage.setItem("sessionData", JSON.stringify(session));
        }
    }, [session]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSession = localStorage.getItem("sessionData");
            if (storedSession) {
                setCachedSession(JSON.parse(storedSession));
            }
        }
    }, []);

    const accessToken = cachedSession?.accessToken || session?.accessToken;

    useEffect(() => {
        if (!accessToken) return;

        const fetchData = async () => {
            try {
                const response = await sendRequest<ApiResponse<CourseSalesEntryResponse>>({
                    url: `${apiUrl}/orders/count`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                });

                if (response?.data && Array.isArray(response.data)) {
                    const formattedData = response.data
                        .slice(0, courseNumber)
                        .map((item: Record<string, number>) => {
                            const key = Object.keys(item)[0];
                            const value = Object.values(item)[0] as number;
                            return { type: key, value: value };
                        });

                    setChartData(formattedData);
                }

            } catch (error) {
                console.error("API error:", error);
            }
        };

        fetchData();
    }, [accessToken, courseNumber]);

    const handleChange = (value: string) => {
        setCourseNumber(Number(value));
    };

    const config = {
        data: chartData,
        xField: 'type',
        yField: 'value',
        colorField: 'type',
        state: {
            unselected: { opacity: 0.5 },
            selected: { lineWidth: 3, stroke: 'red' },
        },
        interaction: {
            elementSelect: true,
        },
    };

    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] ">
            <p className='font-bold text-lg text-center p-4'>CÁC KHÓA HỌC PHỔ BIẾN</p>
            <div className='flex justify-end mr-28'>
                <Select
                    showSearch
                    placeholder="Chọn số lượng khóa học"
                    optionFilterProp="label"
                    defaultValue="5"
                    onChange={handleChange}
                    options={[
                        { value: '5', label: '5 Khóa học' },
                        { value: '11', label: '11 Khóa học' },
                        { value: '15', label: '15 Khóa học' },
                        { value: '20', label: '20 Khóa học' },
                    ]}
                />
            </div>

            <div className='h-[350px]'>
                <Bar {...config} />
            </div>

            <div className='pl-3 mt-[-5vh] mb-6'>Số khóa đã bán</div>
        </div>
    );
}

export default CourseTrendingChart;