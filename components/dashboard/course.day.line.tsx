'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { Line } from '@ant-design/plots'
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'
import isoWeek from "dayjs/plugin/isoWeek";
import { DoubleRightOutlined } from '@ant-design/icons';


dayjs.extend(isoWeek); // Kích hoạt plugin ISO Week
const CourseDayLine = () => {

    function getStartOfWeek(): string {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Lấy thứ trong tuần (0 = Chủ nhật, 1 = Thứ Hai, ...)
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Nếu Chủ Nhật thì quay về Thứ Hai trước đó
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff); // Lùi về Thứ Hai đầu tuần
        return monday.toISOString().split("T")[0]; // Format YYYY-MM-DD
    }

    function getEndOfWeek(): string {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = 7 - dayOfWeek; // Số ngày cần thêm để đến Chủ Nhật
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + diff);
        return sunday.toISOString().split("T")[0]; // Format YYYY-MM-DD
    }


    const [firstDayOfWeek, setFirstDayOfWeek] = useState<string>(getStartOfWeek());
    const [endDayOfWeek, setEndDayOfWeek] = useState<string>(getEndOfWeek());
    const [monday, setMonday] = useState<number>(0);
    const [tuesday, setTuesday] = useState<number>(0);
    const [wednesday, setWednesday] = useState<number>(0);
    const [thursday, setThursday] = useState<number>(0);
    const [friday, setFriday] = useState<number>(0);
    const [saturday, setSaturday] = useState<number>(0);
    const [sunday, setSunday] = useState<number>(0);

    const getCurrentWeek = (): Dayjs => {
        return dayjs().startOf("isoWeek"); // Trả về ngày đầu tuần (Thứ Hai)
    };

    useEffect(() => {
        fetchData(firstDayOfWeek, endDayOfWeek);
    }, [firstDayOfWeek, endDayOfWeek]); // Khi state thay đổi, tự động gọi lại API


    const fetchData = async (startDate: string, endDate: string) => {
        const response = await sendRequest<ApiResponse<CourseWeekResponse>>({
            url: `${apiUrl}/orders/course_sell_in_week?startDate=${startDate}&endDate=${endDate}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            setMonday(response.data["MONDAY"]);
            setTuesday(response.data["TUESDAY"]);
            setWednesday(response.data["WEDNESDAY"]);
            setThursday(response.data["THURSDAY"]);
            setFriday(response.data["FRIDAY"]);
            setSaturday(response.data["SATURDAY"]);
            setSunday(response.data["SUNDAY"]);
        }
    };


    const handleWeekChange = (date: Dayjs | null) => {
        if (date) {
            const newStartOfWeek = date.startOf("isoWeek").format("YYYY-MM-DD");
            const newEndOfWeek = date.endOf("isoWeek").format("YYYY-MM-DD");

            setFirstDayOfWeek(newStartOfWeek);
            setEndDayOfWeek(newEndOfWeek);
        }
    };


    const data = [
        { Ngày: 'Thứ 2', Số_Lượng: monday },
        { Ngày: 'Thứ 3', Số_Lượng: tuesday },
        { Ngày: 'Thứ 4', Số_Lượng: wednesday },
        { Ngày: 'Thứ 5', Số_Lượng: thursday },
        { Ngày: 'Thứ 6', Số_Lượng: friday },
        { Ngày: 'Thứ 7', Số_Lượng: saturday },
        { Ngày: 'Chủ nhật', Số_Lượng: sunday },

    ];

    const config = {
        data,
        xField: 'Ngày',
        yField: 'Số_Lượng',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };
    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] ">
            <p className='font-bold text-lg text-center p-4'>KHOÁ HỌC ĐÃ BÁN TRONG TUẦN</p>

            <div className='flex justify-end mr-14 items-center mb-5'>
                <DatePicker
                    size={'middle'}
                    picker="week"
                    defaultValue={dayjs().startOf("isoWeek")}
                    onChange={(date) => handleWeekChange(date)}
                />
                <div className='border w-fit ml-4 p-1 rounded-md'>
                    {firstDayOfWeek} <DoubleRightOutlined className='text-green-500 ml-2 mr-2' /> {endDayOfWeek}
                </div>
            </div>

            <div className='h-[350px]'>
                <Line {...config} />
            </div>
        </div>
    )
}

export default CourseDayLine