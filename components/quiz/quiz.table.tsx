'use client'

import { EditOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ViewQuizDetail from "./view.quiz.detail";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";

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
    const columns: TableProps<QuizResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * quizPageResponse.pageSize}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            align: 'center',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Số lượt kiểm tra',
            dataIndex: 'maxAttempts',
            key: 'maxAttempts',
            width: '15%',
            align: 'center',
            sorter: {
                compare: (a, b) => a.maxAttempts - b.maxAttempts
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'published',
            key: 'published',
            width: '15%',
            align: 'center',
            render: (published: boolean) => (
                <span style={{ color: published ? 'green' : 'red' }}>
                    {published ? "Đang mở" : "Bị đóng"}
                </span>
            ),
            sorter: {
                compare: (a, b) => Number(a.published) - Number(b.published)
            },
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'startedAt',
            key: 'startedAt',
            width: '20%',
            align: 'center',
            render: (startedAt: string) => (
                <span>
                    {startedAt ? dayjs(startedAt).format('DD/MM/YYYY HH:mm:ss') : 'Vô thời hạn'}
                </span>
            ),
            sorter: {
                compare: (a: QuizResponse, b: QuizResponse) =>
                    dayjs(a.startedAt).unix() - dayjs(b.startedAt).unix(),
            },
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endedAt',
            key: 'endedAt',
            width: '20%',
            align: 'center',
            render: (endedAt: string) => (
                <span >
                    {endedAt ? dayjs(endedAt).format('DD/MM/YYYY HH:mm:ss') : 'Vô thời hạn'}
                </span>
            ),
            sorter: {
                compare: (a: QuizResponse, b: QuizResponse) =>
                    dayjs(a.endedAt).unix() - dayjs(b.endedAt).unix(),
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '40%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setQuizDetail(record);
                    }} />

                    <EditOutlined className="text-blue-500" style={{ color: "blue" }}
                        onClick={() => {
                            // setEditingUser(record)
                            // setOpenEditForm(true)
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
            url: `${apiUrl}/quiz/${quizId}`,
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

            <ViewQuizDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                quizDetail={quizDetail}
            />

        </>
    )
}

export default QuizTable;