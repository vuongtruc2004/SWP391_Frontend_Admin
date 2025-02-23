'use client'
import { CheckOutlined, CloseOutlined, DeleteOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined, ToTopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Popconfirm, Select, Space, Table, TableProps } from 'antd';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import NotificationDetail from './notification.detail';
import TextArea from 'antd/es/input/TextArea';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import NotificationCreate from './notification.create';

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const NotificationTable = (props: {
    notificationPageResponse: PageDetailsResponse<NotificationResponse[]>,
}) => {
    const { notificationPageResponse } = props
    const searchParam = useSearchParams();
    const page = Number(searchParam.get("page")) || 1;
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathName = usePathname();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [recordNotification, setRecordNotification] = useState<NotificationResponse | null>(null)


    const handleDelete = async (notificationId: number) => {
        const deleteRes = await sendRequest<ApiResponse<String>>({
            url: `${apiUrl}/notifications/admin/${notificationId}`,
            method: 'DELETE',
        });

        if (deleteRes.status === 200) {
            notification.success({
                message: 'Thành công!',
                description: 'Bạn đã xóa thông báo thành công!',
            })
            router.refresh
        } else {
            notification.error({
                message: "Thất bại!",
                description: "Bạn đã xóa thông báo thất bại!",
            })
        }
    }
    const columns: TableProps<NotificationResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * notificationPageResponse.pageSize}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'global',
            key: 'global',
            width: '10%',
            render: (global: boolean) => (global ? "Công khai" : "Giới hạn"),
            align: "center"
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: NotificationResponse) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "blue" }} onClick={() => {
                        setRecordNotification(record);
                        setOpenModal(true);
                    }} />
                    {session?.user.roleName === "ADMIN" && (
                        <>
                            <Popconfirm
                                placement="left"
                                title="Xóa môn học"
                                description="Bạn có chắc chắn muốn xóa thông báo này không?"
                                okText="Có"
                                cancelText="Không"
                                onConfirm={() => { handleDelete(record.notificationId) }}
                            >
                                <DeleteOutlined style={{ color: "red" }} />
                            </Popconfirm>

                        </>
                    )}


                </Space>
            ),
            align: 'center'
        },
    ]
    return (
        <>
            <div className='flex justify-end m-5 mt-8'>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => { setOpenCreate(true) }}>Tạo thông báo mới</Button>
            </div>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={notificationPageResponse.content}
                rowKey={"notificationId"}
                pagination={{
                    current: page,
                    pageSize: notificationPageResponse.pageSize,
                    total: notificationPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParam);
                        params.set('page', page.toString());
                        router.replace(`${pathName}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />

            <NotificationDetail
                openModal={openModal}
                setOpenModal={setOpenModal}
                recordNotification={recordNotification}
            />
            <NotificationCreate
                openCreate={openCreate}
                setOpenCreate={setOpenCreate}
            />
        </>
    )
}

export default NotificationTable
