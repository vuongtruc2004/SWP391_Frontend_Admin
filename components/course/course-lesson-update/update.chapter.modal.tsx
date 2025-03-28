import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, Modal } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    description: string;
}
const UpdateChapterModal = ({ chapters, setChapters, selectedChapterIndex, setSelectedChapterIndex, open, setOpen }: {
    chapters: ChapterRequest[],
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    selectedChapterIndex: number | null,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}) => {
    if (selectedChapterIndex === null) return null;
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setChapters(prev => prev.map((chapter, index) => index === selectedChapterIndex ? {
            ...chapter,
            title: values.title,
            description: values.description
        } : chapter));
        setOpen(false);
        setSelectedChapterIndex(null);
    };

    return (
        <Modal title={`Cập nhật chương học`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={() => {
                setOpen(false);
                setSelectedChapterIndex(null);
            }} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        ]}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    title: chapters[selectedChapterIndex].title,
                    description: chapters[selectedChapterIndex].description
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