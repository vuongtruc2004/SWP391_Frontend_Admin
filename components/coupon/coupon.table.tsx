'use client'
import '@ant-design/v5-patch-for-react-19';
import { Table, TableProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';



const CouponTable = (props: { couponPageResponse: PageDetailsResponse<CouponResponse[]> }) => {
    const { couponPageResponse } = props;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get('page')) || 1;
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
            render: (_, record) => `${record.minOrderValue} - ${record.maxDiscountAmount}`
        },

        {
            title: 'Hành động',
            key: 'action',
            width: '15%',

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
        </>

    );
};
export default CouponTable;
