'use client'

import { EyeOutlined } from "@ant-design/icons";
import { Button, Image, Modal, TreeSelect } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
const QuizCreateBtn = (props: {
    // allQuiz: QuizResponse[]
}) => {
    // const { allQuiz } = props;
    const [sheetData, setSheetData] = useState<QuizResponse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { SHOW_PARENT } = TreeSelect;
    const [value, setValue] = useState(['0-0-0']);
    const treeData = [
        {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
        }];


    const onChange = (newValue: string[]) => {
        console.log('onChange ', newValue);
        setValue(newValue);
    };
    const showModal = () => {
        setIsModalOpen(true);
    }
    const tProps = {
        treeData,
        value,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
            width: '100%',
        },
    };

    const handleOk = async () => {

    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // useEffect(() => {
    //     setSheetData([...allQuiz]);
    // }, [allQuiz])
    // const handelOnExportExcel = () => {
    //     if (sheetData.length > 0) {
    //         const data = sheetData.map((d, index) => {
    //             return {
    //                 STT: index + 1,
    //                 "Tiêu đề": d.title,
    //                 "Trạng thái": d.published ? 'Đang mở' : 'Bị đóng',
    //                 "Bắt đầu": dayjs(d.startedAt).format("DD/MM/YYYY HH:mm:ss"),
    //                 "kết thúc": dayjs(d.endedAt).format("DD/MM/YYYY HH:mm:ss"),

    //             }
    //         })
    //         var wb = XLSX.utils.book_new(),
    //             ws = XLSX.utils.json_to_sheet(data);
    //         XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    //         XLSX.writeFile(wb, "UserExcel.xlsx");
    //     }
    // }
    return (
        <>

            <div className="ml-6">
                <Button type="primary" onClick={showModal} className="w-fit ">
                    Tạo bài kiểm tra
                </Button>
            </div>
            {/* <div>
                <Button
                    style={{ background: 'green', borderColor: "green" }}
                    type="primary"
                    onClick={() => handelOnExportExcel()}
                    className="w-fit hover:bg-green-100 hover:border-green-700">
                    Xuất Excel
                </Button>
            </div> */}

            <Modal title="Tạo bài kiểm tra" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Tạo" cancelText="Hủy">
                <span className="text-red-500 mr-2">*</span>Lựa chọn câu hỏi:
                <TreeSelect {...tProps} />;
                {/* <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Lựa chọn câu hỏi:
                    <Input
                        status={email.error ? 'error' : ''}
                        placeholder="Nhập email"
                        allowClear
                        value={email.value}
                        onChange={(e) => {
                            setEmail({
                                ...email,
                                value: e.target.value,
                                error: false
                            })

                        }}
                        className="mt-1" />
                    {email.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {email.message}
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Mật khẩu:
                    <Input
                        status={password.error ? 'error' : ''}
                        placeholder="Nhập mật khẩu"
                        allowClear
                        value={password.value}
                        onChange={(e) => {
                            setPassword({
                                ...password,
                                value: e.target.value,
                                error: false
                            })
                        }}
                        className="mt-1" />
                    {password.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {password.message}
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Họ và tên:
                    <Input
                        status={fullName.error ? 'error' : ''}
                        placeholder="Nhập họ và tên "
                        allowClear
                        value={fullName.value}
                        onChange={(e) => setFullName({
                            ...fullName,
                            value: e.target.value,
                            error: false
                        })}
                        className="mt-1" />
                    {fullName.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {fullName.message}
                        </p>
                    )}
                </div>


                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Giới tính:
                    <Select
                        status={gender.error ? 'error' : ''}
                        style={{
                            width: '100%',
                            marginTop: '5px'
                        }}
                        showSearch
                        placeholder="Lựa chọn giới tính"
                        value={gender.value}
                        onChange={(value) => setGender({
                            ...gender,
                            value,
                            error: false
                        })}
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            { value: 'MALE', label: 'Nam' },
                            { value: 'FEMALE', label: 'Nữ' },
                        ]}
                    />
                    {gender.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {gender.message}
                        </p>
                    )}
                </div>


                <div className="mb-3">
                    <span className="text-red-500 mr-2 ">*</span>Vai trò:
                    <Select
                        status={role.error ? 'error' : ''}
                        style={{
                            width: '100%',
                            marginTop: '5px'
                        }}
                        showSearch
                        placeholder="Lựa chọn vai trò"
                        value={role.value} // Gán giá trị từ state
                        onChange={(value) => setRole({
                            ...role,
                            value,
                            error: false
                        })}
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            { value: 'ADMIN', label: 'ADMIN' },
                            { value: 'EXPERT', label: 'EXPERT' },
                            { value: 'MARKETING', label: 'MARKETING' },
                        ]}
                    />
                    {role.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {role.message}
                        </p>
                    )}
                </div>
                <div className=" mb-3">
                    <span className="text-red-500 mr-2 ">*</span>Ngày sinh:
                    <Space direction="vertical" className="ml-3">
                        <DatePicker
                            status={dob.error ? 'error' : ''}
                            value={dob.value ? dayjs(dob.value) : null}
                            onChange={handleDateChange}
                            picker="date" />
                    </Space>
                    {dob.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {dob.message}
                        </p>
                    )}
                </div>




                {errorMessage !== "" && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {errorMessage}
                    </p>
                )} */}
            </Modal >
        </>
    )
}
export default QuizCreateBtn;