'use client'

import { EditOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import Link from "next/link";
import { useSession } from "next-auth/react";

const QuizTable = (props: {
    quizPageResponse: PageDetailsResponse<QuizResponse[]>
}) => {
    const { data: session, status } = useSession();
    const { quizPageResponse } = props;
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const router = useRouter();
    const pathName = usePathname();
    const [quizDetail, setQuizDetail] = useState<QuizResponse | null>(null);
    const [openDraw, setOpenDraw] = useState<boolean>(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingQuiz, SetEditingQuiz] = useState<QuizResponse | null>(null);
    const columns: TableProps<QuizResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * quizPageResponse.pageSize}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Khóa học',
            dataIndex: ['chapter', 'course'],
            key: 'chapter.course.courseName',
            align: 'center',
            sorter: (a, b) => a.chapter.course.courseName.localeCompare(b.chapter.course.courseName),
            render: (_, record) => {
                return (
                    <span style={{ color: record.chapter.course.courseName ? '' : 'red', whiteSpace: 'nowrap' }} >
                        {record.chapter.course.courseName || 'Không có chương học'}
                    </span>)
            }
        },
        {
            title: 'Chương học',
            dataIndex: ['chapter', 'title'],
            key: 'chapter.title',
            align: 'center',
            sorter: (a, b) => a.chapter.title.localeCompare(b.chapter.title),
            render: (_, record) => {
                return (
                    <span style={{ color: record.chapter?.title ? '' : 'red', whiteSpace: 'nowrap' }} >
                        {record.chapter?.title || 'Không có chương học'}
                    </span>)
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (createdAt: string, record) => (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {record.createdAt ? dayjs(createdAt).format('DD/MM/YYYY') : 'Không có dữ liệu'}
                </span>
            ),
            sorter: {
                compare: (a: QuizResponse, b: QuizResponse) =>
                    dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            },
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'duration',
            key: 'duration',
            align: 'center',
            sorter: (a, b) => a.duration - b.duration,
            render: (duration: number) => (<span>{duration / 60}</span>)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'published',
            key: 'published',
            align: 'center',
            render: (published: boolean) => (
                <span style={{ color: published ? 'green' : 'red' }}>
                    {published ? "Mở" : "Đóng"}
                </span>
            ),
            sorter: {
                compare: (a, b) => Number(a.published) - Number(b.published)
            },
        },
        {
            title: 'Cho xem đáp án',
            dataIndex: 'allowSeeAnswers',
            key: 'allowSeeAnswers',
            align: 'center',
            render: (allowSeeAnswers: boolean) => (
                <span style={{ color: allowSeeAnswers ? 'green' : 'red' }}>
                    {allowSeeAnswers ? "Mở" : "Đóng"}
                </span>
            ),
            sorter: {
                compare: (a, b) => Number(a.published) - Number(b.published)
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record: any) => (
                <Space size="middle">
                    <Link href={`/quiz/detail/${record.quizId}`}>
                        <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                            setOpenDraw(true);
                            setQuizDetail(record);
                        }} />
                    </Link>
                    {session?.user.roleName === 'EXPERT' && status === 'authenticated' && (
                        <Link href={`/quiz/update?quizId=${record.quizId}`} passHref>
                            <EditOutlined style={{ color: "blue", cursor: "pointer" }} />
                        </Link>
                    )}
                    <Popconfirm
                        placement="left"
                        title={`${record.published ? "Đóng" : "Mở"} bài kiểm tra`}
                        description={`Bạn có chắc chắn muốn ${record.published ? "đóng" : "mở"} bài kiểm tra này không?`}
                        onConfirm={() => publishedQuiz(record.quizId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <LockOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const publishedQuiz = async (quizId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<Boolean>>({
            url: `${apiUrl}/quizzes/${quizId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.accessToken}`
            }
        });

        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành công",
                description: deleteResponse.data ? "Mở bài kiểm tra thành công!" : "Đóng bài kiểm tra thành công!",
            });
            router.refresh();
        } else {
            notification.error({
                message: "Thất bại",
                description: String(deleteResponse.message),
            })
        }
    }
    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={quizPageResponse.content}
                rowKey={"quizId"}
                pagination={{
                    current: page,
                    pageSize: quizPageResponse.pageSize,
                    total: quizPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathName}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />



        </>
    )
}

export default QuizTable;