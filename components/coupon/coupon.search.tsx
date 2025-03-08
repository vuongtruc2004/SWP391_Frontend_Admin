'use client'
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Slider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const CouponSearch = (props: any) => {
    const { keyword, couponName, couponCode, minPrice, maxPrice } = props;
    const router = useRouter();
    const searchParam = useSearchParams();
    const [form] = useForm();
    const [range, setRange] = useState([minPrice, maxPrice]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    const handleReset = () => {
        setRange([minPrice, maxPrice]);
        form.resetFields();
        router.push("/coupon");
    };

    const onFinish = (values: any) => {
        const newSearchParam = new URLSearchParams(searchParam);
        if (values.keyword) newSearchParam.set("keyword", values.keyword);
        else newSearchParam.delete("keyword");

        newSearchParam.set("page", "1");
        router.replace(`/coupon?${newSearchParam}`);
    };

    const handleSliderChange = (value: any) => {
        if (!Array.isArray(value) || value.length < 2) return;
        setRange(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const newSearchParam = new URLSearchParams(searchParam);
            newSearchParam.set("minPrice", value[0].toString());
            newSearchParam.set("maxPrice", value[1].toString());
            newSearchParam.set("page", "1");
            router.replace(`/coupon?${newSearchParam}`);
            timeoutRef.current = null;
        }, 800);

    };

    return (
        <div className="flex flex-col gap-2 ml-10 mt-5">
            <Form className='w-[90%]' onFinish={onFinish} form={form} initialValues={{ keyword }}>
                <Form.Item name="keyword" className="mb-0 w-[50%]">
                    <Input placeholder="Tìm kiếm mã hoặc tên coupon" prefix={<SearchOutlined />} className='!p-[10px]' />
                </Form.Item>
                <div className='w-full flex items-center gap-5'>
                    <Form.Item label="Khoảng giá">
                        <Row align="middle" gutter={5}>
                            <Col>
                                <InputNumber min={minPrice} max={maxPrice} step={10000} value={range[0]} readOnly formatter={(value) => `${value}đ`} />
                            </Col>
                            <Col>~</Col>
                            <Col>
                                <InputNumber min={minPrice} max={maxPrice} step={10000} value={range[1]} readOnly formatter={(value) => `${value}đ`} />
                            </Col>
                            <Col span={24}>
                                <Slider range min={minPrice} max={maxPrice} step={10000} value={range} onChange={handleSliderChange} style={{ width: '90%' }} />
                            </Col>
                        </Row>
                    </Form.Item>
                </div>
                <div className='flex gap-4'>
                    <Button type="primary" htmlType="submit" className='!p-[10px]'>Tìm kiếm</Button>
                    <Button onClick={handleReset} className='!p-[10px]'>Làm mới</Button>
                </div>
            </Form>
        </div>
    );
};

export default CouponSearch;
