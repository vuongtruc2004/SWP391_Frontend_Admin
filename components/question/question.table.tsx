'use client'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { notification, Popconfirm, Space, Table, TableProps, Tooltip } from 'antd';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import UpdateQuestionForm from './update.question.form';
import ViewQuestionDetail from './view.question.detail';
import { apiUrl } from '@/utils/url';
import { sendRequest } from '@/utils/fetch.api';



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
const QuestionTable = (props: { questionPageResponse: PageDetailsResponse<QuestionResponse[]> }) => {
    const { questionPageResponse } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [question, setQuestion] = useState<QuestionResponse | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null)
    const [openEditForm, setOpenEditForm] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1;
    const { data: session, status } = useSession();

    const deleteQuestion = async (questionId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<string>>({
            url: `${apiUrl}/questions/${questionId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: deleteResponse.message.toString(),
                showProgress: true
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: deleteResponse.message.toString(),
                showProgress: true
            })
        }
    }

    const columns: TableProps<QuestionResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * questionPageResponse.pageSize}</>,
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <Tooltip title='Chi tiết câu hỏi' color='blue'>
                        <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                            setOpenDraw(true);
                            setQuestion(record);
                        }} />
                    </Tooltip>

                    {session?.user.roleName === 'EXPERT' &&
                        <>
                            <Tooltip title='Chỉnh sửa câu hỏi' color='blue'>
                                <EditOutlined style={{ color: "blue" }}
                                    onClick={() => {
                                        setEditingQuestion(record)
                                        setOpenEditForm(true)
                                    }}
                                />
                            </Tooltip>
                            <Popconfirm
                                placement="left"
                                title="Xóa câu hỏi"
                                description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                                onConfirm={() => deleteQuestion(record.questionId)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Tooltip title='Xóa câu hỏi' color='blue'>
                                    <DeleteOutlined style={{ color: "red" }} />
                                </Tooltip>

                            </Popconfirm>
                        </>
                    }


                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={questionPageResponse.content}
                rowKey={"questionId"}
                pagination={{
                    current: page,
                    pageSize: 10,
                    total: questionPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />

            <ViewQuestionDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                question={question}
                setQuestion={setQuestion}
            />

            <UpdateQuestionForm
                openEditForm={openEditForm}
                setOpenEditForm={setOpenEditForm}
                editingQuestion={editingQuestion}
                setEditingQuestion={setEditingQuestion}
            />


        </>
    );
};
export default QuestionTable;
