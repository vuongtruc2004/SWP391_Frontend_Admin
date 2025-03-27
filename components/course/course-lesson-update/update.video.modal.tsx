import { isValidYouTubeUrl } from "@/helper/create.course.helper";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Divider, Form, FormProps, Input, message, Modal, Upload, UploadProps } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
}
const UpdateVideoModal = ({ setChapters, selectedLesson, setSelectedLesson, open, setOpen, setIsSaved }: {
    setChapters: Dispatch<SetStateAction<ChapterResponse[]>>,
    selectedLesson: LessonResponse | null,
    setSelectedLesson: Dispatch<SetStateAction<LessonResponse | null>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setIsSaved: Dispatch<SetStateAction<boolean>>
}) => {
    if (!selectedLesson || selectedLesson.lessonType !== 'VIDEO') return null;
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
        <Modal title={`Cập nhật Video`} open={open} closable={false} footer={[
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
                    description: selectedLesson.description,
                    videoUrl: selectedLesson.videoUrl,
                    duration: selectedLesson.duration
                }}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng không để trống tiêu đề!' }, {
                        validator(rule, value, callback) {
                            if (value) {
                                const wordCount = value.trim().split(/\s+/).length;
                                if (wordCount > 20) {
                                    callback('Tiêu đề chỉ được tối đa 20 từ!');
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
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
                    rules={[{ required: true, message: 'Vui lòng không để trống đường dẫn video!' }, {
                        validator(rule, value, callback) {
                            if (value) {
                                if (isValidYouTubeUrl(value)) {
                                    callback();
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }]}
                >
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

                <Form.Item<FieldType>
                    label="Thời lượng video (giây)"
                    name="duration"
                    rules={[{ required: true, message: 'Vui lòng không để trống thời lượng video!' }]}
                >
                    <Input type="number" placeholder="Nhập thời lượng video" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateVideoModal