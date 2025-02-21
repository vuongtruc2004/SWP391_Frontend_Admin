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

    const handleToggle = (index: number) => {
        setActiveOrder(activeOrder === index ? null : index);
    };
    const onClose = () => {
        setOpenDraw(false);
    }

    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {viewOrderDetail ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Trạng thái: </span>{viewOrderDetail.orderStatus == 'PENDING' ? 'Chưa thanh toán' : 'Đã thanh toán'}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày tạo: </span>{viewOrderDetail.createdAt == null ? 'Không có dữ ;liệu' : dayjs(viewOrderDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày cập nhật: </span>{viewOrderDetail.updatedAt == null ? 'Không có dữ ;liệu' : dayjs(viewOrderDetail.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Họ và tên: </span>{viewOrderDetail.user.fullname == null ? 'Không có giữ liệu' : viewOrderDetail.user.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tổng số tiền: </span>{viewOrderDetail.orderDetails.reduce((total, detail) => total + detail.price, 0).toLocaleString()}₫</div>


                    <div className='mb-2'>
                        <span className='text-blue-500 text-base mr-2 font-bold'>
                            Số lượng hóa đơn:
                        </span>{viewOrderDetail.orderDetails.length}
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
                                                    onClick={() => handleToggle(index)}>
                                                    <DoubleRightOutlined style={{ color: 'green' }} />
                                                    {`Hóa đơn ${index + 1}`}
                                                </div>

                                                {activeOrder === index && (
                                                    <ul className="ml-6 mt-2 list-disc">
                                                        <li><span className="font-medium text-blue-500">Số tiền:</span> {orderDetail.price.toLocaleString()}₫ </li>
                                                        <li><span className="font-medium text-blue-500">Khóa học:</span> {orderDetail.course.courseName}</li>
                                                        <li><span className="font-medium text-blue-500">Mô tả:</span> {orderDetail.course.description}</li>
                                                        <li><span className="font-medium text-blue-500">Giảng viên:</span> {orderDetail.course.expert.user.fullname}</li>
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ),
                            },
                        ]}
                    />

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>
    )
}
export default ViewOrderDetail;