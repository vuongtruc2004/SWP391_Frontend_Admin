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
    createdFrom: string,
    createdTo: string
}) => {
    const { keyword, published, createdFrom, createdTo } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const dateFormat = 'DD/MM/YYYY';


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', published: 'ALL', createdFrom: '', createdTo: '' })
        router.push("/quiz")
    }

    const onFinish = (values: any) => {
        const { keyword, published } = values;

        const newSearchParam = new URLSearchParams(searchParam);

        newSearchParam.set("keyword", keyword);
        newSearchParam.set("published", published);

        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    };

    const onChangecreatedFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('createdFrom', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangecreatedTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('createdTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };


    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    useEffect(() => {
        form.setFieldsValue({ keyword, published });
    }, []);

    return (
        <div className="flex gap-2 ml-10 mt-10">
            <Form className='w-[40%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, published: published }}>
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
                        <span className="mr-2 ml-3 text-nowrap mt-1">Ngày tạo :</span>
                        <Form.Item name="createdFrom" initialValue={getValidDayjs(createdFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangecreatedFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span className='ml-2 mr-2'>~</span>
                        <Form.Item name="createdTo" initialValue={getValidDayjs(createdTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangecreatedTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>
                </div>


            </Form >

            <Tooltip color='blue' title='Làm mới'> <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button></Tooltip>
        </div >


    )
}

export default QuizSearch