'use client'

import { Button, DatePicker, DatePickerProps, Input, Modal, notification, Select, Space } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { apiUrl, storageUrl } from "@/utils/url";
import { sendRequest } from "@/utils/fetch.api";
import { WarningOutlined } from "@ant-design/icons";
import { validDob, validEmail, validFullName, validGender, validPassword, validRole } from "@/helper/create.user.helper";
import { useRouter } from "next/navigation";

const initState: ErrorResponse = {
    error: false,
    value: ''

}
const UserCreateBtn = () => {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [email, setEmail] = useState<ErrorResponse>(initState);
    const [fullName, setFullName] = useState<ErrorResponse>(initState);
    const [role, setRole] = useState<ErrorResponse>({
        ...initState,
        value: 'MARKETING'
    });
    const [gender, setGender] = useState<ErrorResponse>({
        ...initState,
        value: 'MALE'
    });
    const [dob, setDob] = useState<ErrorResponse>(initState);
    const [password, setPassword] = useState<ErrorResponse>(initState);

    const [avatar, setAvatar] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        // Kiểm tra tất cả các giá trị
        const isEmailValid = validEmail(email, setEmail);
        const isFullNameValid = validFullName(fullName, setFullName);
        const isPasswordValid = validPassword(password, setPassword);
        const isGenderValid = validGender(gender, setGender);
        const isRoleValid = validRole(role, setRole);
        const isDobValid = validDob(dob, setDob);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isEmailValid || !isFullNameValid || !isPasswordValid || !isGenderValid || !isRoleValid || !isDobValid) {
            return;
        }
        const userRequest: UserRequest = {
            email: email.value,
            password: password.value,
            fullname: fullName.value,
            roleName: role.value,
            gender: gender.value,
            dob: dayjs(dob.value).format("YYYY-MM-DD"),
        }
        const createResponse = await sendRequest<ApiResponse<UserResponse>>({
            url: `${apiUrl}/users`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userRequest
        });

        if (createResponse.status === 201) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: createResponse.message.toString(),
            });
        } else {
            setErrorMessage(createResponse.message.toString());
        }
    };

    const handleCancel = () => {

        setEmail(initState);
        setPassword(initState);
        setFullName(initState)
        setRole({
            ...initState,
            value: 'MARKETING'
        });
        setGender({
            ...initState,
            value: 'MALE'
        });
        setDob(initState);
        setAvatar(null);
        setIsModalOpen(false);
    };

    const handleDateChange: DatePickerProps["onChange"] = (date) => {
        setDob({ ...dob, value: date ? dayjs(date).format("YYYY-MM-DD") : "", error: false });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const file = e.target.files?.[0]; // Lấy file đầu tiên từ input
        // if (!file) {
        //     console.log("Không có file nào được chọn!");
        //     return;
        // }

        // const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
        // setAvatar(imageUrl); // Lưu URL vào state

        // // Đảm bảo in ra đúng URL sau khi state cập nhật
        // console.log(">>> imageUrl", imageUrl);
    };



    return (
        <>
            <div>
                <Button type="primary" onClick={showModal} className="w-fit ml-[40px]">
                    Tạo người dùng
                </Button>
            </div>

            <Modal title="Tạo người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Tạo">
                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Email:
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
                {/* <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Ảnh:
                    <label className="block w-20 h-20 bg-gray-200 text-gray-700 border border-gray-400 
                        flex items-center justify-center cursor-pointer rounded-md 
                        hover:bg-gray-300 transition">
                        Chọn ảnh
                        <input type="file" hidden onChange={handleFileChange} />
                    </label>
                    <Image src={avatar?.startsWith("http") ? avatar : `${storageUrl}/avatar/${avatar}`} alt="avatar" width={200} height={200} />
                </div> */}
                {errorMessage !== "" && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {errorMessage}
                    </p>
                )}
            </Modal >
        </>
    );
};

export default UserCreateBtn;
