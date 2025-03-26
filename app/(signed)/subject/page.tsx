import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SubjectPageClient from "@/components/subject/subject.page.client"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"
import { Metadata } from "next";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Quản lý lĩnh vực",
};
const SubjectPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    const filter = `subjectName ~ '${keyword}' or description ~ '${keyword}'`
    const session = await getServerSession(authOptions);

    if (session && session.user.roleName === 'MARKETING') {
        redirect("/blog");
    }

    if (!session) {
        return null;
    }

    const subjectResponse = await sendRequest<ApiResponse<PageDetailsResponse<SubjectResponse[]>>>({
        url: `${apiUrl}/subjects/all`,
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: 'updatedAt,desc'
        }

    })

    const fetchAllSubjects = async () => {
        let allSubjects: SubjectResponse[] = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
            const response = await sendRequest<ApiResponse<PageDetailsResponse<SubjectResponse[]>>>({
                url: `${apiUrl}/subjects/all`,
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                },
                queryParams: {
                    page: currentPage,
                    size: 10,
                    filter: filter
                },
            });

            if (response?.data) {
                allSubjects = [...allSubjects, ...response.data.content];
                totalPages = response.data.totalPages;
            } else {
                break;
            }

            currentPage++;
        } while (currentPage <= totalPages);

        return allSubjects;
    };

    const allSubjects = await fetchAllSubjects();


    return (
        <div className="borde w-full h-[87vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <SubjectPageClient keyword={keyword} subjectPageResponse={subjectResponse.data} allSubjects={allSubjects} />
        </div>
    )
}
export default SubjectPage