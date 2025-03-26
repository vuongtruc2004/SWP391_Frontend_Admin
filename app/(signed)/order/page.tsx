import OrderSearch from "@/components/order/order.search";
import OrderCreate from "@/components/order/order.create.btn";
import OrderTable from "@/components/order/order.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { isFullNumber } from "@/helper/subject.helper";
import { getOrderStatus, getPrice } from "@/helper/create.order.helper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Quản lý người dùng",
};

const OrderPage = async (props: {
    searchParams: Promise<{
        keyword?: string,
        page?: string,
        orderStatus?: string,
        createdFrom?: string,
        createdTo?: string,
        paidAtFrom?: string,
        paidAtTo?: string,
        minPrice?: string,
        maxPrice?: string

    }>
}) => {
    const session = await getServerSession(authOptions);
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || '';
    const page = searchParams.page || 1;
    const createdFrom = searchParams.createdFrom || '';
    const createdTo = searchParams.createdTo || '';
    const paidAtFrom = searchParams.paidAtFrom || '';
    const paidAtTo = searchParams.paidAtTo || '';
    const minPrice = getPrice(searchParams.minPrice);
    const maxPrice = getPrice(searchParams.maxPrice);
    const orderStatus = getOrderStatus(searchParams.orderStatus);
    let filters: string[] = [];

    if (keyword !== '') {
        filters.push(`(user.fullname ~ '${keyword}' or user.email ~ '${keyword}' or orderCode ~ '${keyword}')`);
    }

    if (orderStatus !== 'ALL') {
        filters.push(`orderStatus : '${orderStatus}'`);
    }

    if (createdFrom !== '' && createdTo !== '') {
        filters.push(`createdAt > '${createdFrom}' and createdAt < '${createdTo}'`);
    }

    if (paidAtFrom !== '' && paidAtTo !== '') {
        filters.push(`paidAt > '${paidAtFrom}' and paidAt < '${paidAtTo}'`);
    }

    if (minPrice != '') {
        filters.push(` totalPrice >: ${minPrice}`)
    }
    if (maxPrice != '') {
        filters.push(` totalPrice <: ${maxPrice} `)
    }


    const filter = filters.length > 0 ? filters.join(" and ") : '';

    const priceResponse = await sendRequest<ApiResponse<MinMaxPriceResponse>>({
        url: `${apiUrl}/orders/price-range`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
    })

    if (session?.user.roleName === "EXPERT") {
        redirect("/course");
    }
    const orderResponse = await sendRequest<ApiResponse<PageDetailsResponse<OrderResponse[]>>>({
        url: `${apiUrl}/orders`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter
        }
    })


    return (
        <>
            <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
                <OrderSearch
                    keyword={keyword} createdFrom={createdFrom}
                    createdTo={createdTo} paidAtFrom={paidAtFrom} paidAtTo={paidAtTo}
                    minPrice={priceResponse.data.minPrice} maxPrice={priceResponse.data.maxPrice} />

                <OrderTable orderPageResponse={orderResponse.data} />
            </div>
        </>

    )
}
export default OrderPage;