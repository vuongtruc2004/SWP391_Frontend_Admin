import CampaignCreateBtn from '@/components/campaign/campaign.create.btn';
import CampaignFilter from '@/components/campaign/campaign.filter';
import CampaignSearch from '@/components/campaign/campaign.search';
import CampaignTable from '@/components/campaign/campaign.table'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Quản lí chiến dịch",
};
const CampaignPage = async (props: {
    searchParams: Promise<{
        keyword: string;
        page: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;

    let filter = `campaignName ~ '${keyword}' or campaignDescription ~ '${keyword}'`

    const campaignResponse = await sendRequest<ApiResponse<PageDetailsResponse<CampaignResponse[]>>>({
        url: `${apiUrl}/campaigns`,
        queryParams: {
            page: page,
            size: 10,
            filter: filter,
            sort: 'updatedAt,desc'
        }
    })



    return (
        <div className="border w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <CampaignSearch keyword={keyword} />
            <CampaignCreateBtn />
            <CampaignTable campaignResponse={campaignResponse.data} />
        </div>
    )
}

export default CampaignPage