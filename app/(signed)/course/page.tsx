import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CourseCreateBtn from "@/components/course/course.create.btn"
import CourseSearch from "@/components/course/course.search"
import CourseTable from "@/components/course/course.table"
import { isFullNumber } from "@/helper/subject.helper"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
    title: "Quản lý khóa học",
};
const CoursePage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
        accepted: string;
        createdFrom: string;
        createdTo: string;
        minPrice: string;
        maxPrice: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    const accepted = searchParams.accepted || "all"
    const createdFrom = searchParams.createdFrom || "";
    const createdTo = searchParams.createdTo || "";
    const priceFrom = searchParams.minPrice || "";
    const priceTo = searchParams.maxPrice || "";
    const session = await getServerSession(authOptions);

    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `courseId : ${keyword}`
    } else {
        filter = `(courseName ~ '${keyword}' or expert.user.fullname ~ '${keyword}')`
    }

    if (accepted !== "all") {
        filter += ` and accepted : ${accepted === "active" ? true : false}`
    }

    if (createdFrom !== "" || createdTo !== "") {
        filter += ` and createdAt > '${createdFrom}' or createdAt < '${createdTo}'`
    }

    if (priceFrom !== "" && priceTo !== "") {
        filter += ` and price >: ${priceFrom} and price <: ${priceTo}`
    }

    const courseResponse = await sendRequest<ApiResponse<PageDetailsResponse<CourseDetailsResponse[]>>>({
        url: `${apiUrl}/courses/all`,
        headers: {
            "Authorization": `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    })

    const priceResponse = await sendRequest<ApiResponse<MinMaxPriceResponse>>({
        url: `${apiUrl}/courses/price-range`,
    });

    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CourseSearch keyword={keyword} accepted={accepted} createdFrom={createdFrom} createdTo={createdTo} minPrice={priceResponse.data.minPrice} maxPrice={priceResponse.data.maxPrice} />
            <div className="flex justify-end mr-7 mt-[-50px]">
                <CourseCreateBtn
                    coursePageResponse={courseResponse.data}
                />
            </div>
            <CourseTable
                coursePageResponse={courseResponse.data}
            />
        </div>
    )
}

export default CoursePage