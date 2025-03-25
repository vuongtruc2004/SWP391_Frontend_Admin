import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CouponCreateBtn from "@/components/coupon/coupon.create.btn";
import CouponSearch from "@/components/coupon/coupon.search";
import CouponTable from "@/components/coupon/coupon.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Quản lý coupon",
};

const CouponPage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
        couponCode: string;
        couponName: string;
        minPrice: string;
        maxPrice: string;
    }>
}) => {
    const session = await getServerSession(authOptions);
    const searchParams = await props.searchParams;
    const page = searchParams.page || "1";
    const keyword = searchParams.keyword || "";
    const couponCode = searchParams.couponCode || "";
    const couponName = searchParams.couponName || "";
    const minOrderPrice = searchParams.minPrice || '';
    const maxOrderPrice = searchParams.maxPrice || "";

    let filter = "";

    filter = `(couponName ~ '${keyword.trim()}' or couponCode ~ '${keyword.trim()}')`
    if (minOrderPrice !== "" && maxOrderPrice !== "") {
        filter += ` and minOrderValue >: ${minOrderPrice} and minOrderValue <: ${maxOrderPrice}`
    }
    const couponResponse = await sendRequest<ApiResponse<PageDetailsResponse<CouponResponse[]>>>({
        url: `${apiUrl}/coupons/all`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "createdAt,desc"
        }
    });

    console.log(couponResponse);


    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CouponSearch
                keyword={keyword}
                couponCode={couponCode}
                couponName={couponName}
                minPrice={minOrderPrice}
                maxPrice={maxOrderPrice}
            />
            <div className="flex justify-end mr-7 mt-[-50px]">
                <CouponCreateBtn
                    coursePageResponse={couponResponse.data}
                />
            </div>
            <CouponTable couponPageResponse={couponResponse.data} />
        </div>
    );
};

export default CouponPage;
