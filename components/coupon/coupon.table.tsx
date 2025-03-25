'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Client } from '@stomp/stompjs';
import { notification, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UpdateCouponForm from './update.coupon.form';
import ViewCouponDetail from './view.coupon.detail';
import { useSession } from 'next-auth/react';
const CouponTable = (props: { couponPageResponse: PageDetailsResponse<CouponResponse[]> }) => {
    const { data: session, status } = useSession();

    const CountdownTimer = ({ startTime, endTime }) => {
        const [timeLeft, setTimeLeft] = useState(null);
        const [hasStarted, setHasStarted] = useState(false);
        const [stompClient, setStompClient] = useState<Client | null>(null);
        function calculateTimeLeft() {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();

            if (now < start) {
                return `Chưa bắt đầu`;
            }

            const diff = end - now;
            if (diff <= 0) return 'Hết hạn';

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        useEffect(() => {
            const client = new Client({
                brokerURL: "ws://localhost:8386/ws/websocket",
                reconnectDelay: 5000,
                onConnect: () => {

                    client.subscribe("/topic/coupon", (message) => {
                        console.log("📩 Nhận thông báo mới:", message.body);
                        router.refresh();
                    });
                },
                onStompError: (error) => {
                    console.error("WebSocket lỗi:", error);
                }
            });
            client.activate();
            setStompClient(client);
            return () => {
                client.deactivate();
            };
        }, []);

        useEffect(() => {

            setTimeLeft(calculateTimeLeft());
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const start = new Date(startTime).getTime();
                if (now >= start) {
                    setHasStarted(true);

                    setTimeLeft(calculateTimeLeft());
                }
            }, 1000);

            return () => clearInterval(interval);
        }, [startTime, endTime]);

        if (timeLeft === null) return null;

        return <span>{timeLeft}</span>;
    };

    const deleteCoupon = async (couponId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/coupons/${couponId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: `Xoá thành công coupon`,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: `Không thể xoá coupon`,
            })
        }
    }
    const { couponPageResponse } = props;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get('page')) || 1;
    const [openDraw, setOpenDraw] = useState<boolean>(false);
    const [couponDetail, setCouponDetail] = useState<CouponResponse | null>(null);
    const [editingCoupon, setEditingCoupon] = useState<CouponResponse | null>(null);
    const [openEditForm, setOpenEditForm] = useState(false);
    const columns: TableProps<CouponResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * couponPageResponse.pageSize}</>,
        },
        {
            title: 'Tên coupon',
            dataIndex: 'couponName',
            key: 'name',
            width: '20%',
            sorter: (a, b) => a.couponName.localeCompare(b.couponName),
        },
        {
            title: 'Mã coupon',
            dataIndex: 'couponCode',
            key: 'code',
            width: '10%',
            sorter: (a, b) => a.couponCode.localeCompare(b.couponCode),
        },
        {
            title: 'Hiệu lực',
            dataIndex: 'endTime',
            key: 'countdown',
            width: '15%',
            render: (_, record) => <CountdownTimer startTime={record.startTime} endTime={record.endTime} />
        },
        {
            title: 'Giá trị đơn hàng áp dụng',
            dataIndex: 'minOrderValue',
            key: 'min',
            width: '20%',
            render: (price: number) => <>{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}</>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '10%',
            render: (_, record: CouponResponse) => (
                <Space size="middle">
                    <Tooltip color='black' title="Xem chi tiết">
                        <InfoCircleOutlined
                            onClick={() => {
                                setOpenDraw(true);
                                setCouponDetail(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title='Cập nhật coupon' color='blue'>
                        <EditOutlined style={{ color: "blue" }}
                            onClick={() => {
                                setEditingCoupon(record)
                                setOpenEditForm(true)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title='Xoá coupon' color='red'>
                        <Popconfirm
                            placement="left"
                            title="Xóa coupon"
                            description="Bạn có chắc chắn muốn xóa coupon này không?"
                            onConfirm={() => deleteCoupon(record.couponId)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined style={{ color: "red" }} />
                        </Popconfirm>
                    </Tooltip>
                </Space >
            ),
        },
    ];
    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={couponPageResponse?.content}
                rowKey={"couponId"}
                pagination={{
                    current: page,
                    pageSize: couponPageResponse?.pageSize,
                    total: couponPageResponse?.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />
            {openDraw && <ViewCouponDetail setOpenDraw={setOpenDraw} openDraw={openDraw} viewCouponDetail={couponDetail} />}

            <UpdateCouponForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingCoupon={editingCoupon}
                setEditingCoupon={setEditingCoupon}
            />
        </>

    );
};
export default CouponTable;
