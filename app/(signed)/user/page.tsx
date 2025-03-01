import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import UserPageClient from "@/components/user/user.page.client";
import { getGender, getLocked, getRoleName } from "@/helper/create.user.helper";

export const metadata: Metadata = {
    title: "Quản lí người dùng",
};

const UserPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
        locked?: string;
        roleName?: string;
        gender?: string;

    }>
}) => {
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || "";
    const page = searchParams.page || 1;
    const roleName = getRoleName(searchParams.roleName);
    const locked = getLocked(searchParams.locked);
    const gender = getGender(searchParams.gender);

    let filter = '';
    if (isFullNumber(keyword)) {
        filter = `userId : ${keyword}`;
    }
    else {
        filter = `(fullname ~ '${keyword}' or email ~ '${keyword}' or role.roleName ~ '${keyword}')`;
    }

    if (roleName !== 'ALL') {
        filter += ` and role.roleName ~ '${roleName}'`;
    }
    if (locked !== 'ALL') {
        filter += `and locked : ${locked === 'active' ? false : true}`;
    }
    if (gender !== 'ALL') {
        if (gender == 'null') {
            filter += ` and gender is null`;
        } else {
            filter += ` and gender : '${gender}'`;
        }

    }

    const userResponse = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
        url: `${apiUrl}/users`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }
    });

    const fetchAllUsers = async () => {
        let allUsers: UserResponse[] = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
            const response = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
                url: `${apiUrl}/users`,
                queryParams: {
                    page: currentPage,
                    size: 10,
                    filter: filter
                },
            });

            if (response?.data) {
                allUsers = [...allUsers, ...response.data.content];
                totalPages = response.data.totalPages;
            } else {
                break;
            }

            currentPage++;
        } while (currentPage <= totalPages);

        return allUsers;
    };

    const allUsers = await fetchAllUsers();
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.roleName !== "ADMIN") {
        redirect(session.user.roleName === "EXPERT" ? "/course" : "/blog");
    }

    return <UserPageClient
        keyword={keyword}
        userResponse={userResponse.data}
        allUsers={allUsers}
        roleName={roleName}
        locked={locked}
        gender={gender} />;
};

export default UserPage;
