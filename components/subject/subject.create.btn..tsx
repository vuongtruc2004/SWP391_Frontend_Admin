'use client'

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select } from "antd";
import { useState } from "react";

interface IProps {
    subjectList: SubjectResponse[]
}
const SubjectCreateBtn = (props: IProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { subjectList } = props

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortField, setSortField] = useState<"subjectId" | "subjectName" | "totalCourses">("subjectId");

    // Hàm sắp xếp dữ liệu
    const sortData = (field: "subjectId" | "subjectName" | "totalCourses", order: "asc" | "desc") => {
        const sortedData = [...subjectList].sort((a, b) => {
            if (field === "subjectId" || field === "totalCourses") {
                return order === "asc" ? a[field] - b[field] : b[field] - a[field];
            } else {
                return order === "asc"
                    ? a[field].localeCompare(b[field])
                    : b[field].localeCompare(a[field]);
            }
        });

        setDataSubject(sortedData);
        setSortField(field);
        setSortOrder(order);
    };

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
            <div className="flex justify-between pr-6">
                <Button type="primary" onClick={showModal}
                    className="w-fit ml-[40px]"
                >
                    Tạo môn học
                </Button>

                <div className="flex items-center gap-4 mb-4">
                    <span>Lọc: </span>
                    <Select value={sortField} onChange={(value) => sortData(value, sortOrder)} className="w-40">
                        <Select.Option value="subjectId">ID</Select.Option>
                        <Select.Option value="subjectName">Tên môn học</Select.Option>
                        <Select.Option value="totalCourses">Số khóa học</Select.Option>
                    </Select>

                    <span>|</span>
                    <button
                        className="p-2 bg-transparent outline-none focus:outline-none"
                        onClick={() => sortData(sortField, sortOrder === "asc" ? "desc" : "asc")}
                    >
                        {sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    </button>
                </div>
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
