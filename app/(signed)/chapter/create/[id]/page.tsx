import CreateChapter from "@/components/course/create.chapter";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";

const UpdateChapterPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const courseResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
        url: `${apiUrl}/courses/${id}`
    });

    if (courseResponse.status !== 200) {
        throw new Error(courseResponse.message.toString());
    }
    return (
        <div className="bg-white max-w-[1200px] rounded-md shadow-md p-5 mx-auto">
            <h1 className="text-center font-semibold text-xl mb-5">Tạo chương học mới </h1>
            <CreateChapter course={courseResponse.data} />
        </div>
    )
}

export default UpdateChapterPage
