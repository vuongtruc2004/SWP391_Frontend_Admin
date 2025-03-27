import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, Modal } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    description: string;
}
const UpdateChapterModal = ({ setChapters, selectedChapter, setSelectedChapter, open, setOpen, setIsSaved }: {
    setChapters: Dispatch<SetStateAction<ChapterResponse[]>>,
    selectedChapter: ChapterResponse | null,
    setSelectedChapter: Dispatch<SetStateAction<ChapterResponse | null>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setIsSaved: Dispatch<SetStateAction<boolean>>
}) => {
    if (!selectedChapter) return null;
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setChapters(prev => prev.map(chapter => chapter.chapterId === selectedChapter.chapterId ? {
            ...chapter,
            title: values.title,
            description: values.description
        } : chapter));
        setIsSaved(false);
        setOpen(false);
    };

    return (
        <Modal title={`Cập nhật chương học`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={() => {
                setSelectedChapter(null);
                setOpen(false);
            }} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        ]}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    title: selectedChapter.title,
                    description: selectedChapter.description
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

export default UpdateChapterModal