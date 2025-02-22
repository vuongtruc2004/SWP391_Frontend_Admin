import BlogSearch from "@/components/blog/blog.search";
import BlogTable from "@/components/blog/blog.table";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lí bài viết",
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

    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `blogId : ${keyword}`
    } else {
        filter = `(title ~ '${keyword}' or user.fullname ~ '${keyword}')`
    }

    if (published !== "all") {
        filter += ` and published : ${published === "public" ? true : false}`
    }

    if (createdFrom !== "" && createdTo !== "") {
        filter += ` and createdAt > '${createdFrom}' and createdAt < '${createdTo}'`
    }

    const blogResponse = await sendRequest<ApiResponse<PageDetailsResponse<BlogDetailsResponse[]>>>({
        url: `${apiUrl}/blogs/all`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
        }
    })
    console.log("check", blogResponse)
    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <BlogSearch keyword={keyword} published={published} createdFrom={createdFrom} createdTo={createdTo} />
            <BlogTable blogPageResponse={blogResponse.data} />

        </div>
    )
}

export default BlogPage