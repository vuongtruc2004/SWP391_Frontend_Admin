'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, notification, Pagination, Popconfirm, Space, Table, TableProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const NotificationDetail = (props: {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    recordNotification: NotificationResponse | null,
}) => {
    const { openModal, setOpenModal, recordNotification } = props;
    const router = useRouter()
    console.log(recordNotification)

    const handleDeleteNotification = async (userNotificationId: number) => {
        const deleteNotification = await sendRequest<ApiResponse<String>>({
            url: `${apiUrl}/notifications/delete-user/${userNotificationId}`,
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (deleteNotification.status === 200) {
            notification.success({
                message: "Thành công!",
                description: "Bạn đã xóa người nhận thông báo thành công!",
            })
            router.refresh()
        } else {
            notification.error({
                message: "Thất bại!",
                description: "Không thể xóa người nhận thông báo thông báo"
            })
        }
    }
    const columns: TableProps<UserNotificationResponse>['columns'] = [
        {
            title: 'Tên người nhận',
            key: 'user.fullname',
            width: '50%',
            render: (_, record: UserNotificationResponse) => (<p>{record.user.fullname}</p>)
        },
        {
            title: 'Trạng thái đọc',
            key: 'isRead',
            width: '20%',
            render: (_, record: UserNotificationResponse) => (record.isRead ? "Đã đọc" : "Chưa đọc")
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: UserNotificationResponse) => (
                <Space size="middle">
                    <Popconfirm
                        placement="left"
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa người nhận này không?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => { handleDeleteNotification(record.userNotificationId) }}
                    >
                        <DeleteOutlined style={{ color: "red" }} />
                    </Popconfirm>


                </Space>
            ),
            align: "center"
        },
    ];


    return (
        <>
            <Modal open={openModal} onCancel={() => setOpenModal(false)} className="w-[90%]" footer={null} width={850}>
                <div>
                    <h1 className='font-semibold text-lg'>Tiêu đề: {recordNotification?.title}</h1>
                    <p><span className='font-semibold'>Nội dung: </span>{recordNotification?.content}</p>
                    <p><span className='font-semibold'>Người nhận: </span> {recordNotification?.global ? "Tất cả mọi người" : "Giới hạn người nhận"}</p>
                    {recordNotification?.global === false && (
                        <>
                            <Table
                                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                                columns={columns}
                                dataSource={recordNotification.userNotifications}
                                rowKey={"userNotificationId"}

                            />
                        </>

                    )}
                </div>
            </Modal>
        </>
    )
}

export default NotificationDetail
