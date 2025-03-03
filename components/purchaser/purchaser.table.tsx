'use client'

import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Table, TableProps } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ViewPurchaserDetail from "./view.purchaser.detail";
import { useSession } from "next-auth/react";

const PurchaserTable = (props: {
    purchaserPageResponse: PageDetailsResponse<UserResponse[]>;
}) => {
    const { purchaserPageResponse } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [userDetail, setUserDetail] = useState<UserResponse | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const { data: session, status } = useSession();

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
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * purchaserPageResponse.pageSize}</>,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '25%',
            align: 'center',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
            align: 'center',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'accountType',
            key: 'accountType',
            width: '15%',
            align: 'center',
            sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
            align: 'center',
            render: (gender: string) => {
                if (!gender) {
                    return <span className="text-nowrap">Chưa thiết lập</span>;
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
            align: 'center',
            render: (locked: boolean) => (
                <span style={{ color: locked ? 'red' : 'green', whiteSpace: 'nowrap' }}>
                    {locked ? "Bị khóa" : "Đang hoạt động"}
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
            align: 'center',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setUserDetail(record);
                    }} />
                    {
                        session?.user.roleName == 'ADMIN' &&

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
                    }
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={purchaserPageResponse.content}
                rowKey={"userId"}
                pagination={{
                    current: page,
                    pageSize: purchaserPageResponse.pageSize,
                    total: purchaserPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />
            <ViewPurchaserDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                userDetail={userDetail}
            />
        </>
    )
}
export default PurchaserTable;