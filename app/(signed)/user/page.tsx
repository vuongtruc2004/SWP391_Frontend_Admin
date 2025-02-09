import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserCreateBtn from "@/components/user/user.create.btn."
import UserSearch from "@/components/user/user.search"
import UserTable from "@/components/user/user.table"
import { isFullNumber } from "@/helper/subject.helper"
import { sendRequest } from "@/utils/fetch.api"
import { apiUrl } from "@/utils/url"

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
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    let filter = ""
    if (isFullNumber(keyword)) {
        filter = `userId : ${keyword}`
    } else {
        filter = `fullname ~ '${keyword}' or email ~ '${keyword}' or role.roleName ~ '${keyword}' `
    }
    const userResponse = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
        url: `${apiUrl}/users`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }

    })
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.roleName !== "ADMIN") {
        if (session.user.roleName === "EXPERT") {
            redirect("/course");
        } else {
            redirect("/blog");
        }
    }
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">

            <UserSearch keyword={keyword} />
            <UserCreateBtn />


            <UserTable
                userPageResponse={userResponse.data}
            />
        </div>
    )
}

export default UserPage