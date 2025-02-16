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
        locked?: string;
        roleName?: string;
        gender?: string;

    }>
}) => {
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || "";
    const page = searchParams.page || 1;
    const roleName = searchParams.roleName || "ALL";
    const locked = searchParams.locked || "ALL";
    const gender = searchParams.gender || "ALL";

    let filter = '';
    if (isFullNumber(keyword)) {
        filter = `userId : ${keyword}`;
    }
    else {
        filter = `(fullname ~ '${keyword}' or email ~ '${keyword}' or role.roleName ~ '${keyword}')`;
    }
    console.log('keyword>>>>', keyword);
    if (roleName !== 'ALL') {
        filter += ` and role.roleName ~ '${roleName}'`;
    }
    if (locked !== 'ALL') {
        filter += `and locked : ${locked === 'active' ? false : true}`;
    }
    if (gender !== 'ALL') {
        filter += ` and gender ~ '${gender}'`;
    }
    console.log("filter?????", filter);
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
        let totalPages = 1; // Giả định số trang ban đầu là 1

        do {
            const response = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
                url: `${apiUrl}/users`,
                queryParams: {
                    page: currentPage,
                    size: 10, // Kích thước mỗi trang
                    filter: filter
                },
            });

            if (response?.data) {
                allUsers = [...allUsers, ...response.data.content]; // Gộp dữ liệu từ từng trang
                totalPages = response.data.totalPages; // Lấy tổng số trang từ API
            } else {
                break; // Nếu không có dữ liệu, thoát vòng lặp
            }

            currentPage++; // Tăng trang để lấy dữ liệu tiếp theo
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
