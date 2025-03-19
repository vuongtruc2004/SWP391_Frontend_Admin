'use client'
import ViewQuizDetail from '@/components/quiz/quiz-list/view.quiz.detail';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import React, { useState, useEffect, use } from 'react';

const QuizDetailPage = ({ params }: { params: Promise<{ quizId: number }> }) => {
    const { quizId } = use(params);
    const [quizDetail, setQuizDetail] = useState<QuizResponse | null>(null);
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await sendRequest<ApiResponse<QuizResponse>>({
                    url: `${apiUrl}/quizzes/${quizId}`

                });
                setQuizDetail(response.data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };
        fetchQuiz();
    }, [quizId]);

    return (
        <>  <div className="borde w-full min-h-screen bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            {quizDetail ? <ViewQuizDetail quizDetail={quizDetail} /> : <p>Loading...</p>}
        </div>

        </>
    );
};

export default QuizDetailPage;
