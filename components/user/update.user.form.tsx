'use client'
import { useEffect, useRef, useState } from 'react';
import { Avatar, DatePicker, DatePickerProps, Image, Input, Modal, notification, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl, storageUrl } from '@/utils/url';
import dayjs from 'dayjs';
import { validDob, validDobUpdate, validEmail, validFullName, validGender, validPassword, validRole } from '@/helper/create.user.helper';
import { PlusOutlined, SyncOutlined, WarningOutlined } from '@ant-design/icons';

interface IProps {
    editingUser: UserResponse | null;
    setEditingUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}
const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateUserForm = (props: IProps) => {
    const { editingUser, setEditingUser, openEditForm, setOpenEditForm } = props;

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

    const [urlAvatar, setUrlAvatar] = useState<ErrorResponse>(initState);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleDateChange: DatePickerProps["onChange"] = (date) => {
        setDob({ ...dob, value: date ? dayjs(date).format("YYYY-MM-DD") : "", error: false });
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingUser) {
            setEmail({
                error: false,
                value: editingUser.email
            });
            setFullName({
                error: false,
                value: editingUser.fullname
            });
            setRole({
                error: false,
                value: editingUser.roleName
            });
            setGender({
                error: false,
                value: editingUser.gender
            });
            setDob({
                error: false,
                value: editingUser.dob
            });
            setUrlAvatar({
                error: false,
                value: editingUser.avatar ? editingUser.avatar : ''
            })
            // setAvatar(editingUser.avatar)
        }
    }, [editingUser]);

    const handleOk = async () => {
        // Kiểm tra tất cả các giá trị
        const isEmailValid = validEmail(email, setEmail);
        const isFullNameValid = validFullName(fullName, setFullName);
        const isGenderValid = validGender(gender, setGender);
        const isRoleValid = validRole(role, setRole);
        const isDobValid = validDobUpdate(dob, setDob);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isEmailValid || !isFullNameValid || !isGenderValid || !isRoleValid || !isDobValid) {
            return;
        }

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
                setUrlAvatar({ ...urlAvatar, value: uploadResponse.data.avatar }) // Lấy avatar từ API response
            }
            // else {
            //     setErrorMessage(uploadResponse.message.toString());
            //     return;
            // }
        }
        const userRequest: UserRequest = {
            userId: editingUser?.userId,
            email: email.value,
            fullname: fullName.value,
            roleName: role.value,
            gender: gender.value,
            dob: dob.value ? dayjs(dob.value).format("YYYY-MM-DD") : editingUser?.dob || '',
            avatar: urlAvatar.value
        }
        const updateResponse = await sendRequest<ApiResponse<UserResponse>>({
            url: `${apiUrl}/users`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userRequest
        });

        console.log('>>>> check updateResponse', updateResponse)
        if (updateResponse.status === 201) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: updateResponse.message.toString(),
            });
        } else {
            console.log("loi cmnr")
            setErrorMessage(updateResponse.message.toString());
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setOpenEditForm(false);
        setErrorMessage('');
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
            // console.log("imageRes>>>>>.", imageResponse);
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
        <Modal title="Cập nhật người dùng" open={openEditForm} onOk={handleOk} onCancel={handleCancel} okText="Cập nhật">
            <div className="mb-3">
                <span className="text-red-500 mr-2">*</span>Email:
                <Input
                    disabled
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
                            style={{ maxWidth: "120px", maxHeight: "120px" }} // Giới hạn kích thước input file
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
                                visible: isPreviewVisible,
                                onVisibleChange: (visible) => setPreviewVisible(visible),
                            }}
                            src={`${storageUrl}/avatar/${urlAvatar.value}`}
                            alt="Preview"
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
        </Modal>
    );
};
export default UpdateUserForm;
