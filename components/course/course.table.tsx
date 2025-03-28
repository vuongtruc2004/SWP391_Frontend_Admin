'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, QuestionCircleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { notification, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { GrChapterAdd } from 'react-icons/gr';
import { IoBan } from 'react-icons/io5';
import { MdOutlineBookmarkAdded } from "react-icons/md";
import UpdateCourseForm from './update.course.form';

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
const CourseTable = ({ coursePageResponse }: { coursePageResponse: PageDetailsResponse<CourseDetailsResponse[]> }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1;
    const { data: session, status } = useSession();
    const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null)
    const [openEditForm, setOpenEditForm] = useState(false);

    const deleteCourse = async (courseId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/delete/${courseId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: deleteResponse.message.toString(),
                showProgress: true,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: deleteResponse.message.toString(),
            })
        }
    }
    const acceptCourse = async (courseId: number) => {
        const acceptRes = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/accept-status/${courseId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            }
        });
        if (acceptRes.status === 200) {
            notification.success({
                message: String(acceptRes.message),
                description: acceptRes.errorMessage,
                showProgress: true,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Lỗi!",
                description: String(acceptRes.message),
                showProgress: true,
            })
        }
    }

    const changeDraftToProcessingCourse = async (courseId: number) => {
        const changeStatus = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/processing/${courseId}`,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            }
        });
        if (changeStatus.status === 200) {
            notification.success({
                message: String(changeStatus.message),
                description: changeStatus.errorMessage,
                showProgress: true,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Lỗi!",
                description: String(changeStatus.message),
                showProgress: true,
            })
        }
    }
    const approvedCourse = async (courseId: number) => {
        const changeStatus = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/approved/${courseId}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            }
        });
        if (changeStatus.status === 200) {
            notification.success({
                message: String(changeStatus.message),
                description: changeStatus.errorMessage,
                showProgress: true,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Lỗi!",
                description: String(changeStatus.message),
                showProgress: true,
            })
        }
    }

    const rejectCourse = async (courseId: number) => {
        const changeStatus = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/rejected/${courseId}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`
            }
        });
        if (changeStatus.status === 200) {
            notification.success({
                message: String(changeStatus.message),
                description: changeStatus.errorMessage,
                showProgress: true,
            });
            router.refresh()
        } else {
            notification.error({
                message: "Lỗi!",
                description: String(changeStatus.message),
                showProgress: true,
            })
        }
    }

    const columns: TableProps<CourseDetailsResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * coursePageResponse.pageSize}</>,
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'courseName',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (price: number) => <>{price.toLocaleString('vi-VN')}₫</>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'courseStatus',
            key: 'courseStatus',
            width: '15%',
            align: 'center',
            render: (status) => {
                switch (status) {
                    case 'DRAFT':
                        return (
                            <p className='text-orange-500'>Bản nháp</p>
                        );
                    case 'REJECTED':
                        return (
                            <p className='text-red-500'>Bị từ chối duyệt</p>
                        );
                    case 'PROCESSING':
                        return (
                            <p className='text-purple-500'>Đang chờ duyệt</p>
                        );
                    case 'APPROVED':
                        return (
                            <p className='text-green-500'>Đã duyệt</p>
                        );
                    default:
                        return (
                            <p className='text-gray-500'>Không xác định</p>
                        );
                }
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: CourseDetailsResponse) => (
                <Space size="middle">
                    <Tooltip placement="bottom" title="Xem chi tiết">
                        <Link href={`/course/details/${record.courseId}`}>
                            <InfoCircleOutlined />
                        </Link>
                    </Tooltip>
                    {session?.user.roleName && (session.user.roleName === "ADMIN") && (
                        <>
                            <Tooltip title="Duyệt khoá học" placement="bottom" >
                                <MdOutlineBookmarkAdded onClick={() => approvedCourse(record.courseId)}
                                    style={{ color: "green" }} />
                            </Tooltip>
                            <Tooltip title="Từ chối khoá học" placement="bottom" >
                                <IoBan style={{ color: "red" }} onClick={() => rejectCourse(record.courseId)} />
                            </Tooltip>
                        </>
                    )}
                    {session?.user.roleName && (session.user.roleName === "EXPERT") && (
                        <>
                            <Tooltip title="Thêm bài kiểm tra" placement="bottom" >
                                <Link href={`/quiz/create/${record.courseId}`}>
                                    <QuestionCircleOutlined style={{ color: "green" }} />
                                </Link>
                            </Tooltip>

                            <Tooltip title="Thêm chương học" placement="bottom" >
                                <Link href={`/course/lessons/${record.courseId}`}>
                                    <GrChapterAdd style={{ color: "black" }} />
                                </Link>
                            </Tooltip>

                            <Tooltip title='Cập nhật khoá học' placement="bottom" >
                                <EditOutlined style={{ color: "blue" }}
                                    onClick={() => {
                                        setEditingCourse(record)
                                        setOpenEditForm(true)
                                    }}
                                />
                            </Tooltip>
                            {(record.courseStatus === 'DRAFT' || record.courseStatus === 'REJECTED') && (
                                <Tooltip title='Gửi yêu cầu duyệt' placement="bottom" >
                                    <SendOutlined onClick={() => changeDraftToProcessingCourse(record.courseId)} />
                                </Tooltip>
                            )}
                            <Tooltip placement="bottom" title='Xóa khóa học'>
                                <Popconfirm
                                    placement="left"
                                    title="Xóa khóa học"
                                    description="Bạn có chắc chắn muốn xóa khóa học này không?"
                                    onConfirm={() => deleteCourse(record.courseId)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <DeleteOutlined style={{ color: "red" }} />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title='Xem danh sách người mua' placement='bottom'>
                        <Link href={`/course/purchaser/${record.courseId}`}>
                            <UserOutlined />
                        </Link>
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
                dataSource={coursePageResponse.content}
                rowKey={"courseId"}
                pagination={{
                    current: page,
                    pageSize: coursePageResponse.pageSize,
                    total: coursePageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />

            <UpdateCourseForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingCourse={editingCourse}
                setEditingCourse={setEditingCourse}
            />
        </>
    );
};
export default CourseTable;
