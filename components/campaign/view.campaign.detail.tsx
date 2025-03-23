import { storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer, theme, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useState } from 'react'


const ViewCampaignDetail = ({ campaign, openViewDraw, setOpenViewDraw }: {
    campaign: CampaignResponse | undefined
    openViewDraw: boolean
    setOpenViewDraw: Dispatch<SetStateAction<boolean>>
}) => {

    const [openCollapse, setOpenCollapse] = useState(['0']);

    const onClose = () => {
        setOpenCollapse([]);
        setOpenViewDraw(false);
    };

    const convertToPlusSeparated = (input: string): string => {
        return input.replaceAll(" ", "+");
    }

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
                                <td className='text-blue-500 text-base mr-2 font-bold'>Phần trăm giảm giá: </td>
                                <td>{Intl.NumberFormat('vi-VN').format(campaign.discountPercentage)} %</td>
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
                                <td className='text-blue-500 text-base mr-2 font-bold'>Ngày kết thúc: </td>
                                <td>{dayjs(campaign.endTime).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                            <tr>
                                <td className='text-blue-500 text-base mr-2 font-bold'>Phạm vi chiến dịch: </td>
                                <td>{campaign.discountRange === 'ALL' ? 'Tất cả' : 'Giới hạn'}</td>
                            </tr>
                        </tbody>

                    </table>

                    {/* <Collapse
                        activeKey={openCollapse}
                        onChange={setOpenCollapse}
                        items={[{
                            key: '0',
                            label: 'Xem chi tiết',
                            children:
                                <ul className='ml-4'>
                                    {[...campaign.courses].map((course, index) => (
                                        <Link key={index} href={`http://localhost:5173/course?keyword=${convertToPlusSeparated(course.courseName)}&page=1`}>
                                            <Tooltip title="Thông tin khóa học" placement='rightTop'>
                                                <ol ><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course.courseName}</ol>
                                            </Tooltip>
                                        </Link>
                                    ))}
                                </ul>
                        }]}
                    /> */}

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