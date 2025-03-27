import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, message, Modal, Upload, UploadProps } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    documentContent: string;
}
const UpdateDocumentModal = ({ setChapters, selectedLesson, setSelectedLesson, open, setOpen, setIsSaved }: {
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    selectedLesson: LessonRequest | null,
    setSelectedLesson: Dispatch<SetStateAction<LessonRequest | null>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setIsSaved: Dispatch<SetStateAction<boolean>>
}) => {
    if (!selectedLesson || selectedLesson.lessonType !== 'DOCUMENT') return null;
    const [form] = Form.useForm();

    const props: UploadProps = {
        accept: 'video/*',
        beforeUpload: (file) => {
            const isVideo = file.type.startsWith('video/');

            if (!isVideo) {
                message.error(`${file.name} không phải là 1 video!`);
            }

            return isVideo || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            console.log(info.fileList);
        },
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

    };

    return (
        <Modal title={`Cập nhật tài liệu đọc thêm`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={() => {
                setSelectedLesson(null);
                setOpen(false);
            }} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        ]}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    title: selectedLesson.title,
                    documentContent: selectedLesson.documentContent,
                }}
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
                        }
                    ]}
                >
                    <Input placeholder="Nhập tiêu đề video" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Nội dung tài liệu"
                    name="documentContent"
                    rules={[{ required: true, message: 'Vui lòng không để trống nội dung tài liệu!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập nội dung tài liệu" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateDocumentModal