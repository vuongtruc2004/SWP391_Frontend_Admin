"use client"
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, DatePickerProps, Form, Input, InputNumber, Row, Select, Slider, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const { RangePicker } = DatePicker;
const CourseSearch = (props: { keyword: string, accepted?: string, createdFrom: string, createdTo: string, minPrice: number, maxPrice: number }) => {
    const { keyword, accepted, createdFrom, createdTo, minPrice, maxPrice } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const [render, setRender] = useState(false);
    const [inputValue, setInputValue] = useState(minPrice);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session, status } = useSession();

    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };

    const handleReset = () => {
        setRange([minPrice, maxPrice])
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


    const step = 10000; // Bước nhảy 10.000 đ
    const rangeFromURL: [number, number] = [
        searchParam.get("minPrice") ? Number(searchParam.get("minPrice")) : minPrice,
        searchParam.get("maxPrice") ? Number(searchParam.get("maxPrice")) : maxPrice
    ]
    const [range, setRange] = useState<[number, number]>(rangeFromURL);


    const handleSliderChange = (value: number | number[]) => {
        if (!Array.isArray(value) || value.length < 2) return; // Đảm bảo value là mảng có 2 phần tử

        setRange(value as [number, number]);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Thiết lập timeout mới sau 3 giây
        timeoutRef.current = setTimeout(() => {
            const newSearchParam = new URLSearchParams(searchParam);
            newSearchParam.set("minPrice", value[0].toString());
            newSearchParam.set("maxPrice", value[1].toString());
            newSearchParam.set("page", "1");
            router.replace(`${pathName}?${newSearchParam}`);

            timeoutRef.current = null; // Reset lại sau khi thực hiện
        }, 800);
    };


    if (!render) {
        return <></>;
    }

    const dateFormat = 'DD/MM/YYYY'
    return (
        <div className=" w- full flex flex-col gap-2 ml-10 mt-5">
            <Form
                className='!w-[100%]'
                onFinish={onFinish}
                form={form}
                initialValues={{ keyword: keyword, accepted: accepted, inputValue: inputValue }}
            >
                <div className='w-full flex gap-2'>
                    <div className='w-[40%]'>
                        <Form.Item name="keyword" className="mb-0 w-full">
                            <Input
                                placeholder="Tìm kiếm tên khóa học"
                                prefix={<SearchOutlined />}
                                className='!p-[10px]'
                                onChange={() => form.submit()}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Tooltip placement="bottom" title='Tải lại trang'>
                            <Button onClick={handleReset} className='!p-[20px] !bg-blue-600' size='large'><ReloadOutlined className='!text-white' /></Button>
                        </Tooltip>
                    </div>
                </div>

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
                        <h4 className='pt-1'>Ngày Tạo:</h4>
                        <Form.Item name="createdFrom" initialValue={getValidDayjs(createdFrom)}>
                            <DatePicker onChange={onChangeFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <h4>~</h4>
                        <Form.Item name="createdTo" initialValue={getValidDayjs(createdTo)}>
                            <DatePicker onChange={onChangeTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>
                    <div className='flex gap-2 pt-10'>
                        <Form.Item label="Khoảng giá">
                            <Row align="middle" gutter={5}>
                                {/* Input Min */}
                                <Col>
                                    <InputNumber
                                        min={minPrice}
                                        max={maxPrice}
                                        step={step}
                                        value={range[0]}
                                        // onChange={(value) => handleInputChange(0, value)}
                                        readOnly
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"}
                                    />
                                </Col>

                                <Col>~</Col>

                                {/* Input Max */}
                                <Col>
                                    <InputNumber
                                        min={minPrice}
                                        max={maxPrice}
                                        step={step}
                                        value={range[1]}
                                        // onChange={(value) => handleInputChange(1, value)}
                                        readOnly
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"}
                                    />
                                </Col>

                                {/* Slider */}
                                <Col span={24}>
                                    <Slider
                                        range
                                        min={minPrice}
                                        max={maxPrice}
                                        step={step}
                                        value={range}
                                        onChange={handleSliderChange}
                                        style={{
                                            width: '90%'
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CourseSearch
