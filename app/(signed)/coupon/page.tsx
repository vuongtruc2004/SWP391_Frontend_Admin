import CouponCreateBtn from "@/components/coupon/coupon.create.btn";
import CouponSearch from "@/components/coupon/coupon.search";
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
        couponCode: string;
        couponName: string;
        minPrice: number;
        maxPrice: number;
        discount_range: string;
    }>
}) => {
    const searchParams = await props.searchParams;
    const page = searchParams.page || "1";
    const keyword = searchParams.keyword || "";
    const couponCode = searchParams.couponCode || "";
    const couponName = searchParams.couponName || "";
    const minPrice = searchParams.minPrice || 0;
    const maxPrice = searchParams.maxPrice || 100000000;
    const discount_range = searchParams.discount_range || "";

    let filter = "";

    filter = `(couponName ~ '${keyword.trim()}' or couponCode ~ '${keyword.trim()}')`
    // if (couponCode !== "") {
    //     filter += ` }`
    // }

    // if (createdFrom !== "" && createdTo !== "") {
    //     filter += ` and createdAt > '${createdFrom}' and createdAt < '${createdTo}'`
    // }

    // if (priceFrom !== "" && priceTo !== "") {
    //     filter += ` and price >: ${priceFrom} and price <: ${priceTo}`
    // }

    const couponResponse = await sendRequest<ApiResponse<PageDetailsResponse<CouponResponse[]>>>({
        url: `${apiUrl}/coupons/all`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: "updatedAt,desc"
        }
    });

    console.log(">>> check coupon", couponResponse.data);

    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CouponSearch
                keyword={keyword}
                couponCode={couponCode}
                couponName={couponName}
                minPrice={minPrice}
                maxPrice={maxPrice}
                discount_range={discount_range}
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
