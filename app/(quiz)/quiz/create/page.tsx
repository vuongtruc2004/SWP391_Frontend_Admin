import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import QuestionsCreateForm from "@/components/quiz/quiz-create/questions.create.form";
import QuizCreateForm from "@/components/quiz/quiz-create/quiz.create.form";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { getServerSession } from "next-auth"


const CreateQuizPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return null;
    }
    const coursesResponse = await sendRequest<ApiResponse<CourseDetailsResponse[]>>({
        url: `${apiUrl}/experts/courses/all`,
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
    console.log("coursesResponse>>", coursesResponse)
    if (coursesResponse.status !== 200) {
        return null;
    }


    return (
        <div className="flex-1 grid grid-cols-[2fr_1fr]">
            <QuestionsCreateForm />
            <QuizCreateForm courses={coursesResponse.data} />
        </div>
    )
}

export default CreateQuizPage
