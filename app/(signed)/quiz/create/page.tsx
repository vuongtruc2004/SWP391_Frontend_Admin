'use client'
import React from 'react'

import { validDate, validMaxAttempts, validTitle } from "@/helper/create.quiz.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DeleteOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, DatePickerProps, Input, notification, Select, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
const initState: ErrorResponse = {
    error: false,
    value: ''

}
const CreateQuizPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [maxAttempts, setMaxAttempts] = useState<ErrorResponse>(initState);

    const [published, setPublished] = useState<ErrorResponse>({
        ...initState,
        value: 'active'
    });


    const [startedAt, setStartedAt] = useState<ErrorResponse>(initState);
    const [endedAt, setEndedAt] = useState<ErrorResponse>(initState);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [createQuestions, setCreateQuestions] = useState([{ value: "", answers: [{ content: "", correct: false, empty: true }], errorMessage: "" }]);
    const CheckboxGroup = Checkbox.Group;
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [questionList, setQuestionList] = useState<string[]>([]);
    const [searchText, setSearchText] = useState("");
    const quantityQuestion = useState<number>(0);

    useEffect(() => {
        fetchQuestions();
    }, []);


    const fetchQuestions = async () => {
        try {
            const questionResponse = await sendRequest<ApiResponse<QuestionResponse[]>>({
                url: `${apiUrl}/questions/all-inpagination`,
            });
            console.log("questionResponse>>>", questionResponse)
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
        // Kiểm tra nếu có bất kỳ câu trả lời nào được đánh dấu là đúng (correct: true)
        const hasCorrectAnswer = createQuestions.some(q =>
            q.answers.some(a => a.correct === true)
        );

        hasError = !hasCorrectAnswer

        const updatedQuestions = createQuestions.map(q => {
            if (q.value.trim() === "") {
                hasError = true;
                return { ...q, errorMessage: "Vui lòng không để trống câu hỏi" };
            }
            if (questionValues.filter(v => v === q.value.trim().toLowerCase()).length > 1) {
                hasError = true;
                return { ...q, errorMessage: "Vui lòng không tạo câu hỏi giống nhau" };
            }
            return { ...q, errorMessage: "" };
        });

        setCreateQuestions(updatedQuestions);
        if (!isValidTitle) return;



        const existingQuizResponse = await sendRequest<ApiResponse<QuizResponse>>({
            url: `${apiUrl}/quiz/${(title.value.trim())}`,
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



        const updatedQuestionsWithAnswers = updatedQuestions.map(q => ({
            ...q,
            answers: q.answers.map(a => ({
                ...a,
                empty: a.content.trim() === "",
            })),
        }));

        setCreateQuestions(updatedQuestionsWithAnswers);


        // Nếu có lỗi thì dừng lại
        if (hasCheckedList) {
            hasError = false; // Nếu có phần tử trong checkedList, bỏ qua lỗi câu hỏi & câu trả lời
        }
        if (hasError || !isValidTitle || !isValidMaxAttempts || !isValidDate) {
            return;
        }
        console.log("co loi>>>>>>", hasError);

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

            console.log("Danh sách answerId:", createAnswerResponses);

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
                title: title.value,
                maxAttempts: Number(maxAttempts.value),
                published: published.value == 'active' ? true : false,
                startedAt: startedAt.value !== '' ? dayjs(startedAt.value).format("YYYY-MM-DD HH:mm:ss") : '',
                endedAt: endedAt.value !== '' ? dayjs(endedAt.value).format("YYYY-MM-DD HH:mm:ss") : '',
                questions: [...checkedList, ...createQuestionResponses.filter(q => q !== null) as string[]]
            }

            console.log("quizRequest>>>>", quizRequest);

            const createQuizResponse = await sendRequest<ApiResponse<QuizResponse>>({
                url: `${apiUrl}/quiz`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: quizRequest
            });

            console.log("createQuizResponse>>", createQuizResponse);

            if (createQuizResponse.status === 201) {
                handleCancel();
                await fetchQuestions();
                router.push("/quiz");
                notification.success({
                    message: "Thành công",
                    description: createQuizResponse.message.toString(),
                });
            } else {
                setTitle({
                    ...title,
                    error: true,
                    message: createQuizResponse.message.toString()
                });
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
        router.push("/quiz");
        setTitle(initState);
        setMaxAttempts(initState);
        setStartedAt(initState);
        setEndedAt(initState);
        setIsSubmitted(false);
        setCreateQuestions([{ value: "", answers: [{ content: "", correct: false, empty: true }], errorMessage: "" }]);
        setCheckedList([]);
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
        <div className='grid grid-cols-[1.2fr_1fr] gap-5 sticky top-0 left-0 h-full max-h-full'>
            <div className='bg-white p-5 rounded-md shadow-md overflow-auto'>

                <div className="mb-3">
                    <h1 className='font-semibold text-lg mb-2'>Tạo bài kiểm tra</h1>
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
                            status={(question.errorMessage !== '' && !(checkedList.length > 0)) ? 'error' : ''}
                            placeholder="Nhập câu hỏi"
                            value={question.value}
                            onChange={(e) => updateQuestion(qIndex, e.target.value)} />

                        {question.errorMessage && !(checkedList.length > 0) && (
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
                                        status={(isSubmitted && answer.content == '' && !(checkedList.length > 0)) ? 'error' : ''}
                                        placeholder={`Câu trả lời ${aIndex + 1}`}
                                        value={answer.content}
                                        onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)} />
                                    <div className="flex gap-1">
                                        {question.answers.length > 1 && <Tooltip title='Xóa câu trả lời' color="blue"><MinusCircleOutlined onClick={() => removeAnswer(qIndex, aIndex)} style={{ color: 'red', cursor: 'pointer' }} /></Tooltip>}
                                        <Tooltip color="blue" title="Thêm câu trả lời"> <PlusCircleOutlined style={{ color: 'blue', cursor: 'pointer', marginTop: '8px' }} onClick={() => addAnswer(qIndex)} /> </Tooltip>

                                    </div>

                                </div>

                                {isSubmitted && answer.content == '' && !(checkedList.length > 0) && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Vui lòng không để trống câu trả lời
                                    </p>
                                )}
                            </div>
                        ))}




                        {createQuestions.length > 1 && <Tooltip title='Xóa câu hỏi' color="blue"> <Button type="primary" style={{ width: '5%', height: '5%', marginTop: '8px' }} icon={<DeleteOutlined />} danger onClick={() => removeQuestion(qIndex)}></Button></Tooltip>}
                        {!question.answers.some(answer => answer.correct === true) && isSubmitted && !(checkedList.length > 0) && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Bạn chưa chọn đáp án đúng!
                            </p>
                        )}
                    </div>
                ))}

                <div className='flex justify-between'>
                    <Button type="primary" style={{ width: '18%', marginBottom: '20px' }} onClick={addQuestion} >Thêm câu hỏi</Button>
                    <div className='flex gap-3'>
                        <Link href="/quiz"> <Button type="default" style={{ background: 'red', color: 'white' }} onClick={handleCancel}>Hủy</Button></Link>
                        <Button type="primary" onClick={handleOk}>Tạo</Button>
                    </div>

                </div>






            </div>

            <div className='bg-white rounded-md shadow-md overflow-auto relative'>
                <div className='sticky left-0 top-0 bg-white z-10 p-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <h1 className='font-semibold text-lg'>Danh sách câu hỏi</h1>
                        <p className='text-gray-500 text-sm'>Bài kiểm tra này đang có <strong className='text-blue-500'>{12}</strong> câu hỏi</p>
                    </div>

                    <Input.Search
                        placeholder="Tìm kiếm câu hỏi..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

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
                        rowGap: '12px',
                        overflow: 'auto',
                        padding: '20px',
                        paddingTop: 0
                    }}
                />
            </div>
        </div>
    )
}

export default CreateQuizPage
