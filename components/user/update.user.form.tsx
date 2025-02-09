'use client'
import { useEffect, useState } from 'react';
import { DatePicker, DatePickerProps, Input, Modal, notification, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import dayjs from 'dayjs';
import { validDob, validEmail, validFullName, validGender, validPassword, validRole } from '@/helper/create.user.helper';
import { WarningOutlined } from '@ant-design/icons';

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

    const [avatar, setAvatar] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleDateChange: DatePickerProps["onChange"] = (date) => {
        setDob({ ...dob, value: date ? dayjs(date).format("YYYY-MM-DD") : "", error: false });
    };

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
            // setAvatar(editingUser.avatar)
        }
    }, [editingUser]);

    const handleOk = async () => {
        // Kiểm tra tất cả các giá trị
        const isEmailValid = validEmail(email, setEmail);
        const isFullNameValid = validFullName(fullName, setFullName);
        const isGenderValid = validGender(gender, setGender);
        const isRoleValid = validRole(role, setRole);
        const isDobValid = validDob(dob, setDob);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isEmailValid || !isFullNameValid || !isGenderValid || !isRoleValid || !isDobValid) {
            return;
        }
        const userRequest: UserRequest = {
            userId: editingUser?.userId,
            email: email.value,
            fullname: fullName.value,
            roleName: role.value,
            gender: gender.value,
            dob: dayjs(dob.value).format("YYYY-MM-DD"),
        }
        const updateResponse = await sendRequest<ApiResponse<UserResponse>>({
            url: `${apiUrl}/users`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userRequest
        });

        console.log(updateResponse)
        if (updateResponse.status === 201) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: updateResponse.message.toString(),
            });
        } else {
            setErrorMessage(updateResponse.message.toString());
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setOpenEditForm(false);
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
        </Modal>
    );
};
export default UpdateUserForm;
