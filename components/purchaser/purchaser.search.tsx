'use client'
import { BackwardFilled, SearchOutlined, UndoOutlined } from "@ant-design/icons"
import { Button, Form, Input, Select } from "antd"
import { useForm } from "antd/es/form/Form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const PurchaserSearch = (props: {
    keyword: string,
    courseId: number,
    locked: string,
    gender: string,
    accountType: string
}) => {
    const { keyword, courseId, locked, gender, accountType } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const [form] = useForm()


    const handleReset = () => {
        form.setFieldsValue({ keyword: '', locked: 'ALL', gender: 'ALL', accountType: 'ALL' })
        router.push(`/course/purchaser/${courseId}`);
    }

    const handelBack = () => {
        router.push('/course');
    }

    const onFinish = (values: any) => {
        const { keyword, locked, gender, accountType } = values;

        const newSearchParam = new URLSearchParams(searchParam);

        newSearchParam.set("keyword", keyword);
        newSearchParam.set("locked", locked);
        newSearchParam.set("gender", gender);
        newSearchParam.set("accountType", accountType);


        newSearchParam.set("page", "1");
        router.replace(`${pathName}?${newSearchParam}`);
    };



    useEffect(() => {
        form.setFieldsValue({ keyword, locked, gender, accountType });
    }, []);

    return (
        <div className="flex gap-4 ml-10 mt-10">
            <Form className='w-[40%]' onFinish={onFinish} form={form} initialValues={{ keyword: keyword, locked: locked, gender: gender, accountType: accountType }}>
                <Form.Item name="keyword" className="mb-0">
                    <Input
                        placeholder="Tìm kiếm bằng tên người dùng, email, vai trò"
                        prefix={<SearchOutlined />}
                        className='!p-[10px]'
                        onPressEnter={() => form.submit()}
                    />
                </Form.Item>
                <div >
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
                                    { value: "active", label: 'Không khóa' },
                                    { value: "unactive", label: 'Bị khóa' },

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
                        <Form.Item name="accountType" className="mb-0" label="Loại tài khoản:">
                            <Select
                                style={{ width: 150 }}
                                allowClear={false}
                                onChange={(value) => {
                                    form.submit();
                                }}
                                options={[
                                    { value: "ALL", label: "Tất cả" },
                                    { value: "CREDENTIALS", label: 'CREDENTIALS' },
                                    { value: "GITHUB", label: 'GITHUB' },
                                    { value: "GOOGLE", label: 'GOOGLE' }

                                ]}
                            />
                        </Form.Item>
                    </div>
                    <Button icon={<BackwardFilled />} type='primary' onClick={handelBack} className='!p-[20px] w-24'>Quay lại</Button>
                </div>

            </Form >

            <Button icon={<UndoOutlined style={{ fontSize: '20px' }} />} type='primary' onClick={handleReset} className='!p-[20px]'></Button>
        </div >


    )
}

export default PurchaserSearch
