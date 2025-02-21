'use client'

import { Button, Modal } from "antd";
import { useState } from "react";

const OrderCreate = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOk = async () => {

    }
    return (
        <>
            <div className="ml-6">
                <Button type="primary" onClick={showModal} className="w-fit ">
                    Tạo hóa đơn
                </Button>
            </div>
            <Modal title="Tạo hóa đơn" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Tạo" cancelText="Hủy">

            </Modal >
        </>
    )
}

export default OrderCreate;