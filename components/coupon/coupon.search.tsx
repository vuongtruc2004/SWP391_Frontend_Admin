'use client'
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Slider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const CouponSearch = (props: any) => {
    const { keyword, couponName, couponCode, minPrice, maxPrice, discount_range } = props;
    const router = useRouter();
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const [form] = useForm();
    // const [range, setRange] = useState([minPrice, maxPrice]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const step = 10000;
    const rangeFromURL: [number, number] = [
        searchParam.get("minPrice") ? Number(searchParam.get("minPrice")) : 0,
        searchParam.get("maxPrice") ? Number(searchParam.get("maxPrice")) : 1000000,
    ]
    const [range, setRange] = useState<[number, number]>(rangeFromURL);
    const handleChangeStatus = (value: string) => {
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set('discount_range', value);
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    }


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
                <Form.Item name="keyword" className="mb-0 w-[42.5vw]">
                    <Input placeholder="Tìm kiếm mã hoặc tên coupon" prefix={<SearchOutlined />} className='!p-[10px]' />
                </Form.Item>
                <div className='w-full flex gap-5'>
                    <Form.Item name="discount_range" className="mb-0" label="Trạng Thái">
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={handleChangeStatus}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "COURSES", label: 'Giới hạn' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Khoảng giá" className="flex-grow w-[250px]">
                        <Row align="middle" gutter={5} className="w-full items-center">
                            <Col>
                                <InputNumber
                                    min={0} max={1000000} step={10000}
                                    value={range[0]} readOnly
                                    formatter={(value) => `${value}đ`}
                                    style={{ width: 90 }}
                                />
                            </Col>
                            <Col>~</Col>
                            <Col>
                                <InputNumber
                                    min={0} max={1000000} step={10000}
                                    value={range[1]} readOnly
                                    formatter={(value) => `${value}đ`}
                                    style={{ width: 90 }}
                                />
                            </Col>
                        </Row>
                        <Slider
                            range min={0} max={1000000} step={10000}
                            value={range} onChange={handleSliderChange}
                            style={{ width: '24%' }}
                        />
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
