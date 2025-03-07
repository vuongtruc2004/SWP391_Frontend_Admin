'use client'
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { CheckCircleFilled, DeleteOutlined, InfoCircleOutlined, LineOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space, Table, TableProps, Tooltip } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
    const [messageApi, contextHolder] = message.useMessage();


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
            title: 'Email',
            key: 'email',
            width: '20%',
            align: 'center',
            render: (_, record) => record.user.email,
        },
        {
            title: 'Họ và tên khách hàng',
            key: 'userId',
            width: '20%',
            align: 'center',
            render: (_, record) =>
                <span className="text-nowrap">
                    {record.user.fullname}
                </span>,
        },


        {
            title: 'Tổng số tiền',
            key: 'price',
            width: '30%',
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
            width: '40%',
            render: (_, record: OrderResponse) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết hóa đơn" arrow color="#6c757d">
                        <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                            setOpenDraw(true);
                            setOrderDetail(record);
                        }} />
                    </Tooltip>


                    <Tooltip title="Đã thanh toán" arrow color="#6c757d">
                        <CheckCircleFilled style={{ color: 'green' }} onClick={() => handleChangeStatus(record.orderId)} />
                    </Tooltip>

                    {record.orderStatus !== "COMPLETED" ? (
                        <Tooltip title="Xóa hóa đơn" arrow color="#6c757d">
                            <Popconfirm
                                placement="left"
                                title="Xóa hóa đơn"
                                description="Bạn có chắc chắn mua xóa hóa đơn này không này không?"
                                okText="Có"
                                cancelText="Không"
                                onConfirm={() => handleDeleteOrder(record.orderId)}
                            >
                                <DeleteOutlined style={{ color: "red" }} />
                            </Popconfirm>
                        </Tooltip>
                    ) : (
                        <LineOutlined />
                    )}
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


    const handleDeleteOrder = async (orderId: number) => {
        const response = await sendRequest<ApiResponse<void>>({
            url: `${apiUrl}/purchase/${orderId}`,
            method: 'DELETE'
        });
        if (response.status === 200) {
            messageApi.open({
                type: 'success',
                content: response.message.toString(),
            });
            router.refresh();
        } else {
            messageApi.open({
                type: 'error',
                content: response.message.toString(),
            });
        }
    }


    return (
        <>
            {contextHolder}
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6 text-nowrap text-center"
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



