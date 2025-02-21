'use client'

import { CheckCircleFilled, EditOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import ViewOrderDetail from "./view.order.detail";

const OrderTable = (props: {
    orderPageResponse: PageDetailsResponse<OrderResponse[]>
}) => {
    const { orderPageResponse } = props;
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const router = useRouter();
    const pathName = usePathname();
    const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
    const [openDraw, setOpenDraw] = useState<boolean>(false);
    const columns: TableProps<OrderResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * orderPageResponse.pageSize}</>,
        },

        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            align: 'center',
            render: (createdAt: string) => (
                <span>
                    {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss') : 'Không có dữ liệu'}
                </span>
            ),
            sorter: {
                compare: (a: OrderResponse, b: OrderResponse) =>
                    dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '20%',
            align: 'center',
            render: (updatedAt: string) => (
                <span>
                    {updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss') : 'Không có dữ liệu'}
                </span>
            ),
            sorter: {
                compare: (a: OrderResponse, b: OrderResponse) =>
                    dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
            },
        },
        {
            title: 'Họ và tên khách hàng',
            key: 'fullname',
            width: '30%',
            align: 'center',
            render: (_, record) => record.user.fullname,
            sorter: (a, b) => a.user.fullname.localeCompare(b.user.fullname),
        },

        {
            title: 'Tổng số tiền',
            key: 'price',
            width: '30%',
            align: 'center',
            render: (_, record) => {
                const totalPrice = record.orderDetails.reduce((total, detail) => total + detail.price, 0);
                return `${totalPrice.toLocaleString()}₫`
            },
            sorter: (a, b) => {
                const total1 = a.orderDetails.reduce((total, detail) => total + detail.price, 0);
                const total2 = a.orderDetails.reduce((total, detail) => total + detail.price, 0);
                return total1 - total2;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (_, record) => (
                <span className="text-nowrap" style={{ color: record.orderStatus == 'PENDING' ? 'red' : 'green' }} >
                    {record.orderStatus == 'PENDING' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                </span>
            ),
            sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '40%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setOrderDetail(record);
                    }} />

                    <EditOutlined className="text-blue-500" style={{ color: "blue" }}
                        onClick={() => {
                            // setEditingUser(record)
                            // setOpenEditForm(true)
                        }}
                    />
                    <CheckCircleFilled style={{ color: 'green' }} />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={orderPageResponse.content}
                rowKey={"orderId"}
                pagination={{
                    current: page,
                    pageSize: orderPageResponse.pageSize,
                    total: orderPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathName}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />
            <ViewOrderDetail
                openDraw={openDraw}
                setOpenDraw={setOpenDraw}
                viewOrderDetail={orderDetail}

            />
        </>
    )
}

export default OrderTable;
