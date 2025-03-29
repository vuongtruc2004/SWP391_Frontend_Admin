import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, message, Modal } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, RefObject, SetStateAction, useState } from "react"

interface FieldType {
    title: string;
    description: string;
}
const CreateChapterModal = ({ chapters, open, setOpen, bottomRef, course }: {
    chapters: ChapterResponse[],
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    bottomRef: RefObject<HTMLDivElement | null>,
    course: CourseDetailsResponse
}) => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const { refresh } = useRouter();
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (status === 'authenticated') {
            setLoading(true);
            const request: ChapterRequest = {
                chapterId: null,
                title: values.title,
                description: values.description,
                courseId: course.courseId,
                lessons: [],
                quizInfo: null
            }
            const response = await sendRequest<ApiResponse<void>>({
                url: `${apiUrl}/chapters`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: request
            });

            setLoading(false);
            if (response.status === 201) {
                message.success(response.message.toString());
                refresh();
                handleCancel();
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            } else {
                message.error(response.message.toString());
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    }

    return (
        <Modal title={`Thêm chương học`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={handleCancel} key="cancel" disabled={loading}>Hủy</Button>,
            <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>Thêm</Button>
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
                                    if (chapters.find(chapter => chapter.title.toLowerCase().trim() === value.toLowerCase().trim())) {
                                        return Promise.reject(new Error('Tiều đề chuơng học đã tồn tại!'));
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input placeholder="Nhập tiêu đề chương học" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả chương học" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateChapterModal