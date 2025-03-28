import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, Modal } from "antd"
import { Dispatch, SetStateAction, useState } from "react"
import DocumentEditor from "./document.editor";
import TurndownService from "turndown";
import { marked } from "marked";

interface FieldType {
    title: string;
}
const UpdateDocumentModal = ({ chapters, setChapters, open, setOpen, selectedLessonIndex, selectedChapterIndex, setSelectedChapterIndex, setSelectedLessonIndex }: {
    chapters: ChapterRequest[],
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    selectedLessonIndex: number | null,
    selectedChapterIndex: number | null,
    setSelectedLessonIndex: Dispatch<SetStateAction<number | null>>,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
}) => {
    const selectChapter = chapters.find((_, chapterIndex) => chapterIndex === selectedChapterIndex);
    if (!selectChapter) {
        return null;
    }
    const selectLesson = selectChapter.lessons.find((_, lessonIndex) => lessonIndex === selectedLessonIndex);
    if (!selectLesson || selectLesson.lessonType !== 'DOCUMENT') return null;

    const [form] = Form.useForm();
    const turndownService = new TurndownService();

    const [inputMarkdown, setInputMarkdown] = useState(turndownService.turndown(selectLesson.documentContent || ""));

    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const documentContent = await marked(stripHtml(inputMarkdown));
        setChapters(prev => prev.map((chapter, chapterIndex) => chapterIndex === selectedChapterIndex ? ({
            ...chapter,
            lessons: chapter.lessons.map((lesson, lessonIndex) => lessonIndex === selectedLessonIndex ? ({
                ...lesson,
                title: values.title,
                documentContent: documentContent
            }) : lesson)
        }) : chapter));
        handleCancel();
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedChapterIndex(null);
        setSelectedLessonIndex(null);
    }

    return (
        <Modal width={800} title={`Cập nhật tài liệu đọc thêm`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={handleCancel} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        ]}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{ title: selectLesson.title }}
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

                <DocumentEditor inputMarkdown={inputMarkdown} setInputMarkdown={setInputMarkdown} />
            </Form>
        </Modal>
    )
}

export default UpdateDocumentModal