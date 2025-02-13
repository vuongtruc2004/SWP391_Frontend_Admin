'use client'

import { validTitle } from "@/helper/create.question.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { PlusCircleOutlined, PlusOutlined, WarningOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Input, message, Modal, notification, Space } from "antd";
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
    const [isSubmitted, setIsSubmitted] = useState(false); // Theo dõi trạng thái đã nhấn "Tạo"
    const [messageApi] = message.useMessage();
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [answers, setAnswers] = useState([{ content: "", correct: false, empty: true }]); // Mảng câu trả lời

    const showModal = () => {
        setIsRotated(!isRotated);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsSubmitted(true); // Đánh dấu đã submit

        const isTitleValid = validTitle(title, setTitle);
        if (!isTitleValid) return;

        // Kiểm tra nếu có câu trả lời rỗng
        if (answers.some(answer => answer.empty)) {
            return;
        }

        // Kiểm tra nếu không có đáp án nào đúng
        if (!answers.some(answer => answer.correct)) {
            return;
        }

        const createAnswerResponses = await Promise.all(
            answers.map(async (current) => {
                return await sendRequest<ApiResponse<AnswerResponse>>({
                    url: `${apiUrl}/answers`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        content: current.content,
                        correct: current.correct
                    }
                });
            })
        );

        let listAnswerId: number[] = createAnswerResponses.map((item) => item.data.answerId);

        const questionRequest: QuestionRequest = {
            title: title.value,
            answersId: listAnswerId
        };

        const createQuestionResponse = await sendRequest<ApiResponse<SubjectResponse>>({
            url: `${apiUrl}/questions`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: questionRequest
        });

        if (createQuestionResponse.status === 201) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: createQuestionResponse.message.toString(),
            });
        } else {
            setErrorMessage(createQuestionResponse.message.toString());
            notification.error({
                message: "Thất bại",
                description: createQuestionResponse.message.toString(),
            });
        }
    };

    const handleCancel = () => {
        setTitle(initState);
        setIsSubmitted(false)
        setAnswers([{ content: "", correct: false, empty: true }]); // Reset danh sách câu trả lời
        setIsModalOpen(false);
    };

    // Thêm câu trả lời mới
    const addAnswer = () => {
        setAnswers([...answers, { content: "", correct: false, empty: true }]);
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
        <>
            <div>
                <Button
                    type="primary"
                    onClick={showModal}
                    className="w-fit ml-[40px] !pt-5 !pb-5"
                    icon={<PlusOutlined className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />}
                >
                    Tạo mới
                </Button>
            </div>

            <Modal
                title="Tạo câu hỏi"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
                okText="Tạo"
            >
                <div>
                    <span className="text-red-500 mr-2">*</span>Tiêu đề:
                    <Input
                        status={title.error ? 'error' : ''}
                        className="mt-1"
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


            </Modal>

        </>
    );
};

export default QuestionCreateBtn;
