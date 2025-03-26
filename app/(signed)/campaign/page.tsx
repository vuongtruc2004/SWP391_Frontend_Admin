import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CampaignCreateBtn from '@/components/campaign/campaign.create.btn';
import CampaignSearch from '@/components/campaign/campaign.search';
import CampaignTable from '@/components/campaign/campaign.table'
import { getDiscountRange, getReducePrice } from '@/helper/create.campaign.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata: Metadata = {
    title: "Quản lý chiến dịch",
};
const CampaignPage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
        discountType: string;
        discountRange: string;
        minPrice: string;
        maxPrice: string;
        startFrom?: string;
        startTo?: string;
        endFrom?: string;
        endTo?: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    const startFrom = searchParams.startFrom || '';
    const startTo = searchParams.startTo || '';
    const endFrom = searchParams.endFrom || '';
    const endTo = searchParams.endTo || '';
    const discountRange = getDiscountRange(searchParams.discountRange || '');
    const minPrice = getReducePrice(searchParams.minPrice || "");
    const maxPrice = getReducePrice(searchParams.maxPrice || "");
    const session = await getServerSession(authOptions);

    if (session && session.user.roleName === 'EXPERT') {
        redirect('/course')
    }

    if (!session) {
        return null;
    }

    let filters: string[] = [];
    if (keyword !== '') {
        filters.push(`(campaignName ~ '${keyword}' or campaignDescription ~ '${keyword}')`);
    }
    if (discountRange !== 'ALLS') {
        filters.push(`discountRange ~ '${discountRange}'`)
    }

    if (minPrice != '') {
        filters.push(` discountPercentage >: ${minPrice}`)
    }
    if (maxPrice != '') {
        filters.push(` discountPercentage <: ${maxPrice} `)
    }
    if (startFrom !== '' && startTo !== '') {
        filters.push(`startTime > '${startFrom}' and startTime < '${startTo}'`);
    }
    if (endFrom !== '' && endTo !== '') {
        filters.push(`endTime > '${endFrom}' and endTime < '${endTo}'`);
    }

    const filter = filters.length > 0 ? filters.join(" and ") : '';

    const campaignResponse = await sendRequest<ApiResponse<PageDetailsResponse<CampaignResponse[]>>>({
        url: `${apiUrl}/campaigns`,
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: 'updatedAt,desc'
        }
    })

    const priceResponse = await sendRequest<ApiResponse<MinMaxPriceResponse>>({
        url: `${apiUrl}/campaigns/price-range`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        }
    })

    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col">
            <CampaignSearch
                keyword={keyword}
                discountRange={discountRange}
                minPrice={priceResponse.data.minPrice} maxPrice={priceResponse.data.maxPrice}
                startFrom={startFrom} startTo={startTo} endFrom={endFrom} endTo={endTo}

            />
            <CampaignCreateBtn />
            <CampaignTable campaignResponse={campaignResponse.data} />
        </div>
    )
}

export default CampaignPage