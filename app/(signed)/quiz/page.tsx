import QuizPageClient from "@/components/quiz/quiz.page.client";
import { getMaxAttempts, getPublished, getStartedAt } from "@/helper/create.quiz.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lí bài kiểm tra",
};

const QuizPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
        published?: string;
        createdFrom?: string;
        createdTo?: string;
    }>
}) => {
    const searchParam = await props.searchParams;
    const keyword = searchParam.keyword || '';
    const page = searchParam.page || 1;
    const published = getPublished(searchParam.published);
    const createdFrom = searchParam.createdFrom || '';
    const createdTo = searchParam.createdTo || '';


    let filters: string[] = [];
    if (keyword !== '') {
        filters.push(`title ~ '${keyword}'`);
    }

    if (published !== 'ALL') {
        filters.push(`published : ${published === 'active' ? true : false}`);
    }
    if (createdFrom != '') {
        filters.push(` createdAt > '${createdFrom}'`);
    }
    if (createdTo != '') {
        filters.push(` createdAt < '${createdTo}'`);
    }



    const filter = filters.length > 0 ? filters.join(" and ") : '';
    const quizResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuizResponse[]>>>({
        url: `${apiUrl}/quizzes`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    })

    console.log("quizResponse>>", quizResponse);
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




    return (
        <>
            <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">

                <QuizPageClient
                    allQuiz={allQuiz}
                    keyword={keyword}
                    published={published}
                    createdFrom={createdFrom}
                    createdTo={createdTo}
                    quizPageResponse={quizResponse.data} />
            </div>

        </>
    )
}

export default QuizPage