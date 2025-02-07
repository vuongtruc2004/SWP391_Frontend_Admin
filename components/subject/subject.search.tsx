'use client'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Search from 'antd/es/input/Search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useRef } from 'react'


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
        <>
            <Form onFinish={onFinish} form={form} initialValues={{ keyword: keyword }}>
                <Form.Item name="keyword" >
                    <Input
                        placeholder="Tìm kiếm tên môn học, mô tả"
                        prefix={<SearchOutlined />}
                        style={{
                            width: '40%',
                            padding: '8px',
                            margin: '30px 0 0 30px',
                        }}
                    />
                </Form.Item>

            </Form>
            <Button onClick={handleReset}>Làm mới</Button>
        </>

    )
}

export default SubjectSearch