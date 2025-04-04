'use client'

import { validTitle } from "@/helper/create.question.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { PlusCircleOutlined, PlusOutlined, WarningOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Modal, notification, Spin, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initState: ErrorResponse = {
    error: false,
    value: ''
};

const QuestionCreateBtn = (props: { questionPageResponse: PageDetailsResponse<QuestionResponse[]> }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [answers, setAnswers] = useState([{ content: "", correct: false, empty: true }]);
    const { data: session, status } = useSession();
    const [isDuplicateAnswer, setIsDuplicateAnswer] = useState(false)

    useEffect(() => {
        const answerCounts = answers
            .map(a => a.content.trim().toLowerCase())
            .filter(content => content !== "")
            .reduce((acc: Record<string, number>, content: string) => {
                acc[content] = (acc[content] || 0) + 1;
                return acc;
            }, {});

        const hasDuplicates = Object.values(answerCounts).some(count => count > 1);

        setIsDuplicateAnswer(prev => (prev !== hasDuplicates ? hasDuplicates : prev));
    }, [answers]);

    const showModal = () => {
        setIsRotated(!isRotated);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsSubmitted(true);
        setLoading(true);
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

            setLoading(true);


            if (title.value.split(/\s+/).length > 101) {
                notification.error({
                    message: "Thất bại",
                    description: "Tiêu đề câu hỏi không được quá 100 từ!",
                    showProgress: true
                });
                setLoading(false)
                return
            }

            const isTooLong = answers.some((answer) => {
                if (answer.content.trim().split(/\s+/).length > 51) {
                    notification.error({
                        message: "Thất bại",
                        description: "Tiêu đề câu trả lời không được quá 50 từ!",
                        showProgress: true,
                    });
                    setLoading(false);
                    return true;
                }
                return false;
            });

            if (isTooLong) return;

            const questionRequest: QuestionRequest = {
                title: title.value,
                answers: answers
            };

            const createQuestionResponse = await sendRequest<ApiResponse<QuestionResponse>>({
                url: `${apiUrl}/questions`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: questionRequest
            });

            if (createQuestionResponse.status === 201) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: createQuestionResponse.message.toString(),
                    showProgress: true
                });
            } else {
                setErrorMessage(createQuestionResponse.message.toString());
                notification.error({
                    message: "Thất bại",
                    description: createQuestionResponse.message.toString(),
                    showProgress: true
                });
            }
            setLoading(false);
        }, 500);
    };

    const handleCancel = () => {
        setTitle(initState);
        setIsSubmitted(false)
        setAnswers([{ content: "", correct: false, empty: true }]);
        setIsModalOpen(false);
    };

    const addAnswer = () => {
        setAnswers([...answers, { content: "", correct: false, empty: true }]);
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
        <>
            <div>
                {session?.user.roleName === 'EXPERT' &&
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="w-fit ml-[40px] !pt-5 !pb-5"
                        icon={<PlusOutlined className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />}
                    >
                        Tạo mới
                    </Button>
                }
            </div>

            <Modal
                title="Tạo câu hỏi"
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
                width='50%'
            >
                <Spin spinning={loading}>
                    <div>
                        <span className="text-red-500 mr-2">*</span>Tiêu đề:
                        <TextArea
                            status={title.error ? 'error' : ''}
                            className="mt-1 h-[15vh]"
                            placeholder="Nhập tiêu đề câu hỏi"
                            allowClear
                            value={title.value}
                            onChange={(e) => setTitle({ ...title, value: e.target.value, error: false })}
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
                        <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
                    </div>
                </Spin>

            </Modal>

        </>
    );
};

export default QuestionCreateBtn;
