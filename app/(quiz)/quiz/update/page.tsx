'use client'
import QuestionsUpdateForm from "@/components/quiz/quiz-update/questions.update.form";
import QuizUpdateForm from "@/components/quiz/quiz-update/quiz.update.form";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";


const UpdateQuizPage = () => {
    const { data: session } = useSession();
    const searchParam = useSearchParams();
    const quizIdStr: string | null = searchParam.get("quizId");
    const quizId: number | undefined = quizIdStr ? Number(quizIdStr) : undefined;

    if (!(session?.user.roleName === 'EXPERT' || session?.user.roleName === 'ADMIN')) {
        return;
    }

    return (
        <div className="grid grid-cols-[1fr_2fr]">
            <QuizUpdateForm quizId={quizId} />
            <QuestionsUpdateForm />

        </div>
    )
}

export default UpdateQuizPage
