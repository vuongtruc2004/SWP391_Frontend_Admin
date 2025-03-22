'use client'
import { RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, DatePickerProps, Form, Grid, Input, InputNumber, Row, Select, Slider, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'


const CampaignSearch = ({ keyword, discountRange, discountType, startFrom, startTo, endFrom, endTo, minPrice, maxPrice }: {
    keyword: string;
    discountRange: string;
    discountType: string;
    minPrice: number;
    maxPrice: number;
    startFrom: string;
    startTo: string;
    endFrom: string;
    endTo: string;

}) => {
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const dateFormat = 'DD/MM/YYYY';

    const handleReset = () => {
        form.setFieldsValue({ keyword: '', discountRange: 'ALLS', discountType: 'ALL', minPrice: '', maxPrice: '', startFrom: '', startTo: '', endFrom: '', endTo: '' })
        router.push("/campaign")
    }

    const onFinish = (values: any) => {
        const { keyword, discountRange, discountType, minPrice, maxPrice } = values
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set("keyword", keyword)
        newSearchParam.set("discountRange", discountRange)
        newSearchParam.set("discountType", discountType)
        newSearchParam.set("minPrice", minPrice);
        newSearchParam.set("maxPrice", maxPrice);
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };

    const handlePriceChange = () => {
        form.submit();
    };

    const onChangeStartFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (dayjs.isDayjs(date)) {
            newSearchParam.set('startFrom', date.format('YYYY-MM-DD'));
        } else {
            newSearchParam.delete('startFrom')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeStartTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('startTo', date.format('YYYY-MM-DD'))
        } else {
            newSearchParam.delete('startTo')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeEndFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('endFrom', date.format('YYYY-MM-DD'))
        } else {
            newSearchParam.delete('endFrom')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeEndTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('endTo', date.format('YYYY-MM-DD'))
        } else {
            newSearchParam.delete('endTo')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };

    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    return (
        <div className="flex gap-2 ml-10 mt-10">
            <Form className='w-[50%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, discountRange: discountRange, discountType: discountType }}>

                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm tên chiến dịch, mô tả, "
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                        onChange={() => { form.submit() }}
                    />
                </Form.Item>

                <div className='flex items-center gap-7'>

                    <div className='flex gap-1  '>
                        <span className="w-24 text-nowrap mt-1">Ngày bắt đầu:</span>
                        <Form.Item name="startFrom" initialValue={getValidDayjs(startFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeStartFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span>~</span>
                        <Form.Item name="startTo" initialValue={getValidDayjs(startTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeStartTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>

                    <Form.Item name="discountRange" className="mb-0" label="Phạm vi áp dụng:">
                        <Select
                            style={{ width: '150px' }}
                            allowClear={false}
                            onChange={() => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALLS", label: "Tất cả các loại" },
                                { value: "ALL", label: 'Tất cả' },
                                { value: "COURSES", label: 'Giới hạn' },

                            ]}
                        />
                    </Form.Item>

                </div>

                <div className='flex items-center gap-7'>

                    <div className='flex gap-1  '>
                        <span className="w-24 text-nowrap mt-1">Ngày kết thúc:</span>
                        <Form.Item name="endFrom" initialValue={getValidDayjs(endFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeEndFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span>~</span>
                        <Form.Item name="endTo" initialValue={getValidDayjs(endTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangeEndTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>

                    <Form.Item name="discountType" className="mb-0" label="Loại giảm giá:">
                        <Select
                            style={{ width: 150, marginRight: '30px' }}
                            allowClear={false}
                            onChange={() => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "FIXED", label: 'Giá cố định' },
                                { value: "PERCENTAGE", label: 'Phần trăm' },

                            ]}
                        />
                    </Form.Item>

                </div>

                <div className='flex gap-1'>
                    <Form.Item name="minPrice" label="Số lượng giảm">
                        <InputNumber
                            type="number"
                            style={{ width: '120px' }}
                            placeholder="Từ số"
                            min={0}
                            onChange={handlePriceChange}
                        />
                    </Form.Item>
                    <span>~</span>
                    <Form.Item name="maxPrice">
                        <InputNumber
                            type="number"
                            style={{ width: '120px' }}
                            placeholder="Đến số"
                            min={0}
                            onChange={handlePriceChange}
                        />
                    </Form.Item>
                </div>


            </Form>
            <Tooltip title="Làm mới" color='blue'>
                <Button type='primary' onClick={handleReset} className='!pt-[20px] !pb-[20px]'><RedoOutlined className='text-2xl' /></Button>
            </Tooltip>
        </div>


    )
}

export default CampaignSearch