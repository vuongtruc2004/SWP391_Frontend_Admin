import QuizHeader from "@/components/quiz/quiz-create/quiz.header"
import QuizSidebar from "@/components/quiz/quiz-create/quiz.sidebar"
import QuizTable from "@/components/quiz/quiz-list/quiz.table"
import { QuizCreateWrapper } from "@/wrapper/quiz-create/quiz.create.wrapper"


const QuizLayout = async ({ children }: {
    children: React.ReactNode,
}) => {

    return (
        <QuizCreateWrapper>
            <div>
                <QuizHeader />
                <div className="flex">
                    <QuizSidebar />
                    {children}
                </div>
            </div>
        </QuizCreateWrapper>
    )
}

export default QuizLayout
