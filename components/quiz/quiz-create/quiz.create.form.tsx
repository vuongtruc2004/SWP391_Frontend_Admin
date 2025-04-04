'use client'
import { Checkbox, Form, FormProps, Input, message, notification, Radio, Select } from 'antd'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import './quiz.style.scss'
import { QuizFieldType, useQuizCreate } from '@/wrapper/quiz-create/quiz.create.wrapper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const { Option } = Select;
const QuizCreateForm = ({ course }: { course: CourseDetailsResponse }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { form, createQuestions, setCreateQuestions, selectQuestions, setSelectQuestions, setIsSubmitted } = useQuizCreate();
    const [chapters, setChapters] = useState<ChapterResponse[]>(course.chapters);
    const [questionList, setQuestionList] = useState<string[]>([]);

    const onFinish: FormProps<QuizFieldType>['onFinish'] = async (values) => {
        setIsSubmitted(true);
        const questionValues = createQuestions.map(q => q.title.trim().toLowerCase());
        let hasError = false;

        const hasCorrectAnswer = createQuestions.some(q =>
            q.answers.some(a => a.correct === true)
        );

        hasError = !hasCorrectAnswer

        if (values.title.trim().split(/\s+/).length > 100) {
            form.setFields([{ name: 'title', errors: ["Tiêu đề không được vượt quá 100 từ!"] }]);
            return;
        }

        const updatedQuestions = createQuestions.map(q => {
            if (q.title.trim() === "") {
                hasError = true;
                return { ...q, errorMessage: "Vui lòng không để trống câu hỏi" };
            }
            if (q.title.trim().split(/\s+/).length > 100) {
                hasError = true;
                return { ...q, errorMessage: "Nội dung câu hỏi không được quá 100 từ" }
            }
            if (questionValues.filter(v => v === q.title.trim().toLowerCase()).length > 1) {
                hasError = true;
                return { ...q, errorMessage: "Vui lòng không tạo câu hỏi giống nhau" };
            }

            return { ...q, errorMessage: "" };
        });

        setCreateQuestions(updatedQuestions);

        if (selectQuestions.length > 0 && createQuestions[0].title === '') {
            // TH1: Có chọn từ ngân hàng nhưng không tạo mới, tiếp tục xử lý
        } else if (selectQuestions.length === 0 && hasError) {
            // TH2: Không chọn từ ngân hàng và có lỗi khi tạo mới → return
            return;
        } else if (selectQuestions.length > 0 && hasError) {
            // TH3: Có chọn từ ngân hàng nhưng tạo mới có lỗi → return
            return;
        }

        try {
            let hasDuplicateError = false;
            const updatedQuestions = createQuestions.map(q => {
                if (questionList.includes(q.title.trim()) && q.title !== '') {
                    hasDuplicateError = true;
                    return { ...q, errorMessage: "Câu hỏi này đã tồn tại trong danh sách" };
                }
                return { ...q, errorMessage: "" };
            });

            setCreateQuestions(updatedQuestions);

            if (hasDuplicateError) return;

            const quizRequest: QuizRequest = {
                title: values.title,
                published: values.published,
                allowSeeAnswers: values.allowSeeAnswers,
                description: values.description,
                duration: values.duration,
                chapterId: values.chapterId,
                bankQuestionIds: selectQuestions.map(q => q.questionId),
                newQuestions: createQuestions[0].title === '' ? [] : createQuestions
            }

            const quizResponse = await sendRequest<ApiResponse<QuizResponse>>({
                url: `${apiUrl}/quizzes`,
                method: 'POST',
                body: quizRequest,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`
                },
            });
            console.log("quizResponse>>", quizResponse);
            if (quizResponse.status == 201) {

                notification.success({
                    message: "Thành công",
                    description: quizResponse.message.toString(),
                });
                router.push("/course")
            } else {
                switch (quizResponse.errorMessage) {
                    case 'Title_Quiz_Exception':
                        form.setFields([{ name: 'title', errors: [quizResponse.message.toString()] }]);
                        break;
                    case 'Chapter_Exception':
                        form.setFields([{ name: 'chapterId', errors: [quizResponse.message.toString()] }]);
                        break;
                    default:
                        notification.error({
                            message: "Lỗi không xác định",
                            description: "Đã xảy ra lỗi, vui lòng thử lại."
                        });
                }
            }
        } catch (error) {
            notification.error({
                message: "Lỗi khi tạo bài kiểm tra",
                description: "Vui lòng thử lại."
            });
        };
    }

    useEffect(() => {
        const fetchAllQuestions = async () => {
            let allQuestion: string[] = [];
            let currentPage = 1;
            let totalPages = 1;
            while (currentPage <= totalPages) {

                const questionsAll = await sendRequest<ApiResponse<PageDetailsResponse<QuestionResponse[]>>>({
                    url: `${apiUrl}/questions/pagination`,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    },
                    queryParams: {
                        page: currentPage,
                        size: 10
                    }
                });
                if (!questionsAll.data) {
                    return;
                }
                allQuestion = [...allQuestion, ...questionsAll.data.content.map(q => q.title)];
                totalPages = questionsAll.data.totalPages

                if (currentPage >= totalPages)
                    break;
                currentPage++;
            }
            setQuestionList(allQuestion);

        }
        fetchAllQuestions();
    }, []);

    return (
        <div className='w-[400px] p-5 border border-l-gray-300 h-[calc(100vh-61.6px)] sticky top-0 right-0'>
            <h1 className='font-semibold text-lg mb-3'>Thông tin cơ bản</h1>
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                initialValues={{
                    published: false,
                    allowSeeAnswers: false
                }}
            >
                <Form.Item<QuizFieldType>
                    label="Tiêu đề"
                    name='title'
                    rules={[{ required: true, message: 'Vui lòng không để trống tiêu đề!' }]}
                >
                    <Input placeholder='Nhập tiêu đề bài kiểm tra' />
                </Form.Item>

                <Form.Item<QuizFieldType>
                    label="Mô tả"
                    name='description'
                    rules={[{ required: true, message: 'Vui lòng không để trống mô tả!' }]}
                >
                    <TextArea rows={4} placeholder='Nhập mô tả bài kiểm tra' />
                </Form.Item>

                <Form.Item<QuizFieldType>
                    label="Chương học"
                    name='chapterId'
                    rules={[{ required: true, message: 'Vui lòng không để trống chương học!' }]}
                >
                    <Select placeholder="Chọn chương học">
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
                    <Form.Item<QuizFieldType>
                        label="Trạng thái"
                        name='published'
                        rules={[{ required: true, message: 'Vui lòng không để trống trạng thái!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value={true}>Công khai</Radio.Button>
                            <Radio.Button value={false}>Chỉ mình tôi</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item<QuizFieldType>
                        label="Thời gian làm bài"
                        name='duration'
                        rules={[{ required: true, message: 'Vui lòng không để trống thời gian làm bài!' },
                        { pattern: /^[1-9]\d*$/, message: 'Thời gian làm bài phải là số nguyên dương!' },
                        ]}
                    >
                        <Input suffix='phút' placeholder='00' />
                    </Form.Item>
                </div>


                <Form.Item<QuizFieldType>
                    name='allowSeeAnswers'
                    valuePropName='checked'>
                    <Checkbox >Cho phép học viên xem đáp án sau khi làm xong bài kiểm tra</Checkbox>
                </Form.Item>
            </Form>
        </div>
    )
}

export default QuizCreateForm
