import CouponTable from "@/components/coupon/coupon.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lí coupon",
};
const CouponPage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
        accepted: string;
    }>
}) => {
    const searchParams = await props.searchParams;
    const page = searchParams.page || 1;
    let filter = ""
    const couponResponse = await sendRequest<ApiResponse<PageDetailsResponse<CouponResponse[]>>>({
        url: `${apiUrl}/coupons/all`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    })
    console.log(">>> check coupon", couponResponse.data);
    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CouponTable
                couponPageResponse={couponResponse.data}
            />


        </div>
    )
}

export default CouponPage