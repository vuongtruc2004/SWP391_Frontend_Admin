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
    allowSeeAnswers: string
    createdFrom: string,
    createdTo: string,
    durationFrom: number | string,
    durationTo: number | string
}) => {
    const { keyword, published, createdFrom, allowSeeAnswers, createdTo, durationFrom, durationTo } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const dateFormat = 'DD/MM/YYYY';


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', published: 'ALL', allowSeeAnswers: 'ALL', createdFrom: '', createdTo: '', durationFrom: '', durationTo: '' })
        router.push("/quiz")
    }

    const onFinish = (values: any) => {
        const { keyword, published, allowSeeAnswers } = values;
        console.log("allowSeeAnswers>>", allowSeeAnswers)
        const newSearchParam = new URLSearchParams(searchParam);

        newSearchParam.set("keyword", keyword);
        newSearchParam.set("published", published);
        newSearchParam.set("allowSeeAnswers", allowSeeAnswers);
        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    };

    const onChangecreatedFrom: DatePickerProps['onChange'] = (date) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('createdFrom', date.format('YYYY-MM-DD'))
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangecreatedTo: DatePickerProps['onChange'] = (date) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('createdTo', date.format('YYYY-MM-DD'))
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };

    const onChangeDurationFrom: (value: string) => void = (value) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('durationFrom', value)
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeDurationTo: (value: string) => void = (value) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('durationTo', value)
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };


    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    useEffect(() => {
        form.setFieldsValue({ keyword, published, allowSeeAnswers });
    }, []);

    return (
        <div className=" ml-7 mt-10">
            <Form className='w-full' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, published: published, allowSeeAnswers: allowSeeAnswers }}>
                <div className='flex gap-2'>
                    <Form.Item style={{ width: '40%' }} name="keyword" className="mb-0">
                        <Input
                            placeholder="Tìm kiếm bằng tiêu đề bài kiểm tra hoặc chương học"
                            prefix={<SearchOutlined />}
                            className='!p-[10px]'
                            onChange={() => form.submit()}
                        />
                    </Form.Item>
                    <Tooltip color='blue' title='Làm mới'> <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button></Tooltip>

                </div>


                <div className='flex'>

                    <Form.Item name="published" className="mb-0" label="Trạng thái:">
                        <Select
                            style={{ width: 100, marginRight: '30px' }}
                            allowClear={false}
                            onChange={() => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "open", label: 'Mở' },
                                { value: "close", label: 'Đóng' },

                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="allowSeeAnswers" className="mb-0" label="Cho xem đáp án:">
                        <Select
                            style={{ width: 100, marginRight: '30px' }}
                            allowClear={false}
                            onChange={() => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "open", label: 'Mở' },
                                { value: "close", label: 'Đóng' },
                            ]}
                        />
                    </Form.Item>
                    <div className='flex mr-8'>
                        <span className="mr-2 ml-3 text-nowrap mt-1">Thời gian: </span>
                        <Form.Item name="durationFrom" className="mb-0" >
                            <Input
                                style={{ width: 100 }}
                                placeholder="Từ phút"
                                className='w-8'
                                onChange={(e) => onChangeDurationFrom(e.target.value)}
                            />
                        </Form.Item>
                        <span className='ml-2 mr-2'>~</span>
                        <Form.Item name="durationTo" className="mb-0" >
                            <Input
                                style={{ width: 100 }}
                                placeholder="Đến phút"
                                className='w-8'
                                onChange={(e) => onChangeDurationTo(e.target.value)}
                            />
                        </Form.Item>
                    </div>


                    <div className='flex gap-10'>
                        <div className='flex'>
                            <span className="mr-2 ml-3 text-nowrap mt-1">Ngày tạo:</span>
                            <Form.Item name="createdFrom" initialValue={getValidDayjs(createdFrom)}>
                                <DatePicker style={{ width: '120px' }} onChange={onChangecreatedFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                            </Form.Item>
                            <span className='ml-2 mr-2'>~</span>
                            <Form.Item name="createdTo" initialValue={getValidDayjs(createdTo)}>
                                <DatePicker style={{ width: '120px' }} onChange={onChangecreatedTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                            </Form.Item>
                        </div>
                    </div>
                </div>


            </Form >

        </div >


    )
}

export default QuizSearch