'use client'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const CourseSearch = (props: { keyword: string, accepted?: string }) => {
    const { keyword, accepted } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()

    const handleReset = () => {
        form.setFieldsValue({ keyword: '', accepted: undefined })
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

        if (accepted !== undefined) {
            newSearchParam.set("accepted", accepted)
        } else {
            newSearchParam.delete("accepted")
        }

        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    }

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

                <Form.Item name="accepted" className="mb-0">
                    <Select
                        placeholder="Trạng thái"
                        style={{ width: 150 }}
                        allowClear
                        options={[
                            { value: 1, label: 'Đã kích hoạt' },
                            { value: 0, label: 'Chưa kích hoạt' }
                        ]}
                    />
                </Form.Item>

                <div className="flex gap-4">
                    <Button type="primary" htmlType="submit" className='!p-[10px]'>Tìm kiếm</Button>
                    <Button onClick={handleReset} className='!p-[10px]'>Làm mới</Button>
                </div>
            </Form>
        </div>
    )
}

export default CourseSearch
