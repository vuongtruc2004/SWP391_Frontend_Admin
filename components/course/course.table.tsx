'use client'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { notification, Popconfirm, Space, Spin, Table, TableProps, Tooltip } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBan } from "react-icons/fa";
import { GrChapterAdd } from 'react-icons/gr';
import { LuGitPullRequestCreateArrow } from "react-icons/lu";
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
const CourseTable = (props: { coursePageResponse: PageDetailsResponse<CourseDetailsResponse[]> }) => {
    const { coursePageResponse } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1; // Lấy số trang từ URL
    const { data: session, status } = useSession();
    const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null)
    const [openEditForm, setOpenEditForm] = useState(false);
    const [course, setCourse] = useState<CourseDetailsResponse | null>(null);
    const [render, setRender] = useState(false);

    const deleteCourse = async (courseId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses/delete/${courseId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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
                'Content-Type': 'application/json',
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
            url: `${apiUrl}/courses/request-processing/${courseId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            url: `${apiUrl}/courses/request-reject/${courseId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            sorter: (a, b) => a.courseName.localeCompare(b.courseName),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            sorter: {
                compare: (a, b) => a.price - b.price,
            },
            render: (price: number) => <>{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}</>,
        },
        {
            title: 'Trạng thái kích hoạt',
            dataIndex: 'accepted',
            key: 'accepted',
            width: '15%',
            align: 'center',
            render: (_, record: CourseDetailsResponse) => {
                const { accepted, courseStatus } = record;

                if (courseStatus === 'PROCESSING') {
                    return <Spin size="small" />;
                }

                return !accepted || ['DRAFT', 'REJECT'].includes(courseStatus) ? (
                    <CloseOutlined style={{ color: 'red' }} />
                ) : (
                    <CheckOutlined style={{ color: 'green' }} />
                );
            }

        },

        {
            title: 'Trạng thái duyệt',
            dataIndex: 'courseStatus',
            key: 'courseStatus',
            width: '15%',
            align: 'center',
            render: (status) => {
                switch (status) {
                    case 'DRAFT':
                        return 'Bản nháp';
                    case 'REJECT':
                        return 'Chưa được duyệt';
                    case 'PROCESSING':
                        return 'Đang chờ duyệt';
                    case 'SUCCESS':
                        return 'Đã duyệt';
                    default:
                        return 'Không xác định';
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
                    {session?.user.roleName && session.user.roleName === 'EXPERT' && (
                        <div className='flex items-center justify-center gap-3'>
                            <Tooltip title="Thêm bài kiểm tra" color="blue">
                                <Link href={`/quiz/create/${record.courseId}`}>
                                    <QuestionCircleOutlined
                                        style={{ color: "green" }}
                                    />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Thêm chương học" color="blue">
                                <Link href={`/chapter/create/${record.courseId}`}>
                                    <GrChapterAdd
                                        style={{ color: "black" }}
                                    />
                                </Link>
                            </Tooltip>

                        </div>

                    )}
                    {session?.user.roleName && (session.user.roleName === "EXPERT" || session.user.roleName === "ADMIN") && (
                        <>
                            <Tooltip title='Cập nhật khoá học' color='blue'>
                                <EditOutlined style={{ color: "blue" }}
                                    onClick={() => {
                                        setEditingCourse(record)
                                        setOpenEditForm(true)
                                    }}
                                />
                            </Tooltip>
                            {(record.courseStatus === 'DRAFT' || record.courseStatus === 'REJECT') && (
                                <Tooltip title='Gửi yêu cầu duyệt' color='blue'>
                                    <LuGitPullRequestCreateArrow
                                        onClick={() => changeDraftToProcessingCourse(record.courseId)}

                                    />
                                </Tooltip>
                            )}

                        </>
                    )}
                    {session?.user.roleName && session.user.roleName === "ADMIN" && (
                        <Tooltip title="Từ chối duyệt khoá học" color="red">
                            <FaBan onClick={() => rejectCourse(record.courseId)} />
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

                    {
                        session?.user.roleName && session?.user.roleName === "ADMIN" && (
                            <>
                                {!record.accepted ? (
                                    <Tooltip placement="bottom" title='Chấp nhận khóa học'>
                                        <CheckOutlined
                                            style={{
                                                color: record.accepted ? "gray" : "#16db65",
                                                cursor: record.accepted ? "not-allowed" : "pointer",
                                                pointerEvents: record.accepted ? "none" : "auto"
                                            }}
                                            onClick={() => acceptCourse(record.courseId)}
                                        />
                                    </Tooltip>

                                ) : (
                                    <Tooltip placement="bottom" title='Ẩn khóa học'>
                                        <CloseOutlined
                                            style={{
                                                color: record.accepted ? "red" : "gray",
                                                cursor: record.accepted ? "pointer" : "not-allowed",
                                                pointerEvents: record.accepted ? "auto" : "none"
                                            }}
                                            onClick={() => acceptCourse(record.courseId)}
                                        />
                                    </Tooltip>

                                )}
                            </>

                        )
                    }

                    <Tooltip title='Xem danh sách người mua' color='blue'>
                        <Link href={`/course/purchaser/${record.courseId}`}>
                            <UserOutlined />
                        </Link>
                    </Tooltip>

                </Space >
            ),
        },
    ];
    useEffect(() => {
        setRender(true);
    }, [])
    if (!render) {
        return (
            <></>
        )
    }
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
