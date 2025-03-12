'use client'
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, DatePickerProps, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import BlogCreate from "./blog.create";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";


const BlogSearch = (props: {
    keyword: string,
    published: string,
    createdFrom: string,
    createdTo: string
}) => {
    const { keyword, published, createdFrom, createdTo } = props
    const [form] = useForm();
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const [openFormCreate, setOpenFormCreate] = useState(false);
    const { data: session } = useSession();

    const handleOnFinish = (values: any) => {
        const { keyword, published } = values;
        const newSearchParam = new URLSearchParams(searchParam);

        if (keyword) {
            newSearchParam.set("keyword", keyword);
        } else {
            newSearchParam.delete("keyword");
        }

        if (published !== "all") {
            newSearchParam.set("published", published)
        } else {
            newSearchParam.delete("published")
        }

        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    }

    const handleOnChange = (value: string) => {
        const newSearchParam = new URLSearchParams(searchParam);
        newSearchParam.set("published", value)
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    }

    const handleOnClickButton = () => {
        setOpenFormCreate(true);
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

    const handleOnReset = () => {
        form.setFieldsValue({ keyword: "", createdFrom: "", createdTo: "", published: "all" }),
            router.push("/blog")
    }

    const dateFormat = 'DD/MM/YYYY';
    const getValidDayjs = (dateString?: string) => {
        return dateString ? dayjs(dateString, "YYYY-MM-DD").isValid() ? dayjs(dateString, "YYYY-MM-DD") : null : null;
    };
    return (
        <>
            <div className="mt-5 ml-5">
                <Form
                    form={form}
                    className="w-[95%]"
                    onFinish={handleOnFinish}
                    initialValues={{ keyword: keyword, published: published }}
                >
                    <Form.Item className="w-[50%]" name="keyword">
                        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm theo tiêu đề, tên tác giả,...." />
                    </Form.Item>
                    <div className="flex gap-7">
                        <div className="w-[15%]">
                            <Form.Item className="w-[100%]" name="published" label="Trạng Thái:">
                                <Select
                                    placeholder="Trạng Thái"
                                    onChange={handleOnChange}
                                    options={[
                                        { value: "all", label: 'All' },
                                        { value: "public", label: 'Công khai' },
                                        { value: "private", label: 'Không công khai' },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <div className='flex gap-3'>
                            <h4 className='pt-1'>Ngày Tạo:</h4>
                            <Form.Item name="createdFrom" initialValue={getValidDayjs(createdFrom)}>
                                <DatePicker onChange={onChangeFrom} format={dateFormat} placeholder='Từ Ngày' allowClear />
                            </Form.Item>
                            <h4>~</h4>
                            <Form.Item name="createdTo" initialValue={getValidDayjs(createdTo)}>
                                <DatePicker onChange={onChangeTo} format={dateFormat} placeholder='Đến Ngày' allowClear />
                            </Form.Item>
                        </div>
                    </div>



                    <div className="w-full flex justify-between">
                        <div className="flex gap-2">
                            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                                Tìm kiếm
                            </Button>
                            <Button onClick={handleOnReset}>Làm mới</Button>
                        </div>
                        {session?.user.roleName === "MARKETING" && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleOnClickButton}>Tạo bài viết </Button>
                        )}


                    </div>
                </Form>
            </div>
            <BlogCreate
                openFormCreate={openFormCreate}
                setOpenFormCreate={setOpenFormCreate}
            />
        </>


    )
}

export default BlogSearch;