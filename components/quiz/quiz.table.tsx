'use client'

import { EditOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ViewQuizDetail from "./view.quiz.detail";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import UpdateQuizForm from "./update.quiz.form";
import Link from "next/link";

const QuizTable = (props: {
    quizPageResponse: PageDetailsResponse<QuizResponse[]>
}) => {
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
            title: 'Chương học',
            dataIndex: ['chapter', 'title'],
            key: 'chapter.title',
            align: 'center',
            sorter: (a, b) => a.chapter.title.localeCompare(b.chapter.title),
            render: (_, record) => {
                return (
                    <span style={{ color: record.chapter?.title ? '' : 'red' }} >
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
                <span>
                    {record.createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss') : 'Không có dữ liệu'}
                </span>
            ),
            sorter: {
                compare: (a: QuizResponse, b: QuizResponse) =>
                    dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            key: 'duration',
            align: 'center',
            sorter: (a, b) => a.duration - b.duration,
            render: (duration: number) => {
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                return (`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
            }
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
                    <EditOutlined className="text-blue-500" style={{ color: "blue" }}
                        onClick={() => {
                            SetEditingQuiz(record)
                            setOpenEditForm(true)
                        }}
                    />
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
                'Content-Type': 'application/json'
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



            <UpdateQuizForm
                editingQuiz={editingQuiz}
                setEditingQuiz={SetEditingQuiz}
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}

            />

        </>
    )
}

export default QuizTable;