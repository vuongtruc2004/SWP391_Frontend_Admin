'use client'

import React, { useEffect, useState } from 'react'
import { Pie } from '@ant-design/plots';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';



const GenderPieChart = () => {

    const [maleCount, setMaleCount] = useState<number>(0)
    const [femaleCount, setFemaleCount] = useState<number>(0)
    const [unkhownCount, setUnkhownCount] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const response = await sendRequest<ApiResponse<GenderCountResponse>>({
                url: `${apiUrl}/users/gender_count`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setMaleCount(response.data.maleCount)
                setFemaleCount(response.data.femaleCount)
                setUnkhownCount(response.data.unknownCount)
            }
        };
        fetchData();
    }, []);

    const data = [
        { type: 'Nam', value: maleCount },
        { type: 'Nữ', value: femaleCount },
        { type: 'Chưa xác định', value: unkhownCount },
    ];

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.7,
        label: {
            text: (d: any) => `${d.type}\n ${d.value}`,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'bottom',
                rowPadding: 4,
            },
        },
        meta: {
            value: { alias: 'Số lượng' },
            type: { alias: 'Loại' }
        },
        tooltip: false,

    };


    return (

        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)]" style={{ height: '269px' }}>
            <p className='font-bold text-xs text-center'>GIỚI TÍNH</p>
            <Pie {...config} />
        </div>

    )
}

export default GenderPieChart