'use client'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Space, Table, TableProps } from 'antd';
import React, { useState } from 'react'
import { sendRequest } from '@/utils/fetch.api';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/utils/url';
import ViewCourseDetail from './view.course.detail';



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
const CourseTable = (props: { coursePageResponse: PageDetailsResponse<CourseResponse[]> }) => {
    const { coursePageResponse } = props;
    const [openDraw, setOpenDraw] = useState(false);
    const [course, setCourse] = useState<CourseResponse | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const page = Number(searchParams.get('page')) || 1; // Lấy số trang từ URL
    const deleteCourse = async (subjectId: number) => {
        // const deleteResponse = await sendRequest<ApiResponse<SubjectResponse>>({
        //     url: `${apiUrl}/subjects/delete/${subjectId}`,
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // if (deleteResponse.status === 200) {
        //     notification.success({
        //         message: String(deleteResponse.message),
        //         description: deleteResponse.errorMessage,
        //     });
        //     router.refresh()
        // } else {
        //     notification.error({
        //         message: String(deleteResponse.message),
        //         description: deleteResponse.errorMessage,
        //     })
        // }

        alert("Delete")
    }

    const columns: TableProps<CourseResponse>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'courseId',
            key: 'id',
            width: '10%',
            sorter: {
                compare: (a, b) => a.courseId - b.courseId,
            },
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
            width: '35%',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            sorter: {
                compare: (a, b) => a.price - b.price,
            },
        },
        {
            title: 'Trạng thái kích hoạt',
            dataIndex: 'accepted',
            key: 'accepted',
            width: '15%',
            align: 'center',
            render: (accepted: boolean) => (accepted ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />),
            sorter: {
                compare: (a, b) => Number(a.accepted) - Number(b.accepted)
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "blue" }} onClick={() => {
                        setOpenDraw(true);
                        setCourse(record);
                    }} />
                    <Popconfirm
                        placement="left"
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa khóa học này không?"
                        onConfirm={() => deleteCourse(record.subjectId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <DeleteOutlined style={{ color: "red" }} />
                    </Popconfirm>
                    <CheckOutlined
                        style={{ color: record.accepted ? "gray" : "#16db65", cursor: record.accepted ? "not-allowed" : "pointer" }}
                        onClick={() => {
                            if (!record.accepted) {
                                alert("Accept");
                            }
                        }}
                    />

                </Space>
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
            />

            <ViewCourseDetail
                setOpenDraw={setOpenDraw}
                openDraw={openDraw}
                course={course}
                setCourse={setCourse}
            />
        </>
    );
};
export default CourseTable;
