'use client'

import { Avatar, Button, DatePicker, DatePickerProps, Form, Image, Input, Modal, notification, Select, Space } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { apiUrl, storageUrl } from "@/utils/url";
import { sendRequest } from "@/utils/fetch.api";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { validDob, validEmail, validFullName, validGender, validPassword, validRole } from "@/helper/create.user.helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const initState: ErrorResponse = {
    error: false,
    value: ''

}
const UserCreateBtn = (props: { handelOnExportExcel: any }) => {
    const { handelOnExportExcel } = props
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

    const [avatar, setAvatar] = useState<File | null>(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);
    const [urlAvatar, setUrlAvatar] = useState<ErrorResponse>(initState);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        // Kiểm tra dữ liệu hợp lệ
        const isEmailValid = validEmail(email, setEmail);
        const isFullNameValid = validFullName(fullName, setFullName);
        const isPasswordValid = validPassword(password, setPassword);
        const isGenderValid = validGender(gender, setGender);
        const isRoleValid = validRole(role, setRole);
        const isDobValid = validDob(dob, setDob);

        if (!isEmailValid || !isFullNameValid || !isPasswordValid || !isGenderValid || !isRoleValid || !isDobValid) {
            return;
        }

        // let avatarUrl = '';
        if (avatar) {
            const formData = new FormData();
            formData.append('file', avatar);
            formData.append('folder', 'avatar');

            const uploadResponse = await sendRequest<ApiResponse<{ avatar: string }>>({
                url: `${apiUrl}/users/avataradmin`,
                method: 'POST',
                headers: {},
                body: formData
            });
            console.log('>>> handleOk >>>', uploadResponse)
            if (uploadResponse.status === 200 && uploadResponse.data?.avatar) {
                setUrlAvatar({ ...urlAvatar, value: uploadResponse.data.avatar })
            } else {
                setErrorMessage(uploadResponse.message.toString());
                return;
            }
        }

        // Gửi request tạo người dùng
        const userRequest: UserRequest = {
            email: email.value,
            password: password.value,
            fullname: fullName.value,
            roleName: role.value,
            gender: gender.value,
            dob: dayjs(dob.value).format("YYYY-MM-DD"),
            avatar: urlAvatar.value
        };

        const createResponse = await sendRequest<ApiResponse<UserResponse>>({
            url: `${apiUrl}/users`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userRequest
        });
        console.log("check createResponse>>>", createResponse)
        if (createResponse.status === 201) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: createResponse.message.toString(),
            });
        } else {
            setEmail({
                ...email,
                message: createResponse.message.toString(),
                error: true
            })
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
        setUrlAvatar(initState);
        setIsModalOpen(false);
        setErrorMessage("");
        setAvatar(null);
    };

    const handleDateChange: DatePickerProps["onChange"] = (date) => {
        setDob({ ...dob, value: date ? dayjs(date).format("YYYY-MM-DD") : "", error: false });
    };

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setAvatar(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', 'avatar');

            const imageResponse = await sendRequest<ApiResponse<{ avatar: string }>>({
                url: `${apiUrl}/users/avataradmin`,
                method: 'POST',
                headers: {},
                body: formData
            });

            console.log('handleUploadFile >>>>', imageResponse)
            if (imageResponse.status === 200 && imageResponse.data?.avatar) {
                setUrlAvatar({ ...urlAvatar, value: imageResponse.data.avatar });
                setErrorMessage("")
            } else {
                setErrorMessage(imageResponse.message.toString());
            }
        }
    };

    const handleSyncClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };


    return (
        <>

            <div className="flex justify-between items-center mb-4 px-6">
                <div className="mr-auto">
                    <Button type="primary" onClick={showModal} className="w-fit ">
                        Tạo người dùng
                    </Button>
                </div>

                <div className="mr-2">
                    <Button
                        style={{ background: 'green', borderColor: "green" }}
                        type="primary"
                        onClick={() => handelOnExportExcel()}
                        className="w-fit hover:bg-green-100 hover:border-green-700">
                        Xuất Excel
                    </Button>
                </div>



            </div>
            <Modal title="Tạo người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Tạo" cancelText="Hủy">
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


                <span className="text-red-500 mr-2">*</span>Ảnh:
                <div>
                    {urlAvatar.value === '' ? (
                        <div className="relative w-fit">
                            <Avatar
                                shape="square"
                                size={120}
                                icon={<PlusOutlined />}
                                alt="avatar"
                            />
                            <input
                                type="file"
                                onChange={handleUploadFile}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ maxWidth: "120px", maxHeight: "120px" }}
                            />
                        </div>
                    ) : (
                        <>
                            <Image
                                width={120}
                                height={120}
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                }}
                                preview={{
                                    mask: <span><EyeOutlined />  Xem trước</span>,
                                    visible: isPreviewVisible,
                                    onVisibleChange: (visible) => setPreviewVisible(visible),
                                }}
                                src={`${storageUrl}/avatar/${urlAvatar.value}`}
                                alt="Xem trước"
                            />

                            <SyncOutlined className="text-lg ml-6" style={{ color: '#3366CC' }}
                                onClick={handleSyncClick} />

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUploadFile}
                                className="hidden"
                            />
                        </>

                    )}
                </div>

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
