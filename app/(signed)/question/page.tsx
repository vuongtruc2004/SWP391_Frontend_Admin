import QuestionTable from "@/components/question/question.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Quản lí câu hỏi",
};

const QuestionPage = async () => {
    const questionPageResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuestionResponse[]>>>({
        url: `${apiUrl}/questions`
    })
    console.log(questionPageResponse);
    return (
        <QuestionTable questionPageResponse={questionPageResponse.data} />
    )
}

export default QuestionPage