'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { Column } from '@ant-design/plots';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'



const AgeRangeColumns = () => {
    const chartRef = React.useRef(null);
    const [sixToTwelve, setSixToTwelve] = useState<number>(0)
    const [thirdteenToNineteen, setThirdteenToNineteen] = useState<number>(0)
    const [tewntyToNthirdtynine, setTewntyToNthirdtynine] = useState<number>(0)
    const [fourthtyToFifthtynine, setFourthtyToFifthtynine] = useState<number>(0)
    const [overSixty, setOverSixty] = useState<number>(0)
    const [unknown, setUnknown] = useState<number>(0)
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            if (status === 'authenticated') {
                const response = await sendRequest<ApiResponse<AgeRangeResponse>>({
                    url: `${apiUrl}/users/age_count`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 200) {
                    setSixToTwelve(response.data["6-12"])
                    setThirdteenToNineteen(response.data["13-19"])
                    setTewntyToNthirdtynine(response.data["20-39"])
                    setFourthtyToFifthtynine(response.data["40-59"])
                    setOverSixty(response.data["60-110"])
                    setUnknown(response.data["Unknown"])
                }
            }

        };
        fetchData();
    }, [session]);

    const data = [
        { type: 'Chưa xác định', value: unknown },
        { type: '6-12', value: sixToTwelve },
        { type: '13-19', value: thirdteenToNineteen },
        { type: '20-39', value: tewntyToNthirdtynine },
        { type: '40-59', value: fourthtyToFifthtynine },
        { type: '60+', value: overSixty },
    ];

    const config = {
        data,
        xField: 'type',
        yField: 'value',
        colorField: 'type',
        axis: {
            x: {
                size: 5,
            },
        },
        onReady: (plot: any) => (chartRef.current = plot),
    };
    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] h-[464px]">
            <p className='font-bold text-lg text-center p-4'>ĐỘ TUỔI</p>
            <div className='h-[350px]'>
                <Column {...config} />
            </div>
        </div>
    )
}

export default AgeRangeColumns