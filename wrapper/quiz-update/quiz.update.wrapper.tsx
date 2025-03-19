'use client'
import { Form, FormInstance } from "antd";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

interface IQuestionCreate {
    id: number | string;
    title: string;
    answers: {
        content: string;
        correct: boolean;
    }[];
    errorMessage: string;
}

export interface QuizFieldType {
    title: string;
    published: boolean;
    allowSeeAnswers: boolean;
    duration: number;
    chapterId: number;
    courseId: number;
    description: string;
}

interface IQuizCreate {
    createQuestions: IQuestionCreate[];
    setCreateQuestions: Dispatch<SetStateAction<IQuestionCreate[]>>;
    selectQuestions: QuestionResponse[];
    setSelectQuestions: Dispatch<SetStateAction<QuestionResponse[]>>;
    form: FormInstance<any>;
    isSubmitted: boolean;
    setIsSubmitted: Dispatch<SetStateAction<boolean>>;
    currentQuestions: IQuestion[];
    setCurrentQuestions: Dispatch<SetStateAction<IQuestion[]>>;
}

interface IQuestion {
    id: number | string;
    title: string;
    multipleAnswers: boolean;
}

const QuizUpdateContext = createContext<IQuizCreate | null>(null);

export const QuizUpdateWrapper = ({ children }: { children: React.ReactNode }) => {
    const [form] = Form.useForm();
    const [createQuestions, setCreateQuestions] = useState<IQuestionCreate[]>([{ id: '0', title: "", answers: [{ content: "", correct: false }], errorMessage: "" }]);
    const [selectQuestions, setSelectQuestions] = useState<QuestionResponse[]>([]);
    const [currentQuestions, setCurrentQuestions] = useState<IQuestion[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const questions: IQuestion[] = [];

        selectQuestions.forEach(question => {
            if (question.title.trim().length) {
                questions.push({
                    id: question.questionId,
                    title: question.title,
                    multipleAnswers: question.answers.filter(answer => answer.correct).length > 1
                });
            }
        });
        createQuestions.forEach((question, index) => {
            if (question.title.trim().length) {
                questions.push({
                    id: question.id,
                    title: question.title,
                    multipleAnswers: question.answers.filter(answer => answer.correct).length > 1
                });
            }
        });

        setCurrentQuestions(questions);
    }, [selectQuestions, createQuestions]);

    return (
        <QuizUpdateContext.Provider value={{
            createQuestions,
            setCreateQuestions,
            selectQuestions,
            setSelectQuestions,
            form,
            isSubmitted,
            setIsSubmitted,
            currentQuestions,
            setCurrentQuestions
        }}>
            {children}
        </QuizUpdateContext.Provider>
    )
}

export const useQuizUpdate = () => {
    const context = useContext(QuizUpdateContext);
    if (!context) {
        throw new Error("Loi");
    }
    return context;
}
