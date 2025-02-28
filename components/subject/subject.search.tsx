'use client'
import { RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'


const SubjectSearch = (props: {
    keyword: string
}) => {
    const { keyword } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()


    const handleReset = () => {
        form.setFieldsValue({ keyword: '' })
        router.push("/subject")
    }

    const onFinish = (values: any) => {
        const { keyword } = values
        const newSearchParam = new URLSearchParams(searchParam)
        newSearchParam.set("keyword", keyword)
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };


    return (
        <div className="flex gap-4 ml-10 mt-16">
            <Form className='w-[40%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword }}>
                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm tên lĩnh vực, mô tả"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                        onChange={() => { form.submit() }}
                    />
                </Form.Item>
            </Form>
            <Tooltip title="Làm mới" color='blue'>
                <Button type='primary' onClick={handleReset} className='!pt-[20px] !pb-[20px]'><RedoOutlined className='text-2xl' /></Button>
            </Tooltip>
        </div>


    )
}

export default SubjectSearch