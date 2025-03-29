import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PurchaserSearch from "@/components/purchaser/purchaser.search";
import PurchaserTable from "@/components/purchaser/purchaser.table";
import { getAccountType, getGender, getLocked } from "@/helper/create.user.helper";
import { isFullNumber } from "@/helper/subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { getServerSession } from "next-auth";

const PurchaserPage = async ({ params, searchParams }: {
    params: { courseId: number };
    searchParams: {
        keyword?: string;
        page?: string
        locked?: string
        gender?: string
        accountType?: string
    };
}) => {
    const session = await getServerSession(authOptions);
    const courseId = params.courseId;
    const keyword = searchParams.keyword || '';
    const page = searchParams.page || '1';
    const locked = getLocked(searchParams.locked);
    const gender = getGender(searchParams.gender);
    const accountType = getAccountType(searchParams.accountType);
    let filter = '';
    if (isFullNumber(keyword)) {
        filter = `userId : ${keyword}`;
    }
    else {
        filter = `(fullname ~ '${keyword}' or email ~ '${keyword}' or role.roleName ~ '${keyword}')`;
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
    if (accountType !== 'ALL') {
        filter += ` and accountType : '${accountType}'`;
    }
    const userResponse = await sendRequest<ApiResponse<PageDetailsResponse<UserResponse[]>>>({
        url: `${apiUrl}/users/course/${courseId}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }
    });

    return (
        <>
            <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
                <PurchaserSearch courseId={courseId} keyword={keyword} locked={locked} gender={gender} accountType={accountType} />
                <PurchaserTable purchaserPageResponse={userResponse.data} />
            </div>
        </>

    );
};

export default PurchaserPage;
