'use client'
import { SearchOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Search from 'antd/es/input/Search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useRef } from 'react'


const UserSearch = (props: {
    keyword: string,
    roleName: string,
    locked: string,
    gender: string,
}) => {
    const { keyword, roleName, locked, gender } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', roleName: 'ALL', gender: 'ALL', locked: 'ALL' })
        router.push("/user")
    }

    const onFinish = (values: any) => {
        const { keyword, roleName, locked, gender } = values;

        const newSearchParam = new URLSearchParams(searchParam);

        newSearchParam.set("keyword", keyword)
        newSearchParam.set("locked", locked);
        newSearchParam.set("roleName", roleName);
        newSearchParam.set("gender", gender);
        newSearchParam.set("page", "1")
        router.replace(`${pathName}?${newSearchParam}`)
    };



    useEffect(() => {
        form.setFieldsValue({ keyword, roleName, locked, gender });
    }, []);

    return (
        <div className="flex gap-2 ml-10 mt-10">
            <Form className='w-[40%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, locked: locked, roleName: roleName, gender: gender }}>
                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm bằng tên người dùng, email, vai trò"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                        onPressEnter={() => form.submit()}
                    />
                </Form.Item>
                <div className='flex justify-between gap-28'>
                    <Form.Item name="locked" className="mb-0" label="Trạng thái:">
                        <Select
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={(value) => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "active", label: 'Không bị khóa' },
                                { value: "unactive", label: 'Bị khóa' },

                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="roleName" className="mb-0" label="Vai trò:">
                        <Select
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={(value) => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "ADMIN", label: 'ADMIN' },
                                { value: "EXPERT", label: 'EXPERT' },
                                { value: "MARKETING", label: 'MARKETING' },
                                { value: "USER", label: 'USER' },

                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="gender" className="mb-0" label="Giới tính:">
                        <Select
                            style={{ width: 150 }}
                            allowClear={false}
                            onChange={(value) => {
                                form.submit();
                            }}
                            options={[
                                { value: "ALL", label: "Tất cả" },
                                { value: "MALE", label: 'Nam' },
                                { value: "FEMALE", label: 'Nữ' },
                                { value: 'UNKNOWN', label: 'Chưa thiết lập' }
                            ]}
                        />
                    </Form.Item>
                </div>

            </Form >

            <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button>
        </div >


    )
}

export default UserSearch