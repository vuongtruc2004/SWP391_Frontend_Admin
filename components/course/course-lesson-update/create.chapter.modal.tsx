import { CloseOutlined } from "@ant-design/icons"
import { Button, Form, FormProps, Input, Modal } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react"

interface FieldType {
    title: string;
    description: string;
}
const CreateChapterModal = ({ setChapters, open, setOpen, setIsSaved }: {
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setIsSaved: Dispatch<SetStateAction<boolean>>
}) => {
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setChapters(prev => [...prev, {
            title: values.title,
            description: values.description,
            lessons: []
        }]);
        setIsSaved(false);
        setOpen(false);
    };

    return (
        <Modal title={`Tạo chương học`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} iconPosition="start" onClick={() => {
                form.resetFields();
                setOpen(false);
            }} key="cancel">Hủy</Button>,

            <Button key="submit" type="primary" onClick={() => form.submit()}>Tạo</Button>
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