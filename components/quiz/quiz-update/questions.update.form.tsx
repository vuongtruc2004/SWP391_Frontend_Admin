'use client'
import { useQuizUpdate } from "@/wrapper/quiz-update/quiz.update.wrapper";
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Checkbox, Drawer, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import QuestionBank from "./question.bank";

const QuestionsUpdateForm = () => {
    const { setCreateQuestions, createQuestions, isSubmitted, selectQuestions } = useQuizUpdate();
    const [openBank, setOpenBank] = useState(false);
    const addQuestion = () => {
        setCreateQuestions([...createQuestions, { id: `c-${Date.now()}-${Math.random()}`, title: "", answers: [{ content: "", correct: false }], errorMessage: "" }]);
    };
    const removeQuestion = (index: number) => {
        setCreateQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, title: string) => {
        const newQuestions = [...createQuestions];
        newQuestions[index].title = title;
        newQuestions[index].errorMessage = '';
        setCreateQuestions(newQuestions);
    };

    const addAnswer = (qIndex: number) => {
        const newQuestions = [...createQuestions];
        newQuestions[qIndex].answers.push({ content: "", correct: false });
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

    useEffect(() => {
        if (createQuestions.length === 0) {
            setCreateQuestions([{ id: 0, title: "", answers: [{ content: "", correct: false }], errorMessage: "" }])
        }
    }, [createQuestions]);

    return (
        <>

            <div className="h-[calc(100vh-61.6px)] overflow-auto p-5 ">
                <Button onClick={() => setOpenBank(true)} variant="outlined" color="blue" className="w-full mb-5" icon={<PlusOutlined />} iconPosition="start">
                    Chọn câu hỏi có sẵn
                </Button>
                {createQuestions.map((question, qIndex) => (
                    <div key={question.id} className="mb-4  p-4  rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)]">
                        <Input
                            status={(question.errorMessage !== '' && createQuestions[0].title != '') ? 'error' : ''}
                            placeholder="Nhập câu hỏi"
                            title={question.title}
                            onChange={(e) => updateQuestion(qIndex, e.target.value)} />

                        {question.errorMessage && createQuestions[0].title != '' && (
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
                                        status={(isSubmitted && answer.content == '' && createQuestions[0].title != '') ? 'error' : ''}
                                        placeholder={`Câu trả lời ${aIndex + 1}`}
                                        title={answer.content}
                                        onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)} />
                                    <div className="flex gap-1">
                                        {question.answers.length > 1 && <Tooltip title='Xóa câu trả lời' color="blue"><MinusCircleOutlined onClick={() => removeAnswer(qIndex, aIndex)} style={{ color: 'red', cursor: 'pointer' }} /></Tooltip>}
                                        <Tooltip color="blue" title="Thêm câu trả lời"> <PlusCircleOutlined style={{ color: 'blue', cursor: 'pointer', marginTop: '8px' }} onClick={() => addAnswer(qIndex)} /> </Tooltip>

                                    </div>

                                </div>

                                {isSubmitted && answer.content == '' && createQuestions[0].title != '' && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Vui lòng không để trống câu trả lời
                                    </p>
                                )}
                                {answer.content.trim().split(/\s+/).length > 50 && createQuestions[0].title != '' && (
                                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                        <WarningOutlined />
                                        Nội dung câu trả lời không được quá 50 từ
                                    </p>
                                )}
                            </div>
                        ))}




                        {createQuestions.length > 1 &&
                            (<Tooltip title='Xóa câu hỏi' color="blue">
                                <Button
                                    type="primary" style={{ width: '5%', height: '5%', marginTop: '8px' }}
                                    icon={<DeleteOutlined />} danger onClick={() => removeQuestion(qIndex)}>
                                </Button>
                            </Tooltip>)}
                        {!question.answers.some(answer => answer.correct === true) && isSubmitted && createQuestions[0].title != '' && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Bạn chưa chọn đáp án đúng!
                            </p>
                        )}
                    </div>
                ))}
                <Button type="primary" style={{ width: '15%', marginBottom: '5px' }} onClick={addQuestion} >Thêm câu hỏi</Button>

            </div>
            <Drawer style={{ width: '400px' }} title="Ngân hàng câu hỏi" placement="left" onClose={() => setOpenBank(false)} open={openBank}>
                <QuestionBank />
            </Drawer>
        </>
    )
}

export default QuestionsUpdateForm
