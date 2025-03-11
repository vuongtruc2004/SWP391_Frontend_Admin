'use client'
import { Checkbox, Form, Input, Radio, Select } from 'antd'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import './quiz.style.scss'

type FieldType = {
    title: string;
    published: boolean;
    allowSeeAnswers: boolean;
    duration: number;
    chapterId: number;
    courseId: number;
    description: string;
};
const { Option } = Select;
const QuizCreateForm = ({ courses }: {
    courses: CourseDetailsResponse[];
}) => {
    const [form] = Form.useForm();
    const [selectedCourseId, setSelectedCourseId] = useState(courses[0].courseId);
    const [chapters, setChapters] = useState<ChapterResponse[]>([]);
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

    useEffect(() => {
        const courseChapters = courses.find(course => course.courseId === selectedCourseId)?.chapters;
        if (courseChapters) {
            setChapters(courseChapters)
        }

    }, [selectedCourseId])

    useEffect(() => {
        if (chapters.length > 0) {
            const defaultChapterId = chapters[0].chapterId;
            setSelectedChapterId(defaultChapterId);
            form.setFieldsValue({ chapterId: defaultChapterId }); // Cập nhật giá trị vào Form
        }
    }, [chapters]);

    return (
        <div className='p-5 border border-l-gray-300 h-[calc(100vh-61.6px)] sticky top-0 right-0'>
            <h1 className='font-semibold text-lg mb-3'>Thông tin cơ bản</h1>
            <Form
                form={form}
                layout='vertical'
                // onFinish={onFinish}
                initialValues={{
                    published: false,
                    courseId: courses[0].courseId,
                    chapterId: courses[0].chapters[0]?.chapterId || null
                }}
            >
                <Form.Item<FieldType>
                    label="Tiêu đề"
                    name='title'

                    rules={[{ required: true, message: 'Vui lòng không để trống tiêu đề!' }]}
                >
                    <Input placeholder='Nhập tiêu đề bài kiểm tra' />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô tả"
                    name='description'

                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <TextArea rows={4} placeholder='Nhập mô tả bài kiểm tra' />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Khóa học"
                    name='courseId'
                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <Select
                        onChange={(value) => setSelectedCourseId(value)}
                        options={courses.map(course => {
                            return {
                                value: course.courseId,
                                label: course.courseName
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Chương học"
                    name='chapterId'
                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <Select value={selectedChapterId} onChange={(value) => {
                        setSelectedChapterId(value);
                        form.setFieldsValue({ chapterId: value });
                    }}>
                        {chapters.map((chapter, index) => {
                            return (
                                <Option key={chapter.chapterId} value={chapter.chapterId}>
                                    Chương {index + 1}: {chapter.title}
                                </Option>
                            )
                        })}
                    </Select>
                </Form.Item>

                <div className='grid grid-cols-[1.6fr_1fr]'>
                    <Form.Item<FieldType>
                        label="Trạng thái"
                        name='published'
                        rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value={true}>Công khai</Radio.Button>
                            <Radio.Button value={false}>Chỉ mình tôi</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Thời gian làm bài"
                        name='duration'
                        rules={[{ required: true, message: 'Vui lòng không để trống thời gian làm bài!' }]}
                    >
                        <Input suffix='phút' placeholder='00' />
                    </Form.Item>
                </div>


                <Form.Item<FieldType>
                >
                    <Checkbox>Cho phép học viên xem đáp án sau khi làm xong bài kiểm tra</Checkbox>
                </Form.Item>
            </Form>
        </div>
    )
}

export default QuizCreateForm
