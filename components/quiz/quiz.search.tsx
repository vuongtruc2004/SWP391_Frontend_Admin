'use client'
import { SearchOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, DatePicker, DatePickerProps, Form, Input, Select, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'


const QuizSearch = (props: {
    keyword: string,
    published: string,
    maxAttempts: string | number,
    startedFrom: string,
    startedTo: string,
    endedFrom: string,
    endedTo: string,
    haveTime: string
}) => {
    const { keyword, published, maxAttempts, startedFrom, startedTo, endedFrom, endedTo, haveTime } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const dateFormat = 'DD/MM/YYYY';


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', published: 'ALL', maxAttempts: '', startedFrom: '', startedTo: '', endedFrom: '', endedTo: '', haveTime: 'ALL' })
        router.push("/quiz")
    }

    const onFinish = (values: any) => {
        const { keyword, published, maxAttempts, haveTime } = values;

        const newSearchParam = new URLSearchParams(searchParam);

        newSearchParam.set("keyword", keyword);
        newSearchParam.set("published", published);
        newSearchParam.set("maxAttempts", maxAttempts);
        if (haveTime === 'noTime') {
            form.setFieldsValue({ startedFrom: '', startedTo: '', endedFrom: '', endedTo: '' });
            newSearchParam.set("startedFrom", '');
            newSearchParam.set("startedTo", '');
            newSearchParam.set("endedFrom", '');
            newSearchParam.set("endedTo", '');
        }
        newSearchParam.set("haveTime", haveTime);
        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    };

    const onChangeStartedFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('startedFrom', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeStartedTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('startedTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeEndedFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('endedFrom', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeEndedTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('endedTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };

    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    useEffect(() => {
        form.setFieldsValue({ keyword, published, maxAttempts, haveTime });
    }, []);

    return (
        <div className="flex gap-2 ml-10 mt-10">
            <Form className='w-[40%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, published: published, maxAttempts: maxAttempts, haveTime: haveTime }}>
                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm bằng tiêu đề bài kiểm tra"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                        onPressEnter={() => form.submit()}
                    />
                </Form.Item>
                <div className='flex justify-between gap-28'>
                    <Form.Item name="published" className="mb-0" label="Trạng thái:">
                        <Select
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={(value) => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "active", label: 'Đang mở' },
                                { value: "unactive", label: 'Bị đóng' },

                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="maxAttempts" className="mb-0" label="Lượt kiểm tra:">
                        <Input
                            type="number"
                            placeholder="Nhập số lượt kiểm tra"
                            style={{ width: 200 }}
                            min={1}
                            onChange={() => form.submit()}
                        />
                    </Form.Item>

                    <Form.Item name="haveTime" className="mb-0" label="Thời gian:">
                        <Select
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={(value) => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "noTime", label: 'Vô thời hạn' },
                                { value: "haveTime", label: 'Có thời hạn' }
                            ]}
                        />
                    </Form.Item>
                </div>
                <div className='flex gap-10'>
                    <div className='flex'>
                        <span className="mr-2 ml-3 text-nowrap mt-1">Bắt đầu :</span>
                        <Form.Item name="startedFrom" initialValue={getValidDayjs(startedFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeStartedFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span className='ml-2 mr-2'>~</span>
                        <Form.Item name="startedTo" initialValue={getValidDayjs(startedTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeStartedTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>

                    <div className='flex'>
                        <span className="mr-2 text-nowrap mt-1">Kết thúc :</span>
                        <Form.Item name="endedFrom" initialValue={getValidDayjs(endedFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeEndedFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span className='ml-2 mr-2'>~</span>
                        <Form.Item name="endedTo" initialValue={getValidDayjs(endedTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeEndedTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>
                </div>


            </Form >

            <Tooltip color='blue' title='Làm mới'> <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button></Tooltip>
        </div >


    )
}

export default QuizSearch