'use client'

import { validDescription, validSubjectName } from "@/helper/create.subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Image, Input, Modal, notification, Row, Select, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const SubjectCreateBtn = (props: { handelOnExportExcel: any }) => {
    const { handelOnExportExcel } = props;
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [errThumbnail, setErrThumbnail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [loading, setLoading] = useState(false);
    const [subjectName, setSubjectName] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: session, status } = useSession();

    const showModal = () => {
        setIsRotated(!isRotated); // Đảo ngược trạng thái xoay icon
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setLoading(true);

        setTimeout(async () => {

            // Kiểm tra tất cả các giá trị
            const isSubjectNameValid = validSubjectName(subjectName, setSubjectName);
            const isDescriptionValid = validDescription(description, setDescription);

            // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
            if (!isSubjectNameValid || !isDescriptionValid || urlThumbnail === "") {
                setErrThumbnail("Ảnh không được để rỗng!")
                if (urlThumbnail !== "") {
                    setErrThumbnail("")
                    setLoading(false);
                    return
                }
                setLoading(false);
                return
            }

            const subjectRequest: SubjectRequest = {
                subjectName: subjectName.value.trim(),
                description: description.value.trim(),
                thumbnail: urlThumbnail,
            }
            const createResponse = await sendRequest<ApiResponse<SubjectResponse>>({
                url: `${apiUrl}/subjects`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: subjectRequest
            });

            if (createResponse.status === 201) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: createResponse.message.toString(),
                    showProgress: true
                });
            } else {
                setErrorMessage(createResponse.message.toString());
                notification.error({
                    message: "Thất bại",
                    description: createResponse.message.toString(),
                    showProgress: true
                });
            }
            setLoading(false);
        }, 500);

    };

    const handleSyncClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleCancel = () => {
        setSubjectName(initState);
        setDescription(initState);
        setUrlThumbnail("")
        setIsModalOpen(false);
        setErrThumbnail("")
    };

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'subject');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/subjects/thumbnail`,
                method: 'POST',
                headers: {},
                body: formData
            });

            if (imageResponse.status === 200) {
                setUrlThumbnail(imageResponse.data)

            } else {
                setErrThumbnail(imageResponse.message.toString())
            }
        }
    }

    return (
        <><div className="flex justify-between items-center mb-4 px-6">
            <div className="">
                {session?.user.roleName === 'EXPERT' &&
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="w-fit !pt-5 !pb-5"
                        icon={
                            <PlusOutlined
                                className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                            />
                        }
                    >
                        Tạo mới
                    </Button>
                }

            </div>
            <div className="flex gap-2 mr-2">

                <Button
                    style={{ background: 'green', borderColor: "green" }}
                    type="primary"
                    onClick={() => handelOnExportExcel()}
                    className="w-fit hover:bg-green-100 hover:border-green-700 !pt-5 !pb-5">
                    Xuất Excel
                </Button>

            </div>

        </div>
            <Modal
                title="Tạo lĩnh vực"
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
            >
                <Spin spinning={loading}>
                    <Row gutter={24} className="mb-7">
                        <Col span={17} className="flex flex-col space-y-6 ">
                            <div>
                                <span className="text-red-500 mr-2">*</span>Tên lĩnh vực:
                                <Input
                                    status={subjectName.error ? 'error' : ''}
                                    className="mt-1"
                                    placeholder="Nhập tên môn học"
                                    allowClear
                                    value={subjectName.value}
                                    onChange={(e) => {
                                        setSubjectName({
                                            ...subjectName,
                                            value: e.target.value,
                                            error: false
                                        })

                                    }}

                                />
                                {subjectName.error && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        {subjectName.message}
                                    </p>
                                )}

                            </div>
                            <div className="mb-3">
                                <span className="text-red-500 mr-2">*</span>Mô tả:
                                <Input
                                    status={description.error ? 'error' : ''}
                                    className="mt-1"
                                    placeholder="Nhập mô tả lĩnh vực"
                                    allowClear
                                    value={description.value}
                                    onChange={(e) => {
                                        setDescription({
                                            ...description,
                                            value: e.target.value,
                                            error: false
                                        })

                                    }}
                                />
                                {description.error && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        {description.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        <Col span={7}>
                            <span className="text-red-500 mr-2">*</span>Ảnh:
                            <div>
                                {urlThumbnail === "" ? (
                                    <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg " : "relative w-fit"}`}>
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
                                            title="Chưa chọn file"
                                        />
                                    </div>

                                ) : (
                                    <div className="flex items-end">
                                        <div className="h-[120px] w-[120px]">
                                            <Image
                                                className="h-full w-full object-contain"
                                                width="100%"
                                                height="100%"
                                                preview={{
                                                    visible: isPreviewVisible,
                                                    mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                                    onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                                }}
                                                src={`${storageUrl}/subject/${urlThumbnail}`}
                                                alt="Preview"
                                            />
                                        </div>

                                        <SyncOutlined style={{ color: '#4096ff' }} className="text-lg ml-6"
                                            onClick={handleSyncClick}
                                        />

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleUploadFile}
                                            className="hidden"
                                            title="Chưa chọn file"
                                        />
                                    </div>

                                )}
                            </div>
                            {errThumbnail !== "" && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    {errThumbnail}
                                </p>
                            )}
                        </Col>
                    </Row>

                    <div className="flex justify-end mt-5">
                        <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                        <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
                    </div>
                </Spin>

            </Modal >
        </>
    );
};

export default SubjectCreateBtn;
