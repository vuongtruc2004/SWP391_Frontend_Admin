'use client';

import { DoubleRightOutlined } from "@ant-design/icons";
import { Collapse, Drawer } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const ViewCouponDetail = (props: {
    setOpenDraw: any,
    openDraw: any,
    viewCouponDetail: CouponResponse | null
}) => {

    const { openDraw, setOpenDraw, viewCouponDetail } = props;
    const [courseDetails, setCourseDetails] = useState<{ [key: number]: CourseDetailsResponse | null }>({});

    return (
        <Drawer title="THÔNG TIN CHI TIẾT" onClose={() => setOpenDraw(false)} open={openDraw} width={450}>
            {viewCouponDetail ? (
                <>

                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên coupon: </span>
                        {viewCouponDetail.couponName}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mã coupon: </span>
                        {viewCouponDetail.couponCode}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giá trị coupon: </span>

                        {viewCouponDetail.discountValue < 100
                            ? `${viewCouponDetail.discountValue} %`
                            : `${viewCouponDetail.discountValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ`}

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
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượng coupon: </span>
                        {viewCouponDetail.maxUses}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số coupon đã sử dụng: </span>
                        {viewCouponDetail.usedCount || 0}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Phạm vi áp dụng: </span>
                        {viewCouponDetail.discountRange === 'ALL' ? 'Tất cả' : 'Giới hạn'}
                    </div>

                    {viewCouponDetail?.discountRange !== 'ALL' ? (
                        <Collapse
                            items={[
                                {
                                    key: '1',
                                    label: 'Các khoá học được áp dụng',
                                    children: (
                                        <ul className='ml-0.5'>
                                            {viewCouponDetail.courseName.map((couponDetail, index) => (
                                                <li key={index} className="mb-2">
                                                    <div className="flex items-center gap-2 font-medium text-gray-700">
                                                        <DoubleRightOutlined style={{ color: 'green' }} />
                                                        <span>{couponDetail}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ),
                                },
                            ]}
                        />
                    ) : <div></div>}
                </>
            ) : (
                <div>Không có dữ liệu</div>
            )}
        </Drawer>
    );
};

export default ViewCouponDetail;
