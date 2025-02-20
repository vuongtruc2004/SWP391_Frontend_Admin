'use client'
import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, notification } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { validTitle } from '@/helper/create.question.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';


const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateQuestionForm = (props: {
    editingQuestion: QuestionResponse | null;
    setEditingQuestion: React.Dispatch<React.SetStateAction<QuestionResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { editingQuestion, setEditingQuestion, openEditForm, setOpenEditForm } = props;
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [answers, setAnswers] = useState<{ content: string; correct: boolean; answersId: number | null; empty: boolean }[]>([
        { content: "", correct: false, answersId: null, empty: true }
    ]);
    const [initialAnswers, setInitialAnswers] = useState<
        { content: string; correct: boolean; answersId: number | null; empty: boolean }[]
    >([]);
    const [isSubmitted, setIsSubmitted] = useState(false); // Theo dõi trạng thái đã nhấn "Tạo"
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (editingQuestion) {
            setTitle({
                error: false,
                value: editingQuestion.title
            });

            const mappedAnswers = editingQuestion.answers.map(answer => ({
                content: answer.content || "",
                correct: answer.correct || false,
                answersId: answer.answerId !== undefined ? answer.answerId : null,
                empty: answer.content.trim() === "" ? true : false
            }));

            setAnswers(mappedAnswers);
            setInitialAnswers(JSON.parse(JSON.stringify(mappedAnswers))); // Tạo bản sao độc lập
        }
    }, [editingQuestion]);

    const handleOk = async () => {

        setIsSubmitted(true); // Đánh dấu đã submit
        setLoading(true);
        // Kiểm tra tất cả các giá trị
        const isTitleValid = validTitle(title, setTitle);

        // Nếu bất kỳ giá trị nào không hợp lệ, dừng lại
        if (!isTitleValid) {
            setLoading(false);
            return;
        }

        // Kiểm tra nếu có câu trả lời rỗng
        if (answers.some(answer => answer.empty)) {
            setLoading(false);
            return;
        }

        // Kiểm tra nếu không có đáp án nào đúng
        if (!answers.some(answer => answer.correct)) {
            setLoading(false);
            return;
        }

        const questionRequest: QuestionRequest = {
            title: title.value,
        }

        // Tạo danh sách ID các câu trả lời hiện tại
        const currentAnswerIds = answers.map(a => a.answersId).filter(id => id !== null) as number[];

        // Tìm các câu trả lời bị xóa (có trong `initialAnswers` nhưng không có trong `answers`)
        const deletedAnswers = initialAnswers.filter(a => a.answersId !== null && !currentAnswerIds.includes(a.answersId));

        // Cập nhật hoặc tạo mới đáp án
        await Promise.all(
            answers.map(async (answer) => {
                if (answer.answersId !== null) {
                    // Cập nhật đáp án
                    return sendRequest<ApiResponse<AnswerResponse>>({
                        url: `${apiUrl}/answers/update/${answer.answersId}`,
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: {
                            content: answer.content,
                            correct: answer.correct
                        }
                    });
                } else {
                    // Tạo mới đáp án
                    return sendRequest<ApiResponse<AnswerResponse>>({
                        url: `${apiUrl}/answers`,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: {
                            questionId: editingQuestion?.questionId,
                            content: answer.content,
                            correct: answer.correct
                        }
                    });
                }
            })
        );

        // Xóa đáp án không còn tồn tại
        await Promise.all(
            deletedAnswers.map(async (answer) => {
                return sendRequest<ApiResponse<null>>({
                    url: `${apiUrl}/answers/delete/${answer.answersId}`,
                    method: 'DELETE'
                });
            })
        );

        const updateResponse = await sendRequest<ApiResponse<SubjectResponse>>({
            url: `${apiUrl}/questions/update/${editingQuestion?.questionId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                title: title.value
            }
        });

        if (updateResponse.status === 200) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: updateResponse.message.toString(),
            });
        } else {
            notification.error({
                message: "Thất bại",
                description: "Thay đổi thông tin thất bại!",
            });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setEditingQuestion(null);
        setOpenEditForm(false);
    };

    // Thêm câu trả lời mới
    const addAnswer = () => {
        setAnswers([...answers, { content: "", correct: false, answersId: null, empty: true }]);
    };

    // Xóa câu trả lời
    const removeAnswer = (index: number) => {
        setAnswers(answers.filter((_, i) => i !== index));
    };

    // Cập nhật nội dung câu trả lời
    const updateAnswer = (index: number, content: string) => {
        const newAnswers = [...answers];
        newAnswers[index].content = content;
        newAnswers[index].empty = content.trim() === ""; // Kiểm tra rỗng
        setAnswers(newAnswers);
    };

    // Cập nhật trạng thái checkbox đúng/sai
    const toggleCorrect = (index: number) => {
        const newAnswers = [...answers];
        newAnswers[index].correct = !newAnswers[index].correct;
        setAnswers(newAnswers);
    };

    return (
        <Modal title="Cập nhật câu hỏi"
            open={openEditForm}
            footer={null}
            onCancel={handleCancel}
        >
            <div className="mb-3">
                <span className="text-red-500 mr-2">*</span>Tiêu đề:
                <Input
                    placeholder="Nhập tiêu đề"
                    status={title.error ? 'error' : ''}
                    allowClear
                    value={title.value}
                    onChange={(e) => {
                        setTitle({
                            ...title,
                            value: e.target.value,
                            error: false
                        })
                    }}
                    className="mt-1"
                    name="subjectName"
                />
                {title.error && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {title.message}
                    </p>
                )}
            </div>
            <div className="mt-4">
                <span className="text-red-500 mr-2">*</span>Câu trả lời:
                {answers.map((answer, index) => (
                    <div key={index} className="w-full flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox checked={answer.correct} onChange={() => toggleCorrect(index)} />
                            <Input
                                className={`w-full ${isSubmitted && answer.empty ? "border-red-500" : ""}`}
                                placeholder={`Câu trả lời ${index + 1}`}
                                value={answer.content}
                                onChange={(e) => updateAnswer(index, e.target.value)}
                                allowClear
                            />
                            {answers.length > 1 && (
                                <MinusCircleOutlined style={{ color: 'red' }} className="text-lg cursor-pointer" onClick={() => removeAnswer(index)} />
                            )}
                        </div>
                        {isSubmitted && answer.empty && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Vui lòng không để trống câu trả lời
                            </p>
                        )}
                    </div>
                ))
                }
                <Button type="dashed" onClick={addAnswer} icon={<PlusCircleOutlined />} className="mt-3 w-full">
                    Thêm câu trả lời
                </Button>
                {!answers.some(answer => answer.correct) && isSubmitted && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        Bạn chưa chọn đáp án đúng!
                    </p>
                )}
            </div>

            <div className="flex justify-end mt-5">
                <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                <Button loading={loading} type="primary" onClick={() => handleOk()}>Cập nhật</Button>
            </div>

        </Modal>
    )
}

export default UpdateQuestionForm