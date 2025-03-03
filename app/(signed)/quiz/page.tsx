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
        maxAttempts?: string;
        startedFrom?: string;
        startedTo?: string;
        endedFrom?: string;
        endedTo?: string;
        haveTime?: string;
    }>
}) => {
    const searchParam = await props.searchParams;
    const keyword = searchParam.keyword || '';
    const page = searchParam.page || 1;
    const published = getPublished(searchParam.published);
    const maxAttempts = getMaxAttempts(searchParam.maxAttempts);
    const haveTime = getStartedAt(searchParam.haveTime);
    const startedFrom = searchParam.startedFrom || '';
    const startedTo = searchParam.startedTo || '';
    const endedFrom = searchParam.endedFrom || '';
    const endedTo = searchParam.endedTo || '';

    let filters: string[] = [];
    if (keyword !== '') {
        filters.push(`title ~ '${keyword}'`);
    }

    if (published !== 'ALL') {
        filters.push(`published : ${published === 'active' ? true : false}`);
    }
    if (maxAttempts !== '') {
        filters.push(`maxAttempts : ${maxAttempts}`);
    }



    if (haveTime !== 'ALL') {
        filters.push(`startedAt ${haveTime === 'noTime' ? 'is null' : 'is not null'}`);
    }

    if (startedFrom !== '' && startedTo !== '') {
        filters.push(`startedAt > '${startedFrom}' and startedAt < '${startedTo}'`);
    }

    if (endedFrom !== '' && endedTo !== '') {
        filters.push(`endedAt > '${endedFrom}' and endedAt < '${endedTo}'`);
    }

    const filter = filters.length > 0 ? filters.join(" and ") : '';
    const quizResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuizResponse[]>>>({
        url: `${apiUrl}/quiz`,
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
                url: `${apiUrl}/quiz`,
                queryParams: {
                    page: currentPage,
                    size: 10,
                    filter: filter,

                },
            });

            if (!response?.data) break; // Nếu không có dữ liệu, thoát vòng lặp tránh lặp vô hạn

            allQuiz = [...allQuiz, ...response.data.content];
            totalPages = response.data.totalPages;

            if (currentPage >= totalPages) break; // Thêm điều kiện để tránh lặp vô tận
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
                    maxAttempts={maxAttempts}
                    haveTime={haveTime}
                    startedFrom={startedFrom} startedTo={startedTo}
                    endedFrom={endedFrom} endedTo={endedTo}
                    quizPageResponse={quizResponse.data} />
            </div>

        </>
    )
}

export default QuizPage