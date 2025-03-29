import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, message, Modal } from "antd"
import { Dispatch, SetStateAction, useState } from "react"
import DocumentEditor from "./document.editor";
import { marked } from "marked";
import { calculateReadingTime } from "@/helper/update.lesson.helper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";

interface FieldType {
    title: string;
}
const CreateDocumentModal = ({ open, setOpen, selectedChapter, setSelectedChapter }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    selectedChapter: ChapterResponse | null,
    setSelectedChapter: Dispatch<SetStateAction<ChapterResponse | null>>,
}) => {
    const { data: session, status } = useSession();
    const { refresh } = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");

    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        const documentContent = await marked(stripHtml(inputMarkdown));
        if (documentContent.trim() === "") {
            setErrorMessage("Vui lòng không để trống nội dung tài liệu!");
        } else {
            if (status === 'authenticated') {
                const request: LessonRequest = {
                    lessonId: null,
                    title: values.title,
                    description: null,
                    videoUrl: null,
                    lessonType: 'DOCUMENT',
                    duration: calculateReadingTime(documentContent),
                    documentContent: documentContent,
                    chapterId: selectedChapter?.chapterId || 0
                }
                const response = await sendRequest<ApiResponse<void>>({
                    url: `${apiUrl}/lessons`,
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: request
                });

                if (response.status === 201) {
                    message.success(response.message.toString());
                    refresh();
                    handleCancel();
                } else {
                    message.error(response.message.toString());
                }
            }
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
        setErrorMessage("");
        setSelectedChapter(null);
    }

    if (!selectedChapter) return null;

    return (
        <Modal width={800} title={`Thêm tài liệu`} open={open} closable={false} footer={[
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
                                    if (selectedChapter && selectedChapter.lessons.find(lesson => lesson.title.toLowerCase().trim() === value.toLowerCase().trim() && lesson.lessonType === 'DOCUMENT')) {
                                        return Promise.reject(new Error('Tiều đề đã tồn tại ở một tài liệu trong chương này!'));
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input placeholder="Nhập tiêu đề tài liệu" />
                </Form.Item>

                <DocumentEditor inputMarkdown={inputMarkdown} setInputMarkdown={setInputMarkdown} />
                {errorMessage !== "" && (
                    <p className="text-sm text-[#ff4d4f]">{errorMessage}</p>
                )}
            </Form>
        </Modal>
    )
}

export default CreateDocumentModal