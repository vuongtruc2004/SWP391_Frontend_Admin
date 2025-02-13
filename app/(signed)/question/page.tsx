import QuestionCreateBtn from "@/components/question/question.create.btn.";
import QuestionSearch from "@/components/question/question.search";
import QuestionTable from "@/components/question/question.table";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lí câu hỏi",
};

const QuestionPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
    }>
}) => {
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `questionId : ${keyword}`
    } else {
        filter = `title ~ '${keyword}'`
    }

    const questionResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuestionResponse[]>>>({
        url: `${apiUrl}/questions`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }

    })
    console.log(">>>", questionResponse)

    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <QuestionSearch keyword={keyword} />

            <QuestionCreateBtn
                questionPageResponse={questionResponse.data}
            />

            <QuestionTable
                questionPageResponse={questionResponse.data}
            />
        </div>
    );
}

export default QuestionPage;
