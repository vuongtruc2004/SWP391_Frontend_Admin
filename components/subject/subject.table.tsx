'use client'
import { sendRequest } from '@/utils/fetch.api';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { notification, Popconfirm, Space, Table, TableProps } from 'antd';
import { useState } from 'react';

import { apiUrl, storageUrl } from '@/utils/url';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import UpdateSubjectForm from './update.subject.form';


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
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1; // Lấy số trang từ URL
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editingUSubject, setEditingSubject] = useState<SubjectResponse | null>(null)
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

    }

    const columns: TableProps<SubjectResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * subjectPageResponse.pageSize}</>,
        },
        {
            title: 'Tên công nghệ',
            dataIndex: 'subjectName',
            key: 'name',
            width: '20%',
            sorter: (a, b) => a.subjectName.localeCompare(b.subjectName),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Số lượng khóa học',
            dataIndex: 'totalCourses',
            key: 'totalCourses',
            width: '10%',
            align: 'center',
            sorter: (a, b) => a.totalCourses - b.totalCourses,
            render: (text, record) => (
                <Popconfirm
                    title={
                        <div>
                            <p className='pb-4 text-blue-500 text-lg'>Các khóa học chi tiết</p>
                            <div className="max-h-[150px] overflow-y-auto pr-2">
                                <ul className='pl-4'>
                                    {record.listCourses.map((course, index) => (
                                        <li key={index}> <span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course}</li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    }
                    icon={null}
                    showCancel={false}
                    okText="Đóng"
                >
                    <span className="cursor-pointer text-blue-500 hover:underline">{text}</span>
                </Popconfirm>
            ),
        },
        {
            title: 'Ảnh bìa',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Popconfirm
                    title={
                        <div className='h-[180px] w-[180px] shadow-xl rounded-lg overflow-hidden bg-white flex items-center justify-center'>
                            <img className='max-h-full max-w-full rounded object-contain'
                                src={`${storageUrl}/subject/${record.thumbnail}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={record.subjectName}
                            />
                        </div>
                    }
                    icon={null}
                    showCancel={false}
                    okText="Đóng"
                >
                    <PictureOutlined style={{ color: 'green' }} />
                </Popconfirm>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            align: 'center',
            render: (_, record: any) => (
                <Space size="middle">
                    <EditOutlined style={{ color: "blue" }}
                        onClick={() => {
                            setEditingSubject(record)
                            setOpenEditForm(true)
                        }}
                    />
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
                    showSizeChanger: false,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page.toString());
                        router.replace(`${pathname}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />

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
