'use client'
import { EditOutlined, InfoCircleOutlined, LockFilled, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Space, Table, TableProps } from 'antd';
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { sendRequest } from '@/utils/fetch.api';
import '@ant-design/v5-patch-for-react-19';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/utils/url';
import ViewUserDetail from './view.user.detail';
import UpdateUserForm from './update.user.form';



const UserTable = (props: {
    userPageResponse: PageDetailsResponse<UserResponse[]>,
    componentPDF: RefObject<HTMLDivElement | null>,
}) => {
    const { userPageResponse, componentPDF } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [user, setUser] = useState<UserResponse | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1; // Lấy số trang từ URL
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null)

    const [sheetData, setSheetData] = useState<UserResponse[]>([]);



    const lockUser = async (userId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<Boolean>>({
            url: `${apiUrl}/users/${userId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(">>> check", deleteResponse)

        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành công",
                description: deleteResponse.data ? "Khóa người dùng thành công!" : "Mở khóa người dùng thành công!",
            });
            router.refresh();
        } else {
            console.log("chay vao day kh");
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
            render: (text, record, index) => <>{(index + 1) + (page - 1) * userPageResponse.pageSize}</>,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '30%',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '30%',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleName',
            key: 'rolename',
            width: '10%',
            sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
            render: (gender: string) => {
                if (!gender) {
                    return "Chưa thiết lập";
                }
                return gender === "MALE" ? "Nam" : "Nữ";
            },
            sorter: (a, b) => a.gender.localeCompare(b.gender),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'locked',
            key: 'locked',
            width: '10%',
            render: (locked: boolean) => (
                <span style={{ color: locked ? 'red' : 'green' }}>
                    {locked ? "Bị khóa" : "Không khóa"}
                </span>
            ),
            sorter: {
                compare: (a, b) => Number(a.locked) - Number(b.locked)
            },
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

                    <EditOutlined className="text-blue-500" style={{ color: "blue" }}
                        onClick={() => {
                            setEditingUser(record)
                            setOpenEditForm(true)
                        }}
                    />
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
