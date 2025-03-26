'use client'
import { EditOutlined, InfoCircleOutlined, LockOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Space, Table, TableProps } from 'antd';
import { RefObject, useState } from 'react'
import { sendRequest } from '@/utils/fetch.api';
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/utils/url';
import ViewUserDetail from './view.user.detail';
import UpdateUserForm from './update.user.form';
import { useSession } from 'next-auth/react';

const UserTable = (props: {
    userPageResponse: PageDetailsResponse<UserResponse[]>,
    componentPDF: RefObject<HTMLDivElement | null>,
}) => {
    const { data: session, status } = useSession();
    const { userPageResponse, componentPDF } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [user, setUser] = useState<UserResponse | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1;
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null)

    const lockUser = async (userId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<Boolean>>({
            url: `${apiUrl}/users/${userId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });

        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành công",
                description: deleteResponse.data ? "Khóa người dùng thành công!" : "Mở khóa người dùng thành công!",
            });
            router.refresh();
        } else {
            notification.error({
                message: "Thất bại",
                description: String(deleteResponse.message),
            })
        }
    }

    const columns: TableProps<UserResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * userPageResponse.pageSize}</>,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '30%',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '30%',
            align: 'center',
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleName',
            key: 'rolename',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
            align: 'center',
            render: (gender: string) => {
                if (!gender) {
                    return <span className='text-nowrap'>Chưa thiết lập</span>;
                }
                return gender === "MALE" ? "Nam" : "Nữ";
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'locked',
            key: 'locked',
            width: '10%',
            align: 'center',
            render: (locked: boolean) => (
                <span style={{ color: locked ? 'red' : 'green', whiteSpace: 'nowrap' }}>
                    {locked ? "Bị khóa" : "Đang hoạt động"}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '40%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setUser(record);
                    }} />
                    {record.roleName !== "USER" && (
                        <EditOutlined className="text-blue-500" style={{ color: "blue" }} onClick={() => {
                            setEditingUser(record);
                            setOpenEditForm(true)
                        }} />
                    )}

                    <Popconfirm
                        placement="left"
                        title={`${record.locked ? "Mở khóa" : "Khóa"} người dùng`}
                        description={`Bạn có chắc chắn muốn ${record.locked ? "mở khóa" : "khóa"} người dùng này không?`}
                        onConfirm={() => lockUser(record.userId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <LockOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className='overflow-y-auto' ref={componentPDF} >
                <Table
                    className=" max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                    columns={columns}
                    dataSource={userPageResponse.content}
                    rowKey={"userId"}
                    pagination={{
                        current: page,
                        pageSize: userPageResponse.pageSize,
                        total: userPageResponse.totalElements,
                        onChange(page, pageSize) {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', page.toString());
                            router.replace(`${pathname}?${params}`);
                        },
                    }}
                    showSorterTooltip={false}
                />
            </div>
            <ViewUserDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                user={user}
                setUser={setUser}
            />

            <UpdateUserForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
            />
        </>
    );
};
export default UserTable;
