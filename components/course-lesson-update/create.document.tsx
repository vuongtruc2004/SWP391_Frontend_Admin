import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, Modal } from "antd"
import { Dispatch, SetStateAction, useState } from "react"
import DocumentEditor from "./document.editor";
import { marked } from "marked";
import { calculateReadingTime } from "@/helper/update.lesson.helper";

interface FieldType {
    title: string;
}
const CreateDocumentModal = ({ chapters, setChapters, open, setOpen, selectedChapterIndex, setSelectedChapterIndex }: {
    chapters: ChapterRequest[],
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    selectedChapterIndex: number | null,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
}) => {
    if (selectedChapterIndex === null) return null;
    const [form] = Form.useForm();

    const [errorMessage, setErrorMessage] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");

    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const documentContent = await marked(stripHtml(inputMarkdown));
        if (documentContent.trim() === "") {
            setErrorMessage("Vui lòng không để trống nội dung tài liệu!");
            return;
        }

        setChapters(prev => prev.map((chapter, chapterIndex) =>
            chapterIndex === selectedChapterIndex
                ? {
                    ...chapter,
                    lessons: [...chapter.lessons, {
                        title: values.title,
                        description: null,
                        lessonType: "DOCUMENT",
                        videoUrl: null,
                        documentContent: documentContent,
                        duration: calculateReadingTime(documentContent)
                    }]
                }
                : chapter
        ));
        handleCancel();
    };

    const handleCancel = () => {
        setOpen(false);
        setErrorMessage("");
        setSelectedChapterIndex(null);
    }

    return (
        <Modal width={800} title={`Thêm tài liệu`} open={open} closable={false} footer={[
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
                                    const currentChapter = chapters.find((_, index) => index === selectedChapterIndex);
                                    if (currentChapter && currentChapter.lessons.find(lesson => lesson.title.toLowerCase().trim() === value.toLowerCase().trim() && lesson.lessonType === 'DOCUMENT')) {
                                        return Promise.reject(new Error('Tiều đề đã tồn tại ở một tài liệu trong chương này!'));
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input placeholder="Nhập tiêu đề video" />
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