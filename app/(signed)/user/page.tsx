import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import UserPageClient from "@/components/user/user.page.client";

export const metadata: Metadata = {
    title: "Quản lí người dùng",
};

const UserPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
    }>
}) => {
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || "";
    const page = searchParams.page || 1;

    let filter = isFullNumber(keyword)
        ? `userId : ${keyword}`
        : `fullname ~ '${keyword}' or email ~ '${keyword}' or role.roleName ~ '${keyword}'`;

    const userResponse = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
        url: `${apiUrl}/users`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }
    });

    const session = await getServerSession(authOptions);
    if (session?.user && session.user.roleName !== "ADMIN") {
        redirect(session.user.roleName === "EXPERT" ? "/course" : "/blog");
    }

    return <UserPageClient keyword={keyword} userResponse={userResponse.data} />;
};

export default UserPage;
