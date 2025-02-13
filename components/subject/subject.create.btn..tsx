'use client'

import { validDescription, validSubjectName } from "@/helper/create.subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Image, Input, Modal, notification, Row, Select } from "antd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const SubjectCreateBtn = (props: { subjectPageResponse: PageDetailsResponse<SubjectResponse[]> }) => {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [errThumbnail, setErrThumbnail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [subjectName, setSubjectName] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);

    const showModal = () => {
        setIsRotated(!isRotated); // Đảo ngược trạng thái xoay icon
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        // Kiểm tra tất cả các giá trị
        const isSubjectNameValid = validSubjectName(subjectName, setSubjectName);
        const isDescriptionValid = validDescription(description, setDescription);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isSubjectNameValid || !isDescriptionValid || urlThumbnail === "") {
            setErrThumbnail("Ảnh không được để rỗng!")
            if (urlThumbnail !== "") {
                setErrThumbnail("")
                return
            }
            return
        }


        const subjectRequest: SubjectRequest = {
            subjectName: subjectName.value,
            description: description.value,
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
            });
        } else {
            setErrorMessage(createResponse.message.toString());
            notification.error({
                message: "Thất bại",
                description: createResponse.message.toString(),
            });
        }
    };

    const handleCancel = () => {
        setSubjectName(initState);
        setDescription(initState);
        setUrlThumbnail("")
        setIsModalOpen(false);
        setErrThumbnail("")
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e);
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
                setErrThumbnail(imageResponse.errorMessage)
            }
        }
    }

    return (
        <>
            <div className="">
                <Button
                    type="primary"
                    onClick={showModal}
                    className="w-fit ml-[40px] !pt-5 !pb-5"
                    icon={
                        <PlusOutlined
                            className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                        />
                    }
                >
                    Tạo mới
                </Button>

            </div>

            <Modal
                title="Tạo công nghệ"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
                okText="Tạo">
                <Row gutter={24} className="mb-7">
                    <Col span={17} className="flex flex-col space-y-6 ">
                        <div>
                            <span className="text-red-500 mr-2">*</span>Tên công nghệ:
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
                                placeholder="Nhập mô tả công nghệ"
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
                        <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg" : ""}`}>
                            {urlThumbnail === "" ? (
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

                                    <SyncOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />

                                    <input
                                        type="file"
                                        id="chooseFile"
                                        onChange={handleUploadFile}
                                        className="hidden"
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



            </Modal >
        </>
    );
};

export default SubjectCreateBtn;
