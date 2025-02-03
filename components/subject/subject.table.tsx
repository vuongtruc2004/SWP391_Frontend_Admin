'use client'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Table, TableProps } from 'antd';
import React, { useState } from 'react'
import { deleteSubjectApi } from '@/utils/fetch.api';
import ViewSubjectDetail from './view.subject.detail';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IProps {
    subjectPageResponse: PageDetailsResponse<SubjectResponse[]>
}

export const init = {
    subjectName: {
        error: false,
        value: ""
    },
    description: {
        error: false,
        value: ""
    }
}
const SubjectTable = (props: IProps) => {
    const { subjectPageResponse } = props;

    const [openDraw, setOpenDraw] = useState(false);
    const [subject, setSubject] = useState<SubjectResponse | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const columns: TableProps<SubjectResponse>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'subjectId',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên môn học',
            dataIndex: 'subjectName',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined className="text-green-500" onClick={() => {
                        setOpenDraw(true);
                        setSubject(record);
                    }} />
                    <Link href={`/subject/${record.subjectId}`}>
                        <EditOutlined className="text-blue-500" />
                    </Link>
                    <Popconfirm
                        placement="left"
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa môn học này không?"
                        onConfirm={() => deleteSubjectApi(record.subjectId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <DeleteOutlined className="text-red-500" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={subjectPageResponse.content}
                rowKey={"subjectId"}
                pagination={{
                    pageSize: subjectPageResponse.pageSize,
                    total: subjectPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
            />

            <ViewSubjectDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                subject={subject}
                setSubject={setSubject}
            />
        </>
    );
};
export default SubjectTable;
