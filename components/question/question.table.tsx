'use client'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Popconfirm, Space, Table, TableProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ViewQuestionDetail from './view.question.detail';
import UpdateQuestionForm from './update.question.form';



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


    const columns: TableProps<QuestionResponse>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'questionId',
            key: 'id',
            width: '10%',
            sorter: {
                compare: (a, b) => a.questionId - b.questionId,
            },
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setQuestion(record);
                    }} />
                    <EditOutlined style={{ color: "blue" }}
                        onClick={() => {
                            setEditingQuestion(record)
                            setOpenEditForm(true)
                        }}
                    />
                    <Popconfirm
                        placement="left"
                        title="Xóa câu hỏi"
                        description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                        // onConfirm={() => deleteCourse(record.courseId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <DeleteOutlined style={{ color: "red" }} />
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    console.log("check 2", question)
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
