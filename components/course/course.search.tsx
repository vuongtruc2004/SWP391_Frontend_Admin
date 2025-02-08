'use client'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, DatePickerProps, Form, Input, InputNumber, InputNumberProps, Row, Select, Slider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Dayjs } from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

const { RangePicker } = DatePicker;
const CourseSearch = (props: { keyword: string, accepted?: string, createdFrom?: string, createdTo?: string }) => {
    const { keyword, accepted, createdFrom, createdTo } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()
    const [render, setRender] = useState(false);
    const [inputValue, setInputValue] = useState(1);

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

        // if (createAt) {
        //     const formattedDate = createAt.format('YYYY-MM-DD'); // Format lại trước khi thêm vào URL
        //     newSearchParam.set("createAt", formattedDate);
        // } else {
        //     newSearchParam.delete("createAt");
        // }

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

    const onChangeRange: InputNumberProps['onChange'] = (value) => {
        setInputValue(value as number);
    }

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
        <div className="flex flex-col gap-4 ml-10 mt-16">
            <Form
                className='w-[40%]'
                onFinish={onFinish}
                form={form}
                initialValues={{ keyword: keyword, accepted: accepted }}
            >
                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm tên môn học, mô tả"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                    />
                </Form.Item>
                <div>
                    <Form.Item name="accepted" className="mb-0" label="Trạng Thái">
                        <Select

                            placeholder="Trạng thái"
                            style={{ width: 150 }}
                            allowClear
                            onChange={handleChangeStatus}
                            options={[
                                { value: "all", label: "Tất cả" },
                                { value: "active", label: 'Đã kích hoạt' },
                                { value: "unactive", label: 'Chưa kích hoạt' }
                            ]}
                        />
                    </Form.Item>
                    <div className='flex gap-4'>
                        <h4>Ngày Tạo:</h4>
                        <Form.Item name="createdFrom">
                            <DatePicker onChange={onChangeFrom} format={dateFormat} placeholder='Từ Ngày' allowClear={false} />
                        </Form.Item>
                        <h4>~</h4>
                        <Form.Item name="createdTo">
                            <DatePicker onChange={onChangeTo} format={dateFormat} placeholder='Đến Ngày' allowClear={false} />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Row>
                            <Col span={12}>
                                <Slider
                                    min={150000}
                                    max={950000}
                                    onChange={onChangeRange}
                                    value={typeof inputValue === 'number' ? inputValue : 0}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={1}
                                    max={20}
                                    style={{ margin: '0 16px', color: 'black' }}
                                    value={inputValue}
                                    onChange={onChangeRange}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}

                                />
                            </Col>
                        </Row>
                    </Form.Item>


                </div>

                <div className="flex gap-4 mt-3">
                    <Button type="primary" htmlType="submit" className='!p-[10px]'>Tìm kiếm</Button>
                    <Button onClick={handleReset} className='!p-[10px]'>Làm mới</Button>
                </div>
            </Form>
        </div>
    )
}

export default CourseSearch
