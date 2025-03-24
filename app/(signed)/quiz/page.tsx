import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import QuizPageClient from "@/components/quiz/quiz-list/quiz.page.client";
import { getAllowSeeAnswers, getDuration, getPublished } from "@/helper/create.quiz.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Quản lý bài kiểm tra",
};

const QuizPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
        published?: string;
        allowSeeAnswers: string;
        createdFrom?: string;
        createdTo?: string;
        durationFrom: string;
        durationTo: string;
    }>
}) => {
    const session = await getServerSession(authOptions);
    const searchParam = await props.searchParams;
    const keyword = searchParam.keyword || '';
    const page = searchParam.page || 1;
    const published = getPublished(searchParam.published);
    const allowSeeAnswers = getAllowSeeAnswers(searchParam.allowSeeAnswers);
    const createdFrom = searchParam.createdFrom || '';
    const createdTo = searchParam.createdTo || '';
    const durationFrom = getDuration(searchParam.durationFrom || '');
    const durationTo = getDuration(searchParam.durationTo || '');
    let filters: string[] = [];
    if (keyword !== '') {
        filters.push(`(title ~ '${keyword}' or chapter.title ~ '${keyword}' or chapter.course.courseName ~ '${keyword}')`);
    }

    if (published !== 'ALL') {
        filters.push(`published : ${published === 'open' ? true : false}`);
    }
    if (allowSeeAnswers !== 'ALL') {
        filters.push(` allowSeeAnswers : ${allowSeeAnswers === 'open' ? true : false}`)
    }
    if (createdFrom != '') {
        filters.push(` createdAt >: '${createdFrom}'`);
    }
    if (createdTo != '') {
        filters.push(` createdAt <: '${createdTo}'`);
    }

    if (durationFrom != '') {
        filters.push(` duration >: ${durationFrom}`);
    }
    if (durationTo != '') {
        filters.push(` duration <: ${durationTo}`);
    }



    const filter = filters.length > 0 ? filters.join(" and ") : '';
    const quizResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuizResponse[]>>>({
        url: `${apiUrl}/quizzes`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    })

    const fetchAllQuiz = async () => {
        let allQuiz: QuizResponse[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
            const response = await sendRequest<ApiResponse<PageDetailsResponse<QuizResponse[]>>>({
                url: `${apiUrl}/quizzes`,
                queryParams: {
                    page: currentPage,
                    size: 10,
                    filter: filter,

                },
            });

            if (!response?.data) break;

            allQuiz = [...allQuiz, ...response.data.content];
            totalPages = response.data.totalPages;

            if (currentPage >= totalPages) break;
            currentPage++;
        }

        return allQuiz;
    };

    const allQuiz = await fetchAllQuiz();


    console.log("quizREsponse>>", quizResponse.data)

    return (
        <>
            <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">

                <QuizPageClient
                    allQuiz={allQuiz}
                    keyword={keyword}
                    published={published}
                    allowSeeAnswers={allowSeeAnswers}
                    createdFrom={createdFrom}
                    createdTo={createdTo}
                    durationFrom={durationFrom}
                    durationTo={durationTo}
                    quizPageResponse={quizResponse.data} />
            </div>

        </>
    )
}

export default QuizPage