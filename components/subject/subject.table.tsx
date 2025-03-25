import { DeleteOutlined, DoubleRightOutlined, EditOutlined, EyeOutlined, InboxOutlined, PictureOutlined } from '@ant-design/icons';
import { Empty, Image, notification, Popconfirm, Space, Table, TableProps, Tooltip, Typography } from 'antd';
import React, { RefObject, useState } from 'react';
import { sendRequest } from '@/utils/fetch.api';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { apiUrl, storageUrl } from '@/utils/url';
import UpdateSubjectForm from './update.subject.form';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

export const init = {
    subjectName: {
        error: false,
        value: ""
    },
    description: {
        error: false,
        value: ""
    }
};

const SubjectTable = (props: { subjectPageResponse: PageDetailsResponse<SubjectResponse[]>, componentPDF: RefObject<HTMLDivElement | null> }) => {
    const { subjectPageResponse, componentPDF } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1;
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingUSubject, setEditingSubject] = useState<SubjectResponse | null>(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const { data: session, status } = useSession();
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const { Paragraph } = Typography;

    const handleExpand = (key: number, expanded: boolean) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [key]: expanded,
        }));
    };

    const deleteSubject = async (subjectId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<SubjectResponse>>({
            url: `${apiUrl}/subjects/delete/${subjectId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: String(deleteResponse.message),
                description: "Bạn đã xóa thành công lĩnh vực này!",
                showProgress: true
            });
            router.refresh();
        } else {
            notification.error({
                message: String(deleteResponse.message),
                description: "Không thể xóa lĩnh vực này do đang có khóa học!",
                showProgress: true
            });
        }
    };

    const columns: TableProps<SubjectResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * subjectPageResponse.pageSize}</>,
        },
        {
            title: 'Tên lĩnh vực',
            dataIndex: 'subjectName',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (text, record) => (
                <Paragraph
                    ellipsis={{
                        rows: 2,
                        expandable: 'collapsible',
                        expanded: expandedRows[record.subjectId],
                        symbol: expandedRows[record.subjectId] ? 'Thu gọn' : 'Xem thêm',
                        onExpand: (_, info) => handleExpand(record.subjectId, info.expanded),
                    }}
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Số lượng khóa học',
            dataIndex: 'totalCourses',
            key: 'totalCourses',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Tooltip title='Các khóa học' color='blue'>
                    <Popconfirm
                        title={
                            <div>
                                <p className='pb-4 text-blue-500 text-lg text-center font-bold'>Các Khóa Học Chi Tiết</p>
                                <div className="max-h-[200px] w-[350px] overflow-y-auto pr-2">
                                    {record.listCourses && record.listCourses.length > 0 ? (
                                        <ul className='pl-4'>
                                            {record.listCourses.map((course, index) => (
                                                <li key={index}>
                                                    <span className='gap-2 mr-2'>
                                                        <DoubleRightOutlined style={{ color: 'green' }} />
                                                    </span>
                                                    {course}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className='text-center'>
                                            <InboxOutlined className='text-5xl text-gray-500' />
                                            <p >Không tìm thấy khóa học nào!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        icon={null}
                        showCancel={false}
                        okText="Đóng"
                    >
                        <span className="cursor-pointer text-blue-500 hover:underline">{text}</span>
                    </Popconfirm>
                </Tooltip>
            ),
        },
        {
            title: 'Ảnh bìa',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Tooltip title='Ảnh bìa' color='green'>
                    <Popconfirm
                        title={
                            <Image
                                width="180px"
                                height="auto"
                                preview={{
                                    visible: isPreviewVisible,
                                    mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                    onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                }}
                                src={`${storageUrl}/subject/${record.thumbnail}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={record.subjectName}
                            />
                        }
                        icon={null}
                        showCancel={false}
                        okText="Đóng"
                    >
                        <PictureOutlined style={{ color: 'green' }} />
                    </Popconfirm>
                </Tooltip>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            align: 'center',
            render: (_, record: any) => (
                <Space size="middle">
                    <Tooltip title='Chỉnh sửa' color='blue'>
                        <EditOutlined style={{ color: "blue" }}
                            onClick={() => {
                                setEditingSubject(record)
                                setOpenEditForm(true)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title='Xóa' color='red'>
                        <Popconfirm
                            placement="left"
                            title="Xóa lĩnh vực"
                            description="Bạn có chắc chắn muốn xóa lĩnh vực này không?"
                            onConfirm={() => deleteSubject(record.subjectId)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined style={{ color: "red" }} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className='overflow-y-auto mb-6' ref={componentPDF} >
                <Table
                    className="max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                    columns={columns}
                    dataSource={subjectPageResponse.content}
                    rowKey={"subjectId"}
                    locale={{
                        emptyText: <Empty description="Không có dữ liệu!" />,
                    }}
                    pagination={{
                        current: page,
                        pageSize: subjectPageResponse.pageSize,
                        total: subjectPageResponse.totalElements,
                        showSizeChanger: false,
                        onChange(page, pageSize) {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', page.toString());
                            router.replace(`${pathname}?${params}`);
                        },
                    }}
                    showSorterTooltip={false}
                />
            </div>
            <UpdateSubjectForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingSubject={editingUSubject}
                setEditingSubject={setEditingSubject}
            />
        </>
    );
};

export default SubjectTable;