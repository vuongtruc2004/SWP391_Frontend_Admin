'use client'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Space, Table, TableProps } from 'antd';
import React, { useState } from 'react'
import { sendRequest } from '@/utils/fetch.api';
import ViewSubjectDetail from './view.subject.detail';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/utils/url';

interface IProps {

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
const SubjectTable = (props: { subjectPageResponse: PageDetailsResponse<SubjectResponse[]> }) => {
    const { subjectPageResponse } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [subject, setSubject] = useState<SubjectResponse | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1; // Lấy số trang từ URL
    const deleteSubject = async (subjectId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<SubjectResponse>>({
            url: `${apiUrl}/subjects/delete/${subjectId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (deleteResponse.status === 200) {
            notification.success({
                message: String(deleteResponse.message),
                description: deleteResponse.errorMessage,
            });
            router.refresh()
        } else {
            notification.error({
                message: String(deleteResponse.message),
                description: deleteResponse.errorMessage,
            })
        }

        console.log(">>> check", deleteResponse)
    }

    const columns: TableProps<SubjectResponse>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'subjectId',
            key: 'id',
            width: '10%',
            sorter: {
                compare: (a, b) => a.subjectId - b.subjectId,
            },
        },
        {
            title: 'Tên môn học',
            dataIndex: 'subjectName',
            key: 'name',
            width: '20%',
            sorter: (a, b) => a.subjectName.length - b.subjectName.length,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '50%',
            sorter: (a, b) => a.description.length - b.description.length,
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "green" }} onClick={() => {
                        setOpenDraw(true);
                        setSubject(record);
                    }} />
                    <Link href="#">
                        <EditOutlined className="text-blue-500" />
                    </Link>
                    <Popconfirm
                        placement="left"
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa môn học này không?"
                        onConfirm={() => deleteSubject(record.subjectId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <DeleteOutlined style={{ color: "red" }} />
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
                    current: page,
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
