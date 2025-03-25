import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlogSearch from "@/components/blog/blog.search";
import BlogTable from "@/components/blog/blog.table";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Quản lý bài viết",
};

const BlogPage = async (props: {
    searchParams: Promise<{
        keyword: string,
        page: string,
        published: string,
        createdFrom: string,
        createdTo: string
    }>
}) => {

    const searchParam = await props.searchParams
    const keyword = searchParam.keyword || ""
    const page = searchParam.page || 1
    const published = searchParam.published || "all"
    const createdFrom = searchParam.createdFrom || ""
    const createdTo = searchParam.createdTo || ""
    const session = await getServerSession(authOptions);

    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `blogId : ${keyword}`
    } else {
        filter = `(title ~ '${keyword}' or user.fullname ~ '${keyword}')`
    }

    if (published !== "all") {
        filter += ` and published : ${published === "public" ? true : false}`
    }

    if (createdFrom !== "" || createdTo !== "") {
        filter += ` and createdAt > '${createdFrom}' or createdAt < '${createdTo}'`
    }

    const blogResponse = await sendRequest<ApiResponse<PageDetailsResponse<BlogDetailsResponse[]>>>({
        url: `${apiUrl}/blogs/all`,
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    })
    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <BlogSearch keyword={keyword} published={published} createdFrom={createdFrom} createdTo={createdTo} />
            <BlogTable blogPageResponse={blogResponse.data} />
        </div>
    )
}

export default BlogPage