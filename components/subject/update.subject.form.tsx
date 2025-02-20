'use client'
import { ChangeEvent, useActionState, useEffect, useRef, useState } from 'react';
import { Button, Image, Input, Modal, notification } from 'antd';
import { EyeOutlined, SyncOutlined, WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl, storageUrl } from '@/utils/url';
import { validDescription, validSubjectName } from '@/helper/create.subject.helper';

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateSubjectForm = (props: {
    editingSubject: SubjectResponse | null;
    setEditingSubject: React.Dispatch<React.SetStateAction<SubjectResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { editingSubject, setEditingSubject, openEditForm, setOpenEditForm } = props;
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [subjectName, setSubjectName] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const [errThumbnail, setErrThumbnail] = useState("")
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (editingSubject) {
            setSubjectName({
                error: false,
                value: editingSubject.subjectName
            });
            setDescription({
                error: false,
                value: editingSubject.description
            });
        }
        if (editingSubject?.thumbnail) {
            setUrlThumbnail(editingSubject.thumbnail);
        }
    }, [editingSubject]);

    const handleOk = async () => {
        setLoading(true);
        // Kiểm tra tất cả các giá trị
        const isSubjectNameValid = validSubjectName(subjectName, setSubjectName);
        const isDescriptionValid = validDescription(description, setDescription);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isSubjectNameValid || !isDescriptionValid) {
            setLoading(false)
            return;
        }
        const subjectRequest: SubjectRequest = {
            subjectName: subjectName.value,
            description: description.value,
            thumbnail: urlThumbnail,
        }
        const updateResponse = await sendRequest<ApiResponse<SubjectResponse>>({
            url: `${apiUrl}/subjects/update/${editingSubject?.subjectId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: subjectRequest
        });

        if (updateResponse.status === 200) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: updateResponse.message.toString(),
            });
        } else {
            notification.error({
                message: "Thất bại",
                description: "Thay đổi thông tin thất bại!",
            });
        }
        setLoading(false)
    };

    const handleSyncClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleCancel = () => {
        setUrlThumbnail("");
        setEditingSubject(null);
        setOpenEditForm(false);
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
        <Modal title="Cập nhật công nghệ"
            open={openEditForm}
            footer={null}
            onCancel={handleCancel}
        >
            <div className="mb-3">
                <span className="text-red-500 mr-2">*</span>Tên công nghệ:
                <Input
                    placeholder="Nhập tên công nghệ"
                    status={subjectName.error ? 'error' : ''}
                    allowClear
                    value={subjectName.value}
                    onChange={(e) => {
                        setSubjectName({
                            ...subjectName,
                            value: e.target.value,
                            error: false
                        })
                    }}
                    className="mt-1"
                    name="subjectName"
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
                    placeholder="Nhập mô tả"
                    status={description.error ? 'error' : ''}
                    allowClear
                    value={description.value}
                    onChange={(e) => {
                        setDescription({
                            ...description,
                            value: e.target.value,
                            error: false
                        })
                    }}
                    className="mt-1"
                    name="description"
                />
                {description.error && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {description.message}
                    </p>
                )}
            </div>
            <span className="text-red-500 mr-2">*</span>Ảnh:
            <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg" : ""}`}>
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
                            src={
                                urlThumbnail === ""
                                    ? `${storageUrl}/subject/${editingSubject?.thumbnail}`
                                    : `${storageUrl}/subject/${urlThumbnail}`
                            }

                            alt="Xem trước"
                        />
                    </div>
                    <SyncOutlined style={{ color: '#4096ff' }} className=" text-lg ml-6"
                        onClick={handleSyncClick}
                    />

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        className="hidden"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-5">
                <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                <Button loading={loading} type="primary" onClick={() => handleOk()}>Cập nhật</Button>
            </div>
        </Modal>
    )
}

export default UpdateSubjectForm