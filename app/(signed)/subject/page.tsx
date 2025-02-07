import SubjectCreateBtn from "@/components/subject/subject.create.btn."
import SubjectSearch from "@/components/subject/subject.search"
import SubjectTable from "@/components/subject/subject.table"
import { isFullNumber } from "@/helper/subject.helper"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"


const SubjectPage = async (props: {
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
        filter = `subjectId : ${keyword}`
    } else {
        filter = `subjectName ~ '${keyword}' or description ~ '${keyword}'`
    }
    const subjectResponse = await sendRequest<ApiResponse<PageDetailsResponse<SubjectResponse[]>>>({
        url: `${apiUrl}/subjects/all`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }

    })

    return (


        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">

            <SubjectSearch keyword={keyword} />

            <SubjectCreateBtn
                subjectPageResponse={subjectResponse.data}
            />

            <SubjectTable
                subjectPageResponse={subjectResponse.data}
            />
        </div>
    )
}
export default SubjectPage