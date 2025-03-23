import QuizHeader from "@/components/quiz/quiz-update/quiz.header"
import { QuizUpdateWrapper } from "@/wrapper/quiz-update/quiz.update.wrapper"
import QuizCurrentQuestion from "@/components/quiz/quiz-update/quiz.current.question"


const QuizLayout = async ({ children }: {
    children: React.ReactNode,
}) => {

    return (
        <QuizUpdateWrapper>
            <div>
                <QuizHeader />
                <div className=" grid grid-cols-[3fr_1fr]">
                    {children}
                    <QuizCurrentQuestion />
                </div>
            </div>
        </QuizUpdateWrapper>
    )
}

export default QuizLayout
