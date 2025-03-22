'use client'
import QuestionsUpdateForm from "@/components/quiz/quiz-update/questions.update.form";
import QuizUpdateForm from "@/components/quiz/quiz-update/quiz.update.form";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const UpdateQuizPage = () => {
    const { data: session } = useSession();
    const searchParam = useSearchParams();
    const quizIdStr: string | null = searchParam.get("quizId");
    const quizId: number | undefined = quizIdStr ? Number(quizIdStr) : undefined;
    const [courses, setCourses] = useState<CourseDetailsResponse[]>([]);

    useEffect(() => {
        if (!session) return;

        const fetchCourses = async () => {
            const response = await sendRequest<ApiResponse<CourseDetailsResponse[]>>({
                url: `${apiUrl}/experts/courses/all`,
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });

            if (response.status === 200) {
                setCourses(response.data);

            }
        };

        fetchCourses();
    }, [session]);

    return (
        <div className="flex-1 grid grid-cols-[2fr_1fr]">
            <QuestionsUpdateForm />
            <QuizUpdateForm quizId={quizId} courses={courses} />
        </div>
    )
}

export default UpdateQuizPage
