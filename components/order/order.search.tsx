'use client'

import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, DatePicker, DatePickerProps, Form, Input, InputNumber, Select, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const OrderSearch = (props: {
    keyword: string,
    createdFrom: string,
    createdTo: string,
    paidAtFrom: string,
    paidAtTo: string,
    minPrice: number,
    maxPrice: number
}) => {
    const { keyword, createdFrom, createdTo, paidAtFrom, paidAtTo, minPrice, maxPrice } = props;
    const router = useRouter();
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const [form] = useForm();
    const dateFormat = 'DD/MM/YYYY';


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', createdFrom: '', createdTo: '', paidAtFrom: '', paidAtTo: '', minPrice: '', maxPrice: '' })
        router.push("/order")
    }

    const onFinish = (values: any) => {
        const { keyword, orderStatus, minPrice, maxPrice } = values;

        const newSearchParam = new URLSearchParams(searchParam);
        newSearchParam.set("keyword", keyword);
        newSearchParam.set("minPrice", minPrice);
        newSearchParam.set("maxPrice", maxPrice);

        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    };
    const onChangeCreatedFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (dayjs.isDayjs(date)) {
            newSearchParam.set('createdFrom', date.format('YYYY-MM-DD'));
        } else {
            newSearchParam.delete('createdFrom')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangeCreatedTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('createdTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        } else {
            newSearchParam.delete('createdTo')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangepaidAtFrom: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('paidAtFrom', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        } else {
            newSearchParam.delete('paidAtFrom')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };
    const onChangepaidAtTo: DatePickerProps['onChange'] = (date, dateString) => {
        const newSearchParam = new URLSearchParams(searchParam)
        if (date) {
            newSearchParam.set('paidAtTo', date.format('YYYY-MM-DD')) // Định dạng chuẩn cho URL
        } else {
            newSearchParam.delete('paidAtTo')
        }
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };

    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };
    const handlePriceChange = () => {
        form.submit();
    };

    useEffect(() => {
        form.setFieldsValue({ keyword });
    }, []);

    return (
        <>
            <div className="flex gap-2 ml-10 mt-10">
                <Form className='w-[50%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword }}>
                    <Form.Item name="keyword" className="mb-0">
                        <Input
                            placeholder="Tìm kiếm bằng họ tên khách hàng, email, mã hóa đơn"
                            prefix={<SearchOutlined />}
                            className='!p-[10px]'
                            onChange={() => form.submit()}
                        />
                    </Form.Item>
                    <div className='flex items-center gap-5'>


                        <div className='flex gap-1  '>
                            <span className="w-24 text-nowrap mt-1">Ngày tạo:</span>
                            <Form.Item name="createdFrom" initialValue={getValidDayjs(createdFrom)}>
                                <DatePicker style={{ width: '120px' }} onChange={onChangeCreatedFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                            </Form.Item>
                            <span>~</span>
                            <Form.Item name="createdTo" initialValue={getValidDayjs(createdTo)}>
                                <DatePicker style={{ width: '120px' }} onChange={onChangeCreatedTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                            </Form.Item>
                        </div>





                    </div>
                    <div className='flex gap-1 '>

                        <span className="w-24 text-nowrap mt-1">Ngày cập nhật :</span>
                        <Form.Item name="paidAtFrom" initialValue={getValidDayjs(paidAtFrom)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangepaidAtFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <span>~</span>
                        <Form.Item name="paidAtTo" initialValue={getValidDayjs(paidAtTo)}>
                            <DatePicker style={{ width: '120px' }} onChange={onChangepaidAtTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>


                        <div className='flex gap-1'>
                            <span className="w-15 text-nowrap mt-1 ml-4">Giá tiền:</span>
                            <Form.Item name="minPrice">
                                <InputNumber
                                    type="number"
                                    style={{ width: '120px' }}
                                    placeholder="Từ giá"
                                    min={0}
                                    onChange={handlePriceChange}
                                />
                            </Form.Item>
                            <span>~</span>
                            <Form.Item name="maxPrice">
                                <InputNumber
                                    type="number"
                                    style={{ width: '120px' }}
                                    placeholder="Đến giá"
                                    min={0}
                                    onChange={handlePriceChange}
                                />
                            </Form.Item>
                        </div>


                    </div>

                </Form >

                <Tooltip color="blue" title='Làm mới'>  <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button></Tooltip>
            </div >

        </>
    )
}

export default OrderSearch;