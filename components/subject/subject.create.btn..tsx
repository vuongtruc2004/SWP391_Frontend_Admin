'use client'

import { Button, Input, Modal, Select } from "antd";
import { useState } from "react";


const SubjectCreateBtn = (props: { subjectPageResponse: PageDetailsResponse<SubjectResponse[]> }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e);
    };

    return (
        <>
            <div className="">
                <Button type="primary" onClick={showModal}
                    className="w-fit ml-[40px]"
                >
                    Tạo môn học
                </Button>
            </div>

            <Modal title="Tạo môn học" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Tạo">
                <p className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Tên môn  học:
                    <Input placeholder="Nhập tên môn học" allowClear onChange={onChange} className="mt-1" />

                </p>
                <p className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Mô tả:
                    <Input placeholder="Nhập mô tả môn học" allowClear onChange={onChange} className="mt-1" />

                </p>

                <p className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Ảnh:
                    <label className="block w-20 h-20 bg-gray-200 text-gray-700 border border-gray-400 
                      flex items-center justify-center cursor-pointer rounded-md 
                      hover:bg-gray-300 transition">
                        Chọn ảnh
                        <input type="file" hidden className="hidden" />
                    </label>
                </p>

            </Modal>
        </>
    );
};

export default SubjectCreateBtn;
