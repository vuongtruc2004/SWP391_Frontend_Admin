'use client'

import { decryptWithAES } from "@/utils/aes.decryption";
import { Button, Input, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { List } from 'antd';
import { apiUrl, storageUrl } from "@/utils/url";
import Image from "next/image";
import { toCanvas } from 'html-to-image';
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/fetch.api";

const OrderCreate = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState("");
    const [orders, setOrders] = useState<OrderRequest | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const handleOk = async () => {
        if (orders) {
            const createOrderRequest: CreateOrderRequest = {
                userId: orders.userId,
                courseOrders: orders.courses.map(course => ({
                    courseId: course.courseId,
                    price: course.price
                }))
            }
            const orderResponse = await sendRequest<ApiResponse<OrderResponse>>({
                url: `${apiUrl}/orders`,
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: createOrderRequest
            });

            console.log(orderResponse);
            if (orderResponse.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: orderResponse.message.toString(),
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: orderResponse.message.toString(),
                });
            }
        }
    }

    useEffect(() => {
        if (value.length) {
            const orderRequest = decryptWithAES(value);
            if (orderRequest) {
                setOrders(orderRequest);
            } else {
                setOrders(null);
            }
        } else {
            setOrders(null);
        }
    }, [value]);

    const handleCapture = async () => {
        if (!ref.current) return;
        try {
            const canvas = await toCanvas(ref.current);
            const dataUrl = canvas.toDataURL("image/png");

            const res = await fetch(dataUrl);
            const blob = await res.blob();

            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);

            messageApi.open({
                type: 'success',
                content: "Ảnh đã được sao chép vào clipboard!",
            });

        } catch (error) {
            console.error("Lỗi khi chụp ảnh:", error);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="ml-6">
                <Button type="primary" onClick={() => setIsModalOpen(true)} className="w-fit ">
                    Tạo hóa đơn
                </Button>
            </div>

            <Modal title="Tạo hóa đơn" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Tạo" cancelText="Hủy">
                <Input placeholder="Nhập mã mua khóa học" onChange={(e) => setValue(e.target.value)} value={value} allowClear />

                <div className="mt-5 bg-white p-5 pb-10" ref={ref}>
                    {orders && (
                        <>
                            <h1 className="text-center text-xl font-semibold mb-1">Hóa đơn</h1>
                            <p><span className="font-semibold">Khách hàng:</span> {orders?.gender === 'MALE' ? "Anh " : "Chị "}{orders?.fullname}</p>
                            <p><span className="font-semibold">Ngày tạo: </span>{dayjs().format("DD-MM-YYYY")}</p>
                        </>
                    )}
                    <List
                        itemLayout="horizontal"
                        dataSource={orders?.courses}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Image width={100} height={60} alt="thumbnail" src={`${storageUrl}/course/${item.thumbnail}`} priority={true} className="rounded-sm" />}
                                    title={<div className="flex items-center justify-between">
                                        <p>{item.courseName}</p>
                                        <p>{item.price.toLocaleString('vi-VN')}₫</p>
                                    </div>}
                                    description={<p>{item.expertName}</p>}
                                />
                            </List.Item>
                        )}
                    />
                    {orders && (
                        <p className="flex items-center justify-between text-lg font-semibold">
                            <span>Tổng:</span>
                            <span>{orders.courses.reduce((sum, course) => sum + course.price, 0).toLocaleString('vi-VN')}₫</span>
                        </p>
                    )}
                </div>

                {orders && (
                    <Button type="primary" onClick={handleCapture} icon={<CopyOutlined />}>
                        Sao chép hóa đơn
                    </Button>
                )}
            </Modal>
        </>
    )
}

export default OrderCreate;
