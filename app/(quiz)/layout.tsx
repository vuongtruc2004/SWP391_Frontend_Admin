import QuizHeader from "@/components/quiz/quiz-create/quiz.header"
import QuizSidebar from "@/components/quiz/quiz.sidebar"


const QuizLayout = async ({ children }: {
    children: React.ReactNode,
}) => {

    return (
        <div>
            <QuizHeader />
            <div className="flex">
                <QuizSidebar />
                {children}
            </div>
        </div>
    )
}

export default QuizLayout
