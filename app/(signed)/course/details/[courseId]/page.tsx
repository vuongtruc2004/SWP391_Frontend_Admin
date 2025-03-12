import ViewCourseDetail from "@/components/course/view.course.detail"
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { ConfigProvider } from "antd";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Quản lí khóa học",
};
const CourseDetailsPage = async (props: {
    params: Promise<{
        courseId: string
    }>
}) => {
    const searchParams = await props.params;
    const courseId = searchParams.courseId || "";

    const courseDetail = await sendRequest<ApiResponse<CourseDetailsResponse>>({
        url: `${apiUrl}/courses/get-course/${courseId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const expertDetail = await sendRequest<ApiResponse<ExpertDetailsResponse>>({
        url: `${apiUrl}/experts/${courseDetail.data.expert.user.userId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log("course, ", courseDetail);



    return (
        <>


            <div className='w-full flex flex-col relative'>
                <ConfigProvider theme={{
                    components: {
                        Rate: {
                            starBg: '#ced4da'
                        }
                    }
                }}>
                    <ViewCourseDetail courseDetail={courseDetail.data} expertDetail={expertDetail.data} />
                </ConfigProvider>
            </div>

        </>

    )
}

export default CourseDetailsPage
