import NotificationTable from "@/components/notification/notification.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Quản lí thông báo",
};

const NotificationPage = async (props: {
    searchParams: Promise<{
        page: string,
        keyword: string,
    }>
}) => {
    const searchParam = await props.searchParams;
    const page = searchParam.page || 1;
    const keyword = searchParam.keyword || '';

    let filter = "";
    const notificationRes = await sendRequest<ApiResponse<PageDetailsResponse<NotificationResponse[]>>>({
        url: `${apiUrl}/notifications/admin`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: 'updatedAt,desc'
        }
    });


    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <NotificationTable
                notificationPageResponse={notificationRes.data}
            />
        </div>
    )
}

export default NotificationPage
