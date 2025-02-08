import CourseSearch from "@/components/course/course.search"
import CourseTable from "@/components/course/course.table"
import { isFullNumber } from "@/helper/subject.helper"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"

const CoursePage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
        accepted: string;
        createdFrom: string;
        createdTo: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    const accepted = searchParams.accepted || "all"
    const createdFrom = searchParams.createdFrom || "";
    const createdTo = searchParams.createdTo || "";

    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `courseId : ${keyword}`
    } else {
        filter = `(courseName ~ '${keyword}' or description ~ '${keyword}' or expert.user.fullname ~ '${keyword}')`
    }

    if (accepted !== "all") {
        filter += ` and accepted : ${accepted === "active" ? true : false}`
    }

    if (createdFrom !== "") {
        filter += ` and createdAt > '${createdFrom}' and createdAt < '${createdTo}'`
    }


    const courseResponse = await sendRequest<ApiResponse<PageDetailsResponse<CourseResponse[]>>>({
        url: `${apiUrl}/courses/all`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
        }
    })

    console.log(">>> checkkk", courseResponse)
    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CourseSearch keyword={keyword} accepted={accepted} createdFrom={createdFrom} createdTo={createdTo} />
            <CourseTable
                coursePageResponse={courseResponse.data}
            />
        </div>
    )
}

export default CoursePage