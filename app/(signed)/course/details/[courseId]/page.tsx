import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ViewCourseDetail from "@/components/course/view.course.detail";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { ConfigProvider } from "antd";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Quản lý khóa học",
};
const CourseDetailsPage = async (props: {
  params: Promise<{
    courseId: string;
  }>;
}) => {
  const session = await getServerSession(authOptions);
  const searchParams = await props.params;
  const courseId = searchParams.courseId || "";

  const courseDetail = await sendRequest<ApiResponse<CourseDetailsResponse>>({
    url: `${apiUrl}/courses/get-course/${courseId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return (
    <>
      <div className="w-full flex flex-col relative">
        <ConfigProvider
          theme={{
            components: {
              Rate: {
                starBg: "#ced4da",
              },
            },
          }}>
          <ViewCourseDetail courseDetail={courseDetail.data} />
        </ConfigProvider>
      </div>
    </>
  );
};

export default CourseDetailsPage;
