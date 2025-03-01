'use client';

import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Collapse, Drawer } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const ViewOrderDetail = (props: {
    setOpenDraw: any,
    openDraw: any,
    viewOrderDetail: OrderResponse | null
}) => {
    const { openDraw, setOpenDraw, viewOrderDetail } = props;
    const [activeOrder, setActiveOrder] = useState<number | null>(null);
    const [courseDetails, setCourseDetails] = useState<{ [key: number]: CourseDetailsResponse | null }>({});

    const handleToggle = (index: number, courseId: number) => {
        setActiveOrder(activeOrder === index ? null : index);
        fetchCourseDetails(courseId);
    };

    const fetchCourseDetails = async (courseId: number) => {
        if (courseDetails[courseId]) return;

        try {
            const resCourse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
                url: `${apiUrl}/courses/${courseId}`,
            });

            if (resCourse.status === 200) {
                setCourseDetails(prev => ({ ...prev, [courseId]: resCourse.data }));
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu khóa học:", error);
        }
    };

    return (
        <Drawer title="THÔNG TIN CHI TIẾT" onClose={() => setOpenDraw(false)} open={openDraw}>
            {viewOrderDetail ? (
                <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Trạng thái: </span>
                        <span>
                            {{
                                PENDING: 'Chưa thanh toán',
                                COMPLETED: 'Đã thanh toán',
                                EXPIRED: 'Đã hết hạn',
                                CANCELLED: 'Đã hủy'
                            }[viewOrderDetail.orderStatus] || 'Không xác định'}
                        </span>
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày tạo: </span>
                        {viewOrderDetail.createdAt ? dayjs(viewOrderDetail.createdAt).format("DD/MM/YYYY HH:mm:ss") : 'Không có dữ liệu'}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Họ và tên: </span>
                        {viewOrderDetail.user?.fullname || 'Không có dữ liệu'}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tổng số tiền: </span>
                        {viewOrderDetail.totalAmount.toLocaleString()}₫
                    </div>

                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: 'Xem chi tiết hóa đơn',
                                children: (
                                    <ul className='ml-0.5'>
                                        {viewOrderDetail.orderDetails.map((orderDetail, index) => (
                                            <li key={index} className="mb-2">
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer font-medium text-gray-700"
                                                    onClick={() => handleToggle(index, orderDetail.courseId)}>
                                                    <DoubleRightOutlined style={{ color: 'green' }} />
                                                    {`Hóa đơn ${index + 1}`}
                                                </div>

                                                {activeOrder === index && (
                                                    courseDetails[orderDetail.courseId] ? (
                                                        <ul className="ml-6 mt-2 list-disc">
                                                            <li><span className="font-medium text-blue-500">Số tiền:</span> {courseDetails[orderDetail.courseId]?.price}₫ </li>
                                                            <li><span className="font-medium text-blue-500">Khóa học:</span> {courseDetails[orderDetail.courseId]?.courseName}</li>
                                                            <li><span className="font-medium text-blue-500">Mô tả:</span> {courseDetails[orderDetail.courseId]?.description}</li>
                                                            <li><span className="font-medium text-blue-500">Giảng viên:</span> {courseDetails[orderDetail.courseId]?.expert?.user.fullname}</li>
                                                        </ul>
                                                    ) : (
                                                        <p>Đang tải...</p>
                                                    )
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ),
                            },
                        ]}
                    />
                </>
            ) : (
                <div>Không có dữ liệu</div>
            )}
        </Drawer>
    );
};

export default ViewOrderDetail;
