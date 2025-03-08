'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { notification, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ViewCouponDetail from './view.coupon.detail';



const CouponTable = (props: { couponPageResponse: PageDetailsResponse<CouponResponse[]> }) => {
    const deleteCoupon = async (couponId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/coupons/${couponId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: `Xoá thành công coupon ${couponDetail?.couponCode}`,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: `Không thể xoá coupon ${couponDetail?.couponCode}`,
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
            title: 'Phạm vị áp dụng',
            dataIndex: 'discountRange',
            key: 'range',
            width: '15%',
            render: (_, record) => `${record.discountRange === 'ALL' ? 'Tất cả' : 'Giới hạn'}`
        },
        {
            title: 'Giá trị đơn hàng áp dụng',
            dataIndex: 'minOrderValue',
            key: 'min',
            width: '15%',
            render: (_, record) => `${record.minOrderValue}`
        },

        {
            title: 'Hành động',
            key: 'action',
            width: '15%',
            render: (_, record: CouponResponse) => (
                <Space size="middle">
                    <Tooltip placement="bottom" title="Xem chi tiết">
                        <InfoCircleOutlined
                            onClick={() => {
                                setOpenDraw(true);
                                setCouponDetail(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip placement="bottom" title='Xoá coupon'>
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
        </>

    );
};
export default CouponTable;
