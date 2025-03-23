import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import QuestionsCreateForm from "@/components/quiz/quiz-create/questions.create.form"
import QuizCreateForm from "@/components/quiz/quiz-create/quiz.create.form"
import QuizHeader from "@/components/quiz/quiz-create/quiz.header"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"
import { QuizCreateWrapper } from "@/wrapper/quiz-create/quiz.create.wrapper"
import { getServerSession } from "next-auth"
import QuizCurrentQuestions from "@/components/quiz/quiz-create/quiz.current.questions"

const QuizCreatePage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
    const session = await getServerSession(authOptions);
    const courseId = (await params).courseId;
    if (!session) {
        return null;
    }

    const courseResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
        url: `${apiUrl}/courses/get-course/${courseId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`
        },
    });

    return (
        <QuizCreateWrapper>
            <div>
                <QuizHeader course={courseResponse.data} />
                <div className="flex">
                    <QuizCreateForm course={courseResponse.data} />
                    <div className="flex-1 grid grid-cols-[2fr_1fr]">
                        <QuestionsCreateForm />
                        <QuizCurrentQuestions />
                    </div>
                </div>
            </div>
        </QuizCreateWrapper>
    )
}

export default QuizCreatePage
