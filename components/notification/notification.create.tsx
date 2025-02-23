import { validContent, validTitle } from "@/helper/create.blog.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { WarningOutlined } from "@ant-design/icons";
import { Form, Input, Modal, notification, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

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
    const [receiver, setReceiver] = useState<string[]>([]);
    const [userOption, setUserOption] = useState<{ value: string, label: string }[]>([])
    const router = useRouter()

    const handleOnChangeSelect = (value: boolean) => {
        setGlobal(value);
        console.log(value)
    }

    useEffect(() => {
        if (!openCreate) return;

        const getDataUser = async () => {
            const dataRes = await sendRequest<ApiResponse<UserResponse[]>>({
                url: `${apiUrl}/users/get-all`,
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            });

            console.log("Dữ liệu API nhận được:", dataRes);
            const users = Array.isArray(dataRes?.data) ? dataRes.data.map((user: UserResponse) => ({
                value: user.fullname,
                label: user.fullname,
            })) : [];

            setUserOption(users);
        };

        getDataUser();
    }, [openCreate]); // Chỉ gọi khi `openCreate` thay đổi

    const notificationRequest: NotificationRequest = {
        title: title.value,
        content: content.value,
        global: global,
        fullname: receiver
    }
    const handleOnOk = async () => {
        const isValidTitle = validTitle(title, setTitle);
        const isValidContent = validContent(content, setContent);

        if (!isValidTitle || !isValidContent) {
            return;
        }

        if (!global && receiver === null) {
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
                description: "Tạo bài viết mới thành công!",
            })
            router.refresh()
            setOpenCreate(false);
        } else {
            notification.error({
                message: "Thất bại!",
                description: "Tạo bài viết thất bại"
            })
        }
    }

    const handleOnCancel = () => {
        setContent(initState);
        setTitle(initState);
        setGlobal(true);
        setReceiver([]);
        setOpenCreate(false);
    }

    useEffect(() => {
        if (openCreate) {
            setTitle(initState);
            setContent(initState);
            setGlobal(true);
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
                                    console.log(event.target.value)
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
                                style={{ width: 120 }}
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
                                    value={receiver}
                                    mode="tags"  // Cho phép nhập danh sách
                                    style={{ width: "100%" }}
                                    placeholder="Nhập tên người nhận"
                                    onChange={(value) => setReceiver(value)} // Lưu danh sách vào state
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={userOption} // Sử dụng danh sách từ API
                                />
                                {receiver.length === 0 && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        Vui lòng thêm người nhận thông báo
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
