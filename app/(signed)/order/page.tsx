import OrderSearch from "@/components/order/order.search";
import OrderCreate from "@/components/order/order.create.btn";
import OrderTable from "@/components/order/order.table";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { Metadata } from "next";
import { isFullNumber } from "@/helper/subject.helper";
import { getOrderStatus, getPrice } from "@/helper/create.order.helper";


export const metadata: Metadata = {
    title: "Quản lí người dùng",
};

const OrderPage = async (props: {
    searchParams: Promise<{
        keyword?: string,
        page?: string,
        orderStatus?: string,
        createdFrom?: string,
        createdTo?: string,
        updatedFrom?: string,
        updatedTo?: string,
        minPrice?: string,
        maxPrice?: string

    }>
}) => {
    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || '';
    const page = searchParams.page || 1;
    const createdFrom = searchParams.createdFrom || '';
    const createdTo = searchParams.createdTo || '';
    const updatedFrom = searchParams.updatedFrom || '';
    const updatedTo = searchParams.updatedTo || '';
    const minPrice = getPrice(searchParams.minPrice);
    const maxPrice = getPrice(searchParams.maxPrice);
    const orderStatus = getOrderStatus(searchParams.orderStatus);
    let filters: string[] = [];

    if (keyword !== '') {
        filters.push(`user.fullname ~ '${keyword}'`);
    }

    if (orderStatus !== 'ALL') {
        filters.push(`orderStatus : '${orderStatus}'`);
    }

    if (createdFrom !== '' && createdTo !== '') {
        filters.push(`createdAt > '${createdFrom}' and createdAt < '${createdTo}'`);
    }

    if (updatedFrom !== '' && updatedTo !== '') {
        filters.push(`updatedAt > '${updatedFrom}' and updatedAt < '${updatedTo}'`);
    }

    const filter = filters.length > 0 ? filters.join(" and ") : '';

    const priceResponse = await sendRequest<ApiResponse<MinMaxPriceResponse>>({
        url: `${apiUrl}/orders/price-range`,

    })
    const queryParams: Record<string, any> = {
        page: page,
        size: 10,
        filter: filter
    };

    if (minPrice != '' && maxPrice == '') {
        queryParams.minPrice = minPrice;

    } else if (minPrice == '' && maxPrice != '') {
        queryParams.maxPrice = maxPrice;
    } else if (minPrice != '' && maxPrice != '') {
        queryParams.minPrice = minPrice;
        queryParams.maxPrice = maxPrice;
    }
    console.log(queryParams);

    const orderResponse = await sendRequest<ApiResponse<PageDetailsResponse<OrderResponse[]>>>({
        url: `${apiUrl}/orders`,
        queryParams: queryParams
    })
    console.log(orderResponse);

    return (

        <>
            <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
                {/* <OrderSearch
                    keyword={keyword} orderStatus={orderStatus} createdFrom={createdFrom}
                    createdTo={createdTo} updatedFrom={updatedFrom} updatedTo={updatedTo}
                    minPrice={priceResponse.data.minPrice} maxPrice={priceResponse.data.maxPrice} /> */}
                <OrderCreate />
                {/* <OrderTable orderPageResponse={orderResponse.data} /> */}
            </div>
        </>

    )
}
export default OrderPage;