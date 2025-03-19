import QuizHeader from "@/components/quiz/quiz-update/quiz.header"
import QuizUpdateSidebar from "@/components/quiz/quiz-update/quiz.sidebar"
import { QuizUpdateWrapper } from "@/wrapper/quiz-update/quiz.update.wrapper"


const QuizLayout = async ({ children }: {
    children: React.ReactNode,
}) => {

    return (
        <QuizUpdateWrapper>
            <div>
                <QuizHeader />
                <div className="flex">
                    <QuizUpdateSidebar />
                    {children}
                </div>
            </div>
        </QuizUpdateWrapper>
    )
}

export default QuizLayout
