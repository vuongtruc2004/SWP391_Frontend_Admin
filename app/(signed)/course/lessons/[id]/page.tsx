import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UpdateLessonsForm from "@/components/course-lesson-update/update.lessons.form";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Thêm bài giảng",
};
const CourseDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const session = await getServerSession(authOptions);
    const courseId = (await params).id;

    const courseResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
        url: `${apiUrl}/courses/${courseId}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const quizResponse = await sendRequest<ApiResponse<QuizInfoResponse[]>>({
        url: `${apiUrl}/quizzes/expert`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (courseResponse.status !== 200) {
        throw new Error(courseResponse.message.toString());
    }

    if (quizResponse.status !== 200) {
        throw new Error(quizResponse.message.toString());
    }

    return (
        <UpdateLessonsForm course={courseResponse.data} quizzes={quizResponse.data} />
    )
}

export default CourseDetailsPage
