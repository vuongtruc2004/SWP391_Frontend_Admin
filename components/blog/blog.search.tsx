'use client'
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


const BlogSearch = (props: {
    keyword: string,
    published: string
}) => {
    const { keyword, published } = props
    const [form] = useForm();
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();

    // const handleOnChange = (input: string) => {
    //     console.log("check search: ", input);
    // }

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
    return (
        <div className="mt-5 ml-5">
            <Form
                form={form}
                className="w-[90%]"
                onFinish={handleOnFinish}
                initialValues={{ keyword: keyword, published: published }}
            >
                <Form.Item className="w-[50%]" name="keyword">
                    <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm theo tiêu đề, tên tác giả,...." />
                </Form.Item>
                <Form.Item className="w-[19%]" name="published" label="Trạng Thái:">
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
                <Form.Item>

                </Form.Item>

                <div>
                    <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                        Search
                    </Button>
                </div>
            </Form>
        </div>

    )
}

export default BlogSearch;