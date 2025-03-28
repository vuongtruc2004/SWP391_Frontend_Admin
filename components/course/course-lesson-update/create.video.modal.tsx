import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Divider, Form, FormProps, Input, message, Modal, Upload, UploadProps } from "antd"
import TextArea from "antd/es/input/TextArea";
import { RcFile } from "antd/es/upload";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    description: string;
    videoUrl: string;
}
const CreateVideoModal = ({ setChapters, open, setOpen, selectedChapterIndex, setSelectedChapterIndex }: {
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    selectedChapterIndex: number | null,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
}) => {
    if (selectedChapterIndex === null) return null;
    const [form] = Form.useForm();

    const props: UploadProps = {
        accept: "video/*",
        beforeUpload: (file) => {
            const isVideo = file.type.startsWith("video/");
            if (!isVideo) {
                message.error(`${file.name} không phải là 1 video!`);
            }
            return isVideo || Upload.LIST_IGNORE;
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.set("file", file as RcFile);
            formData.set("folder", "lesson");

            const response = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/files/video`,
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                message.success("Tải video thành công!");
                onSuccess?.(response.data);
            } else {
                message.error("Tải video thất bại!");
                onError?.(new Error("Tải video thất bại"));
            }
        },
        onChange: (info) => {
            if (info.file.status === "done") {
                form.setFieldsValue({ videoUrl: info.file.response });
            }
        },
        onRemove: () => {
            form.setFieldsValue({ videoUrl: "" });
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setChapters(prev => prev.map((chapter, chapterIndex) =>
            chapterIndex === selectedChapterIndex
                ? {
                    ...chapter,
                    lessons: [...chapter.lessons, {
                        title: values.title,
                        description: values.description,
                        lessonType: "VIDEO",
                        videoUrl: values.videoUrl,
                        documentContent: null
                    }]
                }
                : chapter
        ));
        handleCancel();
    };


    const handleCancel = () => {
        setOpen(false);
        setSelectedChapterIndex(null);
    }

    return (
        <Modal title={`Thêm video`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={handleCancel} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Thêm</Button>
        ]}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Tiêu đề"
                    name="title"
                    rules={[
                        { required: true, message: 'Vui lòng không để trống tiêu đề!' },
                        {
                            validator(_, value) {
                                if (value) {
                                    const wordCount = value.trim().split(/\s+/).length;
                                    if (wordCount > 20) {
                                        return Promise.reject(new Error('Tiêu đề chỉ được tối đa 20 từ!'));
                                    }
                                }
                                return Promise.resolve();
                            }
                        }]}
                >
                    <Input placeholder="Nhập tiêu đề video" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả video" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Đường dẫn video"
                    name="videoUrl"
                    rules={[{ required: true, message: 'Vui lòng không để trống đường dẫn video!' }]}>
                    <Input placeholder="Nhập đường dẫn video" />
                </Form.Item>

                <Divider variant="dashed" style={{ borderColor: '#6c757d' }} dashed>
                    <div className="flex items-center gap-x-3 text-sm">
                        <p>Hoặc</p>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Tải video từ thiết bị</Button>
                        </Upload>
                    </div>
                </Divider>
            </Form>
        </Modal>
    )
}

export default CreateVideoModal