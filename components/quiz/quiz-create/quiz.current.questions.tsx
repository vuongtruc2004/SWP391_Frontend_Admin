'use client'
import { useQuizCreate } from "@/wrapper/quiz-create/quiz.create.wrapper";
import { DeleteOutlined, WarningOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Tooltip } from "antd"
import { BiSelectMultiple } from "react-icons/bi";
import { VscDiffSingle } from "react-icons/vsc";

const QuizCurrentQuestions = () => {
    const { currentQuestions, isSubmitted, createQuestions, selectQuestions, setCreateQuestions, setCurrentQuestions, setSelectQuestions } = useQuizCreate();
    const confirm = () => {
        setCreateQuestions([]);
        setSelectQuestions([]);
        setCurrentQuestions([]);
    }
    const handelDeleteQuestion = (id: number | string) => {
        setCreateQuestions(prev => {
            const newQuestions = prev.filter(q => q.id !== id);
            return newQuestions.length === 0
                ? [{ id: `c-${Date.now()}-${Math.random()}`, title: "", answers: [{ content: "", correct: false }], errorMessage: "" }]
                : newQuestions;
        });

        setSelectQuestions(prev => prev.filter(q => q.questionId !== id));
        setCurrentQuestions(prev => prev.filter(q => q.id !== id));
    };

    return (
        <div className="shrink-0 border border-r-gray-300 h-[calc(100vh-61.6px)] sticky top-0 left-0">
            <div className="flex-col py-2 px-3">
                <div className="flex items-center justify-between">
                    <h1>Bài kiểm tra đang có <span className="text-blue-500 font-semibold">{currentQuestions.length}</span> câu hỏi</h1>

                    <Tooltip color='blue' title='Xóa tất cả câu hỏi'>
                        <Popconfirm
                            title="Xóa tất cả câu hỏi"
                            description="Bạn có muốn xóa toàn bộ câu hỏi không?"
                            onConfirm={confirm}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </div>

                {createQuestions[0]?.title === '' && selectQuestions.length === 0 && isSubmitted ? <p className='text-red-500 text-base ml-2 flex items-center gap-x-1'>
                    <WarningOutlined />
                    Bạn chưa chọn câu hỏi!
                </p> : ''}
            </div>

            <ul className="flex flex-col gap-y-3 p-3 overflow-auto h-[calc(100vh-61.6px-48px)]">
                {currentQuestions.map((question, index) => {
                    return (
                        <li className="flex flex-col gap-3 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] p-3" key={question.title + index}>
                            <div className="flex gap-2"><span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center shrink-0 ">{index + 1} </span>{question.title}</div>
                            <div className="flex justify-between">
                                {question.multipleAnswers ? <span className="inline-flex gap-1 items-center bg-gray-200 rounded-md shadow-[0_0_5px_rgba(0,0,0,0.3)] px-1 py-1" ><BiSelectMultiple className="text-lg " />Chọn nhiều đáp án</span>
                                    : <div className="inline-flex gap-1 items-center bg-gray-200 rounded-md shadow-[0_0_5px_rgba(0,0,0,0.3)] px-1 py-1"><VscDiffSingle className="text-lg" />Chọn một đáp án</div>}

                                <Tooltip color="blue" title='Xóa câu hỏi này'>
                                    <Button type="text" danger icon={<DeleteOutlined />}
                                        onClick={() => {
                                            handelDeleteQuestion(question.id)
                                        }}>
                                    </Button>
                                </Tooltip>
                            </div>

                        </li>

                    )
                })}
            </ul>
        </div>
    )
}

export default QuizCurrentQuestions
