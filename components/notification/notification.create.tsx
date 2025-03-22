import { validContent, validDateSet, validTitle } from "@/helper/create.blog.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { WarningOutlined } from "@ant-design/icons";
import { DatePicker, DatePickerProps, Form, Input, Modal, notification, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import viVN from 'antd/es/date-picker/locale/vi_VN';
import { SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const NotificationCreate = (props: {
    openCreate: boolean,
    setOpenCreate: React.Dispatch<SetStateAction<boolean>>
}) => {
    const { openCreate, setOpenCreate } = props
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [content, setContent] = useState<ErrorResponse>(initState);
    const [global, setGlobal] = useState(true);
    const [status, setStatus] = useState("SENT");
    const [dateSet, setDateSet] = useState<ErrorResponse>(initState);
    const [receiver, setReceiver] = useState<{ error: boolean, tags: string[] }>({ error: false, tags: [] });
    const [userOption, setUserOption] = useState<{ value: string, label: string }[]>([])
    const router = useRouter();

    const handleOnChangeStatus = (value: string) => {
        setStatus(value);
    }

    const handleOnChangeSelect = (value: boolean) => {
        setGlobal(value);
    }

    const handleOnChangeSetDate: DatePickerProps['onChange'] = (date, dateString) => {
        if (date === null) {
            setDateSet({
                ...dateSet,
                value: ''
            })
            return
        }
        setDateSet({
            ...dateSet,
            value: date.toISOString(),
        })
    };

    useEffect(() => {
        if (!openCreate) return;

        const getDataUser = async () => {
            const dataRes = await sendRequest<ApiResponse<UserResponse[]>>({
                url: `${apiUrl}/users/get-all`,
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            });

            const users = Array.isArray(dataRes?.data) ? dataRes.data.map((user: UserResponse) => ({
                key: user.userId,
                value: user.email,
                label: user.email,
            })) : [];

            setUserOption(users);
        };

        getDataUser();
    }, [openCreate]); // Chỉ gọi khi `openCreate` thay đổi

    const notificationRequest: NotificationRequest = {
        title: title.value,
        content: content.value,
        status: status,
        global: global,
        emails: receiver?.tags,
        setDate: dateSet.value,

    }
    const handleOnOk = async () => {
        const isValidTitle = validTitle(title, setTitle);
        const isValidContent = validContent(content, setContent);
        const isDateSet = validDateSet(status, dateSet, setDateSet);

        if (!isValidTitle || !isValidContent) {
            return;
        }

        if (!global && receiver.tags.length === 0) {
            setReceiver(prev => ({ ...prev, error: true }))
            return;
        }

        if (!isDateSet) {
            return;
        }

        const sendNotification = await sendRequest<ApiResponse<String>>({
            url: `${apiUrl}/notifications/create`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: notificationRequest,
        });
        if (sendNotification.status === 201) {
            setTitle(initState);
            setContent(initState);
            notification.success({
                message: "Thành công!",
                description: "Tạo thông báo mới thành công!",
            })
            router.refresh()
            setOpenCreate(false);
        } else {
            notification.error({
                message: "Thất bại!",
                description: "Tạo thông báo thất bại"
            })
        }
    }

    const handleOnCancel = () => {
        setContent(initState);
        setTitle(initState);
        setGlobal(true);
        setReceiver({ error: false, tags: [] });
        setStatus("SENT");
        setOpenCreate(false);
    }

    useEffect(() => {
        if (openCreate) {
            setTitle(initState);
            setContent(initState);
            setGlobal(true);
            setReceiver({ error: false, tags: [] });
            setStatus("SENT");
        }
    }, [openCreate]);



    return (
        <>
            <Modal title="Tạo thông báo" open={openCreate} onOk={handleOnOk} onCancel={handleOnCancel}>
                <Form>
                    <div>
                        <p><span className='text-red-600'>*</span>Tiêu đề:</p>
                        <Form.Item>
                            <Input
                                value={title.value}
                                placeholder="Tiêu đề"
                                onChange={(event) => {
                                    setTitle({
                                        ...title,
                                        value: event.target.value
                                    })
                                }}
                            />
                            {title.error && title.value === '' && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    {title.message}
                                </p>
                            )}
                        </Form.Item>
                    </div>
                    <div>
                        <p><span className='text-red-600'>*</span>Nội dung:</p>
                        <Form.Item>
                            <TextArea
                                value={content.value}
                                onChange={(event) => {
                                    setContent({
                                        ...content,
                                        value: event.target.value
                                    });
                                }}
                                placeholder="Nội dung thông báo"
                                style={{ height: 120, resize: 'none' }}
                            />
                            {content.error && content.value === '' && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    {content.message}
                                </p>
                            )}
                        </Form.Item>
                    </div>
                    <div>
                        <p><span className='text-red-600'>*</span>Hình thức:</p>
                        <Form.Item>
                            <Select
                                value={global}
                                style={{ width: 470 }}
                                onChange={handleOnChangeSelect}
                                options={[
                                    { value: true, label: "Toàn bộ người dùng" },
                                    { value: false, label: "Giới hạn người nhận" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    {!global && (
                        <div>
                            <p><span className='text-red-600'>*</span>Người nhận:</p>
                            <Form.Item>
                                <Select
                                    value={receiver.tags}
                                    mode="tags"  // Cho phép nhập danh sách
                                    style={{ width: "100%" }}
                                    placeholder="Nhập tên người nhận"
                                    onChange={(value) => setReceiver({
                                        ...receiver,
                                        tags: value,
                                    })} // Lưu danh sách vào state
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={userOption} // Sử dụng danh sách từ API
                                />
                                {receiver.error === true && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        Vui lòng thêm người nhận thông báo
                                    </p>
                                )}
                            </Form.Item>
                        </div>
                    )}
                    <div>
                        <p><span className='text-red-600'>*</span>Trạng thái:</p>
                        <Form.Item>
                            <Select
                                value={status}
                                style={{ width: 470 }}
                                onChange={handleOnChangeStatus}
                                options={[
                                    { value: 'PENDING', label: "Đặt lịch" },
                                    { value: 'SENT', label: "Gửi ngay" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    {status === 'PENDING' && (
                        <div>
                            <p><span className='text-red-600'>*</span>Đặt lịch:</p>
                            <Form.Item>
                                <DatePicker
                                    // defaultValue={defaultValue}
                                    disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                                    disabledTime={(current) => {
                                        const now = dayjs();
                                        if (!current) return {};
                                        if (current.isSame(now, "day")) {
                                            return {
                                                disabledHours: () =>
                                                    Array.from({ length: now.hour() }, (_, i) => i),
                                                disabledMinutes: (hour) =>
                                                    hour === now.hour()
                                                        ? Array.from({ length: now.minute() }, (_, i) => i)
                                                        : [],
                                            };
                                        }
                                        return {};
                                    }}
                                    showTime
                                    onChange={handleOnChangeSetDate}
                                />
                                {dateSet.error && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        {dateSet.message}
                                    </p>
                                )}
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </Modal>
        </>
    )
}

export default NotificationCreate
