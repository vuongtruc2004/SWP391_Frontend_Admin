'use client'

import { CheckCircleFilled, EditOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import ViewOrderDetail from "./view.order.detail";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";

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
    const [messageApi, contextHolder] = message.useMessage();

    const columns: TableProps<OrderResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * orderPageResponse.pageSize}</>,
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'center',
            render: (updatedAt: string, record) => (
                <span>
                    {updatedAt !== record.createdAt && record.orderStatus === 'COMPLETED' ? dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss') : 'Không có dữ liệu'}
                </span>
            ),
            sorter: {
                compare: (a: OrderResponse, b: OrderResponse) =>
                    dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
            },
        },
        {
            title: 'Mã hóa đơn',
            key: 'orderCode',
            align: 'center',
            render: (_, record) => record.orderCode,
        },
        {
            title: 'Email',
            key: 'email',
            align: 'center',
            render: (_, record) => record.user.email,
        },
        {
            title: 'Họ và tên khách hàng',
            key: 'userId',
            align: 'center',
            render: (_, record) =>
                <span className="text-nowrap">
                    {record.user.fullname}
                </span>,
        },

        {
            title: 'Tổng số tiền',
            key: 'price',
            align: 'center',
            render: (_, record) => `${record.totalAmount.toLocaleString()}₫`


        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (_, record) => {
                const statusColors: Record<string, string> = {
                    PENDING: 'red',
                    COMPLETED: 'green',
                    EXPIRED: 'gray',
                    CANCELLED: 'orange',
                };

                const statusLabels: Record<string, string> = {
                    PENDING: 'Chưa thanh toán',
                    COMPLETED: 'Đã thanh toán',
                    EXPIRED: 'Đã hết hạn',
                    CANCELLED: 'Đã hủy',
                };

                return (
                    <span className="text-nowrap" style={{ color: statusColors[record.orderStatus] }}>
                        {statusLabels[record.orderStatus] || 'Không xác định'}
                    </span>
                );
            },
            sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
        }
        ,
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record: OrderResponse) => (
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
                    <CheckCircleFilled style={{ color: 'green' }} onClick={() => handleChangeStatus(record.orderId)} />
                </Space>
            ),
        },
    ];

    const handleChangeStatus = async (orderId: number) => {
        const orderResponse = await sendRequest<ApiResponse<OrderResponse>>({
            url: `${apiUrl}/orders/active/${orderId}`,
        });
        if (orderResponse.status === 200) {
            messageApi.open({
                type: 'success',
                content: orderResponse.message.toString(),
            });
            router.refresh();
        } else {
            messageApi.open({
                type: 'error',
                content: orderResponse.message.toString(),
            });
        }
    }
    return (
        <>
            {contextHolder}
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6 w-full "
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
