import { storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer, theme } from 'antd'
import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction } from 'react'


const ViewCampaignDetail = ({ campaign, openViewDraw, setOpenViewDraw }: {
    campaign: CampaignResponse | undefined
    openViewDraw: boolean
    setOpenViewDraw: Dispatch<SetStateAction<boolean>>
}) => {

    const onClose = () => {
        setOpenViewDraw(false);
    };
    const { token } = theme.useToken();


    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openViewDraw} width='30%'>
                {campaign ? <>
                    <table>
                        <tbody>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Tên chiến dịch:</td>
                                <td>{campaign.campaignName}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Mô tả:</td>
                                <td>{campaign.campaignDescription}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Loại giảm giá:</td>
                                <td>{campaign.discountType === 'FIXED' ? 'Tiền tươi' : 'Phần trăm'}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Số lượng giảm giá: </td>
                                <td>{Intl.NumberFormat('vi-VN').format(campaign.discountPercentage)} {campaign.discountType === 'FIXED' ? '₫' : '%'}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày tạo:</td>
                                <td>{dayjs(campaign.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày chỉnh sửa:</td>
                                <td>{dayjs(campaign.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày bắt đầu:</td>
                                <td>{dayjs(campaign.startTime).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày chỉnh sửa:</td>
                                <td>{dayjs(campaign.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày bắt đầu:</td>
                                <td>{dayjs(campaign.startTime).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày kết thúc: </td>
                                <td>{dayjs(campaign.endTime).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Phạm vi chiến dịch: </td>
                                <td>{campaign.discountRange === 'ALL' ? 'Tất cả' : 'Giới hạn'}</td>
                            </tr>
                        </tbody>

                    </table>

                    {campaign.discountRange !== 'ALL' &&
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...campaign.courses].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined className='text-green-500' /></span>{course.courseName}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    }

                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/campaign/${campaign.thumbnail}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={campaign.thumbnail}
                            />
                        </div>
                    </div>

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>)
}

export default ViewCampaignDetail