'use client'
import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, notification, Spin, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { validTitle } from '@/helper/create.question.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import TextArea from 'antd/es/input/TextArea';
import { useSession } from 'next-auth/react';


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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDuplicateAnswer, setIsDuplicateAnswer] = useState(false)
    const router = useRouter();
    const { data: session, status } = useSession();

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
        }
    }, [editingQuestion]);

    useEffect(() => {
        const answerCounts = answers
            .map(a => a.content.trim().toLowerCase())
            .filter(content => content !== "")
            .reduce((acc: any, content: string) => {
                acc[content] = (acc[content] || 0) + 1;
                return acc;
            }, {});

        const duplicates = new Set(Object.keys(answerCounts).filter(content => answerCounts[content] > 1));
        setIsDuplicateAnswer(duplicates.size > 0);
    }, [answers]);

    const handleOk = async () => {

        setLoading(true);
        setIsSubmitted(true);
        setTimeout(async () => {
            const isTitleValid = validTitle(title, setTitle);
            if (!isTitleValid) {
                setLoading(false);
                return;
            }
            if (answers.some(answer => answer.empty)) {
                setLoading(false);
                return;
            }
            if (!answers.some(answer => answer.correct)) {
                setLoading(false);
                return;
            }

            if (isDuplicateAnswer) {
                setLoading(false);
                return;
            }

            if (title.value.split(/\s+/).length > 100) {
                notification.error({
                    message: "Thất bại",
                    description: "Tiêu đề câu hỏi không được quá 100 từ!",
                    showProgress: true
                });
                setLoading(false)
                return
            }

            const questionRequest: QuestionRequest = {
                title: title.value,
                answers: answers
            };

            const updateResponse = await sendRequest<ApiResponse<QuestionResponse>>({
                url: `${apiUrl}/questions/update/${editingQuestion?.questionId}`,
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: questionRequest
            });

            if (updateResponse.status === 200) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: updateResponse.message.toString(),
                    showProgress: true
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: "Thay đổi thông tin thất bại!",
                    showProgress: true
                });
            }
            setLoading(false);
        }, 500);
    };

    const handleCancel = () => {
        setEditingQuestion(null);
        setOpenEditForm(false);
    };

    const addAnswer = () => {
        setAnswers([...answers, { content: "", correct: false, answersId: null, empty: true }]);
    };

    const removeAnswer = (index: number) => {
        setAnswers(answers.filter((_, i) => i !== index));
    };

    const updateAnswer = (index: number, content: string) => {
        const newAnswers = [...answers];
        newAnswers[index].content = content;
        newAnswers[index].empty = content.trim() === "";
        setAnswers(newAnswers);
    };

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
            width='50%'
        >
            <Spin spinning={loading}>

                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Tiêu đề:
                    <TextArea
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
                        className="mt-1 h-[15vh]"
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
                    {answers.map((answer, index) => {
                        const isDuplicate = answers
                            .filter(a => {
                                if (a.content && answer.content) {
                                    return a.content.trim().toLowerCase() === answer.content.trim().toLowerCase();
                                }
                                return false;
                            }).length > 1;
                        return (
                            <div key={index} className="w-full flex flex-col gap-1 mt-2">
                                <div className="flex items-center gap-2">
                                    <Tooltip title='Xác nhận đáp án đúng' color="green">
                                        <Checkbox checked={answer.correct} onChange={() => toggleCorrect(index)} />
                                    </Tooltip>
                                    <TextArea
                                        className={`w-full ${isSubmitted && answer.empty ? "border-red-500" : ""}`}
                                        placeholder={`Câu trả lời ${index + 1}`}
                                        value={answer.content}
                                        onChange={(e) => updateAnswer(index, e.target.value)}
                                        allowClear
                                    />
                                    <Tooltip title='Thêm đáp án' color="blue">
                                        <PlusCircleOutlined onClick={addAnswer} className="text-lg cursor-pointer" style={{ color: 'blue' }} />
                                    </Tooltip>
                                    {answers.length > 1 && (
                                        <Tooltip title='Xóa đáp án' color="red">
                                            <MinusCircleOutlined style={{ color: 'red' }} className="text-lg cursor-pointer" onClick={() => removeAnswer(index)} />
                                        </Tooltip>
                                    )}
                                </div>
                                {isSubmitted && answer.empty && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Vui lòng không để trống câu trả lời
                                    </p>
                                )}
                                {isDuplicate && isSubmitted && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Vui lòng không thêm đáp án giống nhau
                                    </p>
                                )}
                            </div>
                        );
                    })}

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
            </Spin>

        </Modal>
    )
}

export default UpdateQuestionForm