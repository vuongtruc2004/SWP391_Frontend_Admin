'use client'
import { sendRequest } from '@/utils/fetch.api';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, InfoCircleOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Image, notification, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { apiUrl, storageUrl } from '@/utils/url';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import ViewCampaignDetail from './view.campaign.detail';
import UpdateCampaignForm from './update.campaign.form';


export const init = {
    courseName: {
        error: false,
        value: ""
    },
    description: {
        error: false,
        value: ""
    }
}


const CampaignTable = ({ campaignResponse }: { campaignResponse: PageDetailsResponse<CampaignResponse[]> }) => {
    const [openViewDraw, setOpenViewDraw] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1;
    const [currentCampaign, setCurrentCampaign] = useState<CampaignResponse>()
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<CampaignResponse | null>(null)


    const deleteCampaign = async (campaignId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<string>>({
            url: `${apiUrl}/campaigns/${campaignId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: deleteResponse.data.toString(),
                showProgress: true
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: "Không tìm thấy khóa học!",
                showProgress: true
            })
        }
    }


    const columns: TableProps<CampaignResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * campaignResponse.pageSize}</>,
        },
        {
            title: 'Tên chiến dịch',
            dataIndex: 'campaignName',
            key: 'campaignName',
            width: '30%',
            align: 'center',
            sorter: (a, b) => a.campaignName.localeCompare(b.campaignName),
        },
        {
            title: 'Loại giảm giá',
            dataIndex: 'discountType',
            key: 'discountType',
            width: '15%',
            align: 'center',
            sorter: (a, b) => a.discountType.localeCompare(b.discountType),
            render: (discountType) => discountType === 'FIXED' ? 'Tiền tươi' : 'Phần trăm'
        },
        {
            title: 'Số lượng giảm',
            dataIndex: 'discountPercentage',
            key: 'discountPercentage',
            width: '15%',
            align: 'center',
            sorter: (a, b) => a.discountType.localeCompare(b.discountType),
            render: (text, record) => {
                if (record.discountType === 'FIXED') {
                    const formattedDiscount = new Intl.NumberFormat('vi-VN').format(record.discountPercentage);
                    return `${formattedDiscount}₫`;
                }
                return `${record.discountPercentage}%`;
            }

        },
        {
            title: 'Phạm vi giảm giá',
            dataIndex: 'discountRange',
            key: 'discountRange',
            width: '15%',
            align: 'center',
            sorter: (a, b) => a.discountRange.localeCompare(b.discountRange),
            render: (discountRange) => discountRange === 'ALL' ? 'Tất cả' : 'Giới hạn'
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            width: '10%',
            align: 'center',
            sorter: (a, b) => a.startTime.localeCompare(b.startTime),
            render: (startTime) => dayjs(startTime).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '10%',
            align: 'center',
            sorter: (a, b) => a.endTime.localeCompare(b.endTime),
            render: (endTime) => dayjs(endTime).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            align: 'center',
            render: (_, record: CampaignResponse) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết" color='green'>
                        <InfoCircleOutlined
                            style={{ color: 'green' }}
                            onClick={() => {
                                setOpenViewDraw(true);
                                setCurrentCampaign(record);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title='Cập nhật chiến dịch' color='blue'>
                        <EditOutlined style={{ color: "blue" }}
                            onClick={() => {
                                setEditingCampaign(record)
                                setOpenEditForm(true)
                            }}
                        />
                    </Tooltip>

                    <Tooltip title='Xóa chiến dịch' color='red'>
                        <Popconfirm
                            placement="left"
                            title="Xóa chiến dịch"
                            description="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                            onConfirm={() => deleteCampaign(record.campaignId)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined style={{ color: "red" }} />
                        </Popconfirm>
                    </Tooltip>
                </Space >
            ),
        },
    ];

    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={campaignResponse?.content}
                rowKey={"campaignId"}
                pagination={{
                    current: page,
                    pageSize: campaignResponse?.pageSize,
                    total: campaignResponse?.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />

            <ViewCampaignDetail
                setOpenViewDraw={setOpenViewDraw}
                openViewDraw={openViewDraw}
                campaign={currentCampaign}
            />
            <UpdateCampaignForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingCamnpaign={editingCampaign}
                setEditingCamnpaign={setEditingCampaign}
            />
        </>
    );
};
export default CampaignTable;
