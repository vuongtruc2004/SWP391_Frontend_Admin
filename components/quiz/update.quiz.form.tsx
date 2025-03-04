import { validTitle } from '@/helper/create.blog.helper';
import { validDate, validMaxAttempts } from '@/helper/create.quiz.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DeleteFilled, MinusCircleOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, DatePickerProps, Input, Modal, notification, Select, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateQuizForm = (props: {
    editingQuiz: QuizResponse | null;
    setEditingQuiz: React.Dispatch<React.SetStateAction<QuizResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { openEditForm, setOpenEditForm, editingQuiz, setEditingQuiz } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [maxAttempts, setMaxAttempts] = useState<ErrorResponse>(initState);
    const [searchText, setSearchText] = useState("");

    const [published, setPublished] = useState<ErrorResponse>({
        ...initState,
        value: 'active'
    });

    // const [errorMessage, setErrorMessage] = useState("");

    const [startedAt, setStartedAt] = useState<ErrorResponse>(initState);
    const [endedAt, setEndedAt] = useState<ErrorResponse>(initState);
    const [isSubmitted, setIsSubmitted] = useState(false); // Theo dõi trạng thái đã nhấn "Tạo"
    const [createQuestions, setCreateQuestions] = useState([{ value: "", answers: [{ content: "", correct: false, empty: true }], errorMessage: "" }]);
    const CheckboxGroup = Checkbox.Group;
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [questionList, setQuestionList] = useState<string[]>([]);
    const [initialQuiz, setInitialQuiz] = useState<QuizRequest | null>(null);
    useEffect(() => {
        fetchQuestions();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const fetchQuestions = async () => {
        try {
            const questionResponse = await sendRequest<ApiResponse<QuestionResponse[]>>({
                url: `${apiUrl}/questions/all-inpagination`,
            });

            if (questionResponse && questionResponse.data) {
                // Kiểm tra xem có dữ liệu không
                const questionTitles = questionResponse.data.map((question) => question.title);
                setQuestionList(questionTitles);
            } else {
                console.log("Không có dữ liệu câu hỏi", questionResponse);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách câu hỏi:", error);
        }
    };


    useEffect(() => {
        if (editingQuiz) {
            setInitialQuiz({
                quizId: editingQuiz.quizId,
                title: editingQuiz.title,
                maxAttempts: editingQuiz.maxAttempts,
                published: editingQuiz.published,
                startedAt: editingQuiz.startedAt ? editingQuiz.startedAt : '',
                endedAt: editingQuiz.endedAt ? editingQuiz.endedAt : '',
                questions: editingQuiz.questions.map(q => q.title), // Lưu danh sách câu hỏi
            });
            setTitle({
                error: false,
                value: editingQuiz.title
            });
            setMaxAttempts({
                error: false,
                value: editingQuiz.maxAttempts.toString()
            })
            setStartedAt({
                error: false,
                value: editingQuiz.startedAt
            })
            setEndedAt({
                error: false,
                value: editingQuiz.endedAt
            })
            setPublished({
                error: false,
                value: editingQuiz.published ? 'active' : 'unactive'
            })

        }
        if (editingQuiz?.questions) {
            setCheckedList(
                editingQuiz.questions
                    .filter((question) => question.title?.trim() !== "")
                    .map((question) => question.title)
            );
        }
    }, [editingQuiz]);

    const filteredQuestions = questionList.filter((question) =>
        question.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleOk = async () => {
        setIsSubmitted(true);
        const isValidTitle = validTitle(title, setTitle);
        const isValidMaxAttempts = validMaxAttempts(maxAttempts, setMaxAttempts);
        const isValidDate = validDate(startedAt, endedAt, setStartedAt, setEndedAt);
        const questionValues = createQuestions.map(q => q.value.trim().toLowerCase());
        const hasCheckedList = checkedList.length > 0 ? true : false;
        let hasError = false;

        const updatedQuestions = createQuestions.map(q => {
            const hasUserEdited = q.value.trim() !== ""; // Kiểm tra nếu người dùng đã nhập câu hỏi
            const hasAnswer = q.answers.some(a => a.content.trim() !== ""); // Có câu trả lời nào không
            const hasCorrectAnswer = q.answers.some(a => a.correct); // Có ít nhất một đáp án đúng không

            if (hasUserEdited) {
                if (!hasAnswer) {
                    hasError = true;
                    // return { ...q, errorMessage: "Vui lòng nhập ít nhất một câu trả lời. cccc" };
                }
                if (!hasCorrectAnswer) {
                    hasError = true;
                    // return { ...q, errorMessage: "Vui lòng chọn ít nhất một đáp án đúng." };
                }
            }

            return { ...q, errorMessage: "" };
        });
        setCreateQuestions(updatedQuestions);

        // 🔹 4. Nếu tiêu đề đã thay đổi, kiểm tra xem có bị trùng không
        if (title.value.trim() !== editingQuiz?.title?.trim()) {
            const existingQuizResponse = await sendRequest<ApiResponse<QuizResponse>>({
                url: `${apiUrl}/quiz/${title.value.trim()}`,
                method: 'GET',
            });

            if (existingQuizResponse.status === 200 && existingQuizResponse.data) {
                setTitle({
                    ...title,
                    error: true,
                    message: "Tiêu đề bài kiểm tra đã tồn tại",
                });
                return;
            }
        }
        const hasNewQuestion = createQuestions.some(q => q.value.trim() !== "");

        if (hasCheckedList && !hasNewQuestion) {
            hasError = false; // Nếu chỉ dùng câu hỏi có sẵn và không nhập mới thì không cần kiểm tra lỗi
        }

        if (hasError || !isValidTitle || !isValidMaxAttempts || !isValidDate) {
            return;
        }

        try {
            // Gửi từng câu trả lời lên API
            const createAnswerResponses = await Promise.all(
                createQuestions.flatMap((question) =>
                    question.answers.map(async (current) => {
                        const response = await sendRequest<ApiResponse<AnswerResponse>>({
                            url: `${apiUrl}/answers`,
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: {
                                content: current.content,
                                correct: current.correct
                            }
                        });
                        return response.data.answerId;
                    })
                )
            );


            let hasDuplicateError = false;

            const updatedQuestions = createQuestions.map(q => {
                if (questionList.includes(q.value.trim()) && q.value !== '') {
                    hasDuplicateError = true;
                    return { ...q, errorMessage: "Câu hỏi này đã tồn tại trong danh sách" };
                }
                return { ...q, errorMessage: "" };
            });

            setCreateQuestions(updatedQuestions);

            if (hasDuplicateError) return;


            // Gửi câu hỏi lên API
            const questionRequests = createQuestions
                .filter(question => question.value.trim() !== '') // Lọc bỏ câu hỏi rỗng
                .map((question, index) => ({
                    title: question.value.trim(),
                    answersId: createAnswerResponses.slice(index * question.answers.length, (index + 1) * question.answers.length)
                }));


            let createQuestionResponses: (string | null)[] = [];

            if (questionRequests.length > 0) {
                console.log("questionRequest>>>>>>>>", questionRequests);
                createQuestionResponses = await Promise.all(
                    questionRequests.map(async (questionRequest, index) => {
                        const response = await sendRequest<ApiResponse<QuestionResponse>>({
                            url: `${apiUrl}/questions`,
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: questionRequest
                        });

                        if (response.data && response.data.title) {
                            return response.data.title;
                        } else {
                            const newQuestions = [...createQuestions];
                            newQuestions[index].errorMessage = response.message.toString();
                            setCreateQuestions(newQuestions);
                            return null;
                        }
                    })
                );

                if (createQuestionResponses.some((res) => res === null)) {
                    return;
                }

            }


            // Tạo bài kiểm tra
            const quizRequest: QuizRequest = {
                quizId: editingQuiz?.quizId,
                title: title.value,
                maxAttempts: Number(maxAttempts.value),
                published: published.value == 'active' ? true : false,
                startedAt: startedAt.value ? dayjs(startedAt.value).format("YYYY-MM-DD HH:mm:ss") : editingQuiz?.startedAt || '',
                endedAt: endedAt.value ? dayjs(endedAt.value).format("YYYY-MM-DD HH:mm:ss") : editingQuiz?.endedAt || '',
                questions: [...checkedList, ...createQuestionResponses.filter(q => q !== null) as string[]]
            }

            console.log("quizRequest>>", quizRequest)
            console.log("initQuiz>>", initialQuiz)
            console.log("so sanh", JSON.stringify(quizRequest) === JSON.stringify(initialQuiz))
            if (JSON.stringify(quizRequest) === JSON.stringify(initialQuiz)) {
                notification.info({
                    message: "Không có thay đổi",
                    description: "Không có thông tin nào được cập nhật.",
                });
                handleCancel();
                return;
            }

            const createQuizResponse = await sendRequest<ApiResponse<QuizResponse>>({
                url: `${apiUrl}/quiz`,
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: quizRequest
            });

            console.log("createQuizResponse>>", createQuizResponse);

            if (createQuizResponse.status === 200) {
                handleCancel();
                await fetchQuestions();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: createQuizResponse.message.toString(),
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: "sai rồi",
                })
            }
        } catch (error) {
            console.error("Lỗi khi tạo câu hỏi/câu trả lời:", error);
            notification.error({
                message: "Lỗi khi tạo bài kiểm tra",
                description: "Vui lòng thử lại."
            });
        }
    };


    const onChange = (list: string[]) => {
        // Đảm bảo giữ lại các giá trị đã chọn trước đó
        setCheckedList((prevCheckedList) => {
            const newCheckedList = [...prevCheckedList];

            // Kiểm tra nếu bỏ chọn thì loại bỏ khỏi danh sách
            filteredQuestions.forEach((q) => {
                if (!list.includes(q)) {
                    const index = newCheckedList.indexOf(q);
                    if (index > -1) newCheckedList.splice(index, 1);
                }
            });

            // Thêm các giá trị mới được chọn vào danh sách
            list.forEach((q) => {
                if (!newCheckedList.includes(q)) {
                    newCheckedList.push(q);
                }
            });

            return newCheckedList;
        });
    };

    const handleCancel = () => {

        setIsSubmitted(false);
        // setAnswers([{ content: "", correct: false, empty: true }]);
        setCreateQuestions([{ value: "", answers: [{ content: "", correct: false, empty: true }], errorMessage: "" }]);
        setOpenEditForm(false);
        setCheckedList([]);
        setEditingQuiz(null);
        setSearchText('');
    };
    const handleStartedAtChange: DatePickerProps["onChange"] = (date) => {
        setStartedAt({ ...startedAt, value: date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "", error: false });
    };
    const handleEndedAtChange: DatePickerProps["onChange"] = (date) => {
        setEndedAt({ ...endedAt, value: date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "", error: false });
    };


    const addQuestion = () => {
        setCreateQuestions([...createQuestions, { value: "", answers: [{ content: "", correct: false, empty: true }], errorMessage: "" }]);
    };
    const removeQuestion = (index: number) => {
        setCreateQuestions(createQuestions.filter((_, i) => i !== index));
    };
    const updateQuestion = (index: number, value: string) => {
        const newQuestions = [...createQuestions];
        newQuestions[index].value = value;
        newQuestions[index].errorMessage = '';
        setCreateQuestions(newQuestions);
    };

    const addAnswer = (qIndex: number) => {
        const newQuestions = [...createQuestions];
        newQuestions[qIndex].answers.push({ content: "", correct: false, empty: true });
        setCreateQuestions(newQuestions);
    };
    const removeAnswer = (qIndex: number, aIndex: number) => {
        const newQuestions = [...createQuestions];
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        setCreateQuestions(newQuestions);
    };
    const updateAnswer = (qIndex: number, aIndex: number, content: string) => {
        const newQuestions = [...createQuestions];
        newQuestions[qIndex].answers[aIndex].content = content;
        setCreateQuestions(newQuestions);
    };
    const toggleCorrect = (qIndex: number, aIndex: number) => {
        const newQuestions = [...createQuestions];
        newQuestions[qIndex].answers[aIndex].correct = !newQuestions[qIndex].answers[aIndex].correct;
        setCreateQuestions(newQuestions);
    };

    return (
        <>

            <Modal title="Cập nhật bài kiểm tra" open={openEditForm} onOk={handleOk} onCancel={handleCancel} okText="Cập nhật" cancelText="Hủy">

                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Tiêu đề:
                    <Input
                        status={title.error ? 'error' : ''}
                        placeholder="Nhập tiêu đề bài kiểm tra"
                        allowClear
                        value={title.value}
                        onChange={(e) => {
                            setTitle({
                                ...title,
                                value: e.target.value,
                                error: false
                            })

                        }}
                        className="mt-1" />
                    {title.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {title.message}
                        </p>
                    )}
                </div>
                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Lượt kiểm tra:
                    <Input
                        status={maxAttempts.error ? 'error' : ''}
                        placeholder="Nhập lượt kiểm tra"
                        allowClear={false}
                        value={maxAttempts.value}
                        onChange={(e) => {
                            setMaxAttempts({
                                ...maxAttempts,
                                value: e.target.value,
                                error: false
                            })

                        }}
                        className="mt-1" />
                    {maxAttempts.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {maxAttempts.message}
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <span className="text-red-500 mr-2">*</span>Trạng thái:
                    <Select
                        status={published.error ? 'error' : ''}
                        style={{
                            width: '100%',
                            marginTop: '5px'
                        }}
                        showSearch
                        placeholder="Lựa chọn trạng thái"
                        value={published.value}
                        onChange={(value) => setPublished({
                            ...published,
                            value,
                            error: false
                        })}
                        allowClear={false}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            { value: 'active', label: 'Mở' },
                            { value: 'unactive', label: 'Đóng' },
                        ]}
                    />
                    {published.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {published.message}
                        </p>
                    )}
                </div>

                <div className=" mb-3">
                    <span className="text-red-500 mr-2 ">*</span>Bắt đầu:
                    <Space direction="vertical" className="ml-4">
                        <DatePicker
                            showTime
                            status={startedAt.error ? 'error' : ''}
                            value={startedAt.value ? dayjs(startedAt.value) : null}
                            onChange={handleStartedAtChange}
                            picker="date" />
                    </Space>
                    {startedAt.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {startedAt.message}
                        </p>
                    )}
                </div>
                <div className=" mb-3">
                    <span className="text-red-500 mr-2 ">*</span>Kết thúc:
                    <Space direction="vertical" className="ml-3">
                        <DatePicker
                            showTime
                            status={endedAt.error ? 'error' : ''}
                            value={endedAt.value ? dayjs(endedAt.value) : null}
                            onChange={handleEndedAtChange}
                            picker="date" />
                    </Space>
                    {endedAt.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {endedAt.message}
                        </p>
                    )}
                </div>


                {createQuestions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-4 border-gray-400 border-2 p-4 rounded">
                        <Input
                            status={question.errorMessage !== '' ? 'error' : ''}
                            placeholder="Nhập câu hỏi"
                            value={question.value}
                            onChange={(e) => updateQuestion(qIndex, e.target.value)} />

                        {question.errorMessage && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {question.errorMessage}
                            </p>
                        )}
                        {question.answers.map((answer, aIndex) => (
                            <div key={aIndex}>
                                <div className="flex gap-2 mt-2">
                                    <Checkbox
                                        checked={answer.correct}
                                        onChange={() => toggleCorrect(qIndex, aIndex)} />

                                    <Input
                                        status={(isSubmitted && answer.content == '' && question.value !== '') ? 'error' : ''}
                                        placeholder={`Câu trả lời ${aIndex + 1}`}
                                        value={answer.content}
                                        onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)} />
                                    <div className="flex gap-1">
                                        {question.answers.length > 1 && <Tooltip title='Xóa câu trả lời' color="blue"><MinusCircleOutlined onClick={() => removeAnswer(qIndex, aIndex)} style={{ color: 'red', cursor: 'pointer' }} /></Tooltip>}
                                        <Tooltip color="blue" title="Thêm câu trả lời"> <PlusCircleOutlined style={{ color: 'blue', cursor: 'pointer', marginTop: '8px' }} onClick={() => addAnswer(qIndex)} /> </Tooltip>

                                    </div>
                                </div>

                                {isSubmitted && answer.content == '' && question.value !== '' && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Vui lòng không để trống câu trả lời
                                    </p>
                                )}
                            </div>
                        ))}

                        {!question.answers.some(answer => answer.correct === true) && question.value !== '' && isSubmitted && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Bạn chưa chọn đáp án đúng!
                            </p>
                        )}
                        {createQuestions.length > 1 && <Tooltip title='Xóa câu hỏi' color="blue"> <Button type="link" icon={<DeleteFilled />} danger onClick={() => removeQuestion(qIndex)}></Button></Tooltip>}
                    </div>
                ))}

                <Button type="primary" style={{ width: '23%', marginBottom: '5px' }} onClick={addQuestion} >Thêm câu hỏi</Button>
                <div>
                    <span className="text-red-500 mr-2 mb">*</span>Danh sách câu hỏi:
                    <Input.Search
                        placeholder="Tìm kiếm câu hỏi..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginBottom: '8px' }}
                    />
                    <div
                        style={{
                            maxHeight: "200px", // Điều chỉnh chiều cao tối đa tùy ý
                            overflowY: "auto",
                            border: "1px solid #d9d9d9",
                            padding: "8px",
                            borderRadius: "4px",
                            marginTop: '6px'
                        }}
                    >
                        <CheckboxGroup
                            options={filteredQuestions.map((question, index) => ({
                                label: question,
                                value: question,
                            }))}
                            value={checkedList}
                            onChange={onChange}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        />

                    </div>
                </div>

            </Modal >
        </>
    )
}

export default UpdateQuizForm
