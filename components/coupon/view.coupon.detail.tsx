'use client';

import { Drawer } from "antd";
import dayjs from "dayjs";

const ViewCouponDetail = (props: {
    setOpenDraw: any,
    openDraw: any,
    viewCouponDetail: CouponResponse | null
}) => {

    const { openDraw, setOpenDraw, viewCouponDetail } = props;
    return (
        <Drawer title={`THÔNG TIN CHI TIẾT COUPON ${viewCouponDetail?.couponCode}`} onClose={() => setOpenDraw(false)} open={openDraw} width={450}>
            {viewCouponDetail ? (
                <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mã coupon: </span>
                        {viewCouponDetail.couponCode}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên coupon: </span>
                        {viewCouponDetail.couponName}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giá trị coupon: </span>
                        {viewCouponDetail.discountType === 'FIXED' ? `${viewCouponDetail.discountAmount.toLocaleString('vi-VN')}đ` : `${viewCouponDetail.discountPercent}%`}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mô tả: </span>
                        {viewCouponDetail.couponDescription}
                    </div>

                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Hiệu lực: </span>
                        {viewCouponDetail.startTime ? dayjs(viewCouponDetail.startTime).format("DD/MM/YYYY HH:mm:ss") : 'Không có dữ liệu'}
                        - {viewCouponDetail.endTime ? dayjs(viewCouponDetail.endTime).format("DD/MM/YYYY HH:mm:ss") : 'Không có dữ liệu'}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giá trị đơn hàng áp dụng: </span>
                        {viewCouponDetail.minOrderValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượt dùng tối đa: </span>
                        {viewCouponDetail.maxUses}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số coupon đã sử dụng: </span>
                        {viewCouponDetail.usedCount || 0}
                    </div>

                </>
            ) : (
                <div>Không có dữ liệu</div>
            )}
        </Drawer>
    );
};

export default ViewCouponDetail;
