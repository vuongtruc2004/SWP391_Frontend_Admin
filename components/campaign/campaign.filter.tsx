"use client"
import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, DatePickerProps, Form, Input, InputNumber, Row, Select, Slider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const CampaignFilter = (props: { keyword: string, discountType?: string, startTime: string, endTime: string }) => {
    const { keyword, discountType, startTime, endTime } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const [render, setRender] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session, status } = useSession();

    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    const handleReset = () => {
        form.setFieldsValue({ keyword: '', accepted: "all", createdFrom: '', createdTo: '' })
        router.push("/course")
    }

    const onFinish = (values: any) => {
        const { keyword, accepted } = values
        const newSearchParam = new URLSearchParams(searchParam)

        if (keyword) {
            newSearchParam.set("keyword", keyword)
        } else {
            newSearchParam.delete("keyword")
        }

        if (accepted !== "all") {
            newSearchParam.set("accepted", accepted)
        } else {
            newSearchParam.delete("accepted")
        }

        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    }

    const handleChangeStatus = (value: string) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('accepted', value);
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    }

    const onChangeFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('createdFrom', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        } else {
            newSearchParam.delete('createdFrom')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('createdTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        } else {
            newSearchParam.delete('createdTo')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };



    useEffect(() => {
        if (!render) {
            setRender(true);
        }
    }, []);

    if (!render) {
        return <></>;
    }

    const dateFormat = 'DD/MM/YYYY'
    return (
        <div className="flex flex-col gap-2 ml-10 mt-5">
            <Form
                className='w-[90%]'
                onFinish={onFinish}
                form={form}
                initialValues={{ keyword: keyword, discountType: discountType, createdFrom: startTime, endTime: endTime }}
            >
                <Form.Item name="keyword" className="mb-0 w-[50%]">
                    <Input
                        placeholder="Tìm kiếm tên Lĩnh vực, mô tả"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                    />
                </Form.Item>
                <div className='w-full flex items-center gap-5'>
                    <Form.Item name="accepted" className="mb-0" label="Trạng Thái">
                        <Select

                            placeholder="Trạng thái"
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={handleChangeStatus}
                            options={[
                                { value: "all", label: "Tất cả" },
                                { value: "active", label: 'Đã kích hoạt' },
                                { value: "unactive", label: 'Chưa kích hoạt' }
                            ]}
                        />
                    </Form.Item>
                    <div className='flex gap-3'>
                        <h4 className='pt-1'>Ngày bắt đầu:</h4>
                        <Form.Item name="startTime" initialValue={getValidDayjs(endTime)}>
                            <DatePicker onChange={onChangeFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <h4>~</h4>
                        <h4 className='pt-1'>Ngày kết thúc:</h4>
                        <Form.Item name="endTime" initialValue={getValidDayjs(endTime)}>
                            <DatePicker onChange={onChangeTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>
                </div>

                <div className={`flex gap-4 ${session?.user.roleName !== "EXPERT" ? 'mb-10' : ''}`}>
                    <Button type="primary" htmlType="submit" className='!p-[10px]'>Tìm kiếm</Button>
                    <Button onClick={handleReset} className='!p-[10px]'>Làm mới</Button>
                </div>
            </Form>
        </div>
    )
}

export default CampaignFilter
