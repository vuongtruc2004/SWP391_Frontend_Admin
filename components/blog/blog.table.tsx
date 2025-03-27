'use client'
import { CheckOutlined, CloseOutlined, CommentOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, LikeOutlined, MessageOutlined, StarOutlined, ToTopOutlined } from "@ant-design/icons"
import { Avatar, Button, Descriptions, DescriptionsProps, Empty, Flex, List, Modal, notification, Pagination, Popconfirm, Space, Table, TableProps, Tag, Tooltip, Tree, TreeDataNode, TreeProps, Typography } from "antd"
import dayjs from "dayjs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import BlogUpdate from "./blog.update"
import './overwrite.style.scss'
import { apiUrl, storageUrl } from "@/utils/url"
import { sendRequest } from "@/utils/fetch.api"
import { useSession } from "next-auth/react"
import ListComment from "../comment/list.comment"
import DisplayBlog from "@/features/display-blog/display.blog"


type CommentDisplay = {
    comment: CommentResponse,
    root: number,
}

const pageSize = 3;
const BlogTable = (props: { blogPageResponse: PageDetailsResponse<BlogDetailsResponse[]> }) => {
    const { blogPageResponse } = props
    const router = useRouter()
    const searchParam = useSearchParams()
    const pathName = usePathname()
    const page = Number(searchParam.get('page')) || 1;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeDetail = () => setIsModalOpen(false);
    const [selectRecord, setSelectRecord] = useState<BlogDetailsResponse | null>(null)
    const [openUpdate, setOpenUpdate] = useState(false);
    const [expendKey, setExpendKey] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const { data: session, status } = useSession();
    const [comments, setComments] = useState<CommentResponse[]>([]);

    const indexOfLastComment = currentPage * pageSize;
    const indexOfFirstComment = indexOfLastComment - pageSize;

    //another function
    const changeStatus = async (blogId: number) => {
        const change = await sendRequest<ApiResponse<BlogResponse>>({
            url: `${apiUrl}/blogs/status/${blogId}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });

        if (change.status === 200) {
            notification.success({
                message: change.message.toString(),
                description: change.errorMessage,
                showProgress: true,
            })
            router.refresh()
        } else {
            notification.error({
                message: change.message.toString(),
                description: change.errorMessage,
                showProgress: true,
            })
        }
    }

    const handleDeleteBlog = async (blogId: number) => {
        const deleteBlog = await sendRequest<ApiResponse<String>>({
            url: `${apiUrl}/blogs/delete/${blogId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        if (deleteBlog.status === 200) {
            notification.success({
                message: deleteBlog.message.toString(),
                description: deleteBlog.errorMessage,
                showProgress: true,
            })
            router.refresh()
        } else {
            notification.error({
                message: deleteBlog.message.toString(),
                description: deleteBlog.errorMessage,
                showProgress: true,
            })
        }
    }

    const columns: TableProps<BlogResponse>['columns'] = [
        {
            title: "STT",
            key: "index",
            width: '10%',
            render: (text, record, index) => <>{(index + 1) + (page - 1) * blogPageResponse.pageSize}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
        },
        {
            title: 'Tác giả',
            dataIndex: 'user',
            key: 'user',
            width: '15%',
            render: (user) => user?.fullname || "No author!"
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (createdAt: string) => (dayjs(createdAt).format("DD/MM/YYYY")),
            align: "center"
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '20%',
            render: (updatedAt: string) => (updatedAt ? dayjs(updatedAt).format("DD/MM/YYYY") : "Chưa cập nhật"),
            align: "center"
        },
        {
            title: 'Trạng thái',
            dataIndex: 'blogStatus',
            key: 'blogStatus',
            width: '10%',
            render: (status) => {
                switch (status) {
                    case 'DRAFT':
                        return (
                            <p className='text-orange-500'>Bản nháp</p>
                        );
                    case 'PRIVATE':
                        return (
                            <p className='text-purple-500'>Chỉ mình tôi</p>
                        );
                    case 'PUBLISH':
                        return (
                            <p className='text-green-500'>Công khai</p>
                        );
                    default:
                        return (
                            <p className='text-gray-500'>Không xác định</p>
                        );
                }
            },
            align: "center"
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <Tooltip placement="bottom" title={"Xem chi tiết"}>
                        <InfoCircleOutlined style={{ color: "blue" }} onClick={() => {
                            setIsModalOpen(true)
                            setSelectRecord(record);

                        }} />
                    </Tooltip>
                    {(session?.user.userId === record.user.userId || session?.user.roleName === "ADMIN") && (
                        <>
                            <Tooltip placement="bottom" title={"Xóa bài viết"}>
                                <Popconfirm
                                    placement="left"
                                    title="Xóa bài viết"
                                    description="Bạn có chắc chắn muốn xóa bài viết này không?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={() => { handleDeleteBlog(record.blogId) }}
                                >
                                    <DeleteOutlined style={{ color: "red" }} />
                                </Popconfirm>
                            </Tooltip>

                            {session?.user.userId === record.user.userId && (
                                (record.blogStatus === 'DRAFT' || record.blogStatus === 'PRIVATE') ? (
                                    <Tooltip placement="bottom" title={"Chuyển sang trạng thái công khai"}>
                                        <CheckOutlined
                                            style={{
                                                color: record.published ? "gray" : "#16db65",
                                                cursor: record.published === true ? "not-allowed" : "pointer",
                                                pointerEvents: record.published ? "none" : "auto"
                                            }}
                                            onClick={() => { changeStatus(record.blogId) }}

                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip placement="bottom" title={"Chuyển sang trạng thái chỉ mình tôi"}>
                                        <CloseOutlined
                                            style={{
                                                color: "red",
                                                cursor: "pointer",
                                                pointerEvents: record.blogStatus ? "auto" : "none"
                                            }}
                                            onClick={() => { changeStatus(record.blogId) }}
                                        />
                                    </Tooltip>
                                )
                            )}

                            {session?.user.userId === record.user.userId && (
                                <Tooltip placement="bottom" title={"Cập nhật"}>
                                    <EditOutlined
                                        style={{ color: "blue" }}
                                        onClick={() => {
                                            setOpenUpdate(true);
                                            setSelectRecord(record)
                                        }}
                                    />
                                </Tooltip>
                            )}

                        </>
                    )}


                </Space>
            ),
        },
    ]

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Tác giả',
            children: `${selectRecord?.user.fullname}`,
            style: {
                width: '60%'
            }

        },
        {
            key: '2',
            label: 'Ngày tạo',
            children: `${dayjs(selectRecord?.createdAt).format("DD/MM/YYYY")}`,
            style: {
                width: '40%'
            }
        },

    ];


    const IconText = ({ icon, text, onClick }: { icon: React.FC; text: string; onClick?: () => void }) => (
        <Space onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            {React.createElement(icon)}
            {text}
        </Space>
    );


    //function handle
    const handleExpandComment = (commentId: string) => {
        setExpendKey((prevKeys) => {
            const newKeys = prevKeys.includes(commentId)
                ? prevKeys.filter((key) => key !== commentId) // Đóng lại nếu đã mở
                : [...prevKeys, commentId]; // Mở rộng nếu chưa mở

            return newKeys;
        });
    };

    const convertToDataNode = (comments: CommentResponse[]): TreeProps["treeData"] => {
        return comments.map(comment => ({
            key: String(comment.commentId),
            title: (
                <Flex align="start" gap={10}>
                    <Avatar src={`${storageUrl}/avatar/${comment.user.avatar}`} alt={comment.user.fullname} />
                    <Space direction="vertical" size="small">
                        <Typography.Text strong>{comment.user.fullname}</Typography.Text>
                        <span>{comment.createdAt}</span>
                        <Typography.Text>{comment.content}</Typography.Text>
                        <div className="flex gap-5">
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
                            <IconText icon={MessageOutlined} text="" key="list-vertical-message" onClick={() => handleExpandComment(String(comment.commentId))} />
                        </div>
                    </Space>
                </Flex>
            ),

            children: convertToDataNode(comment.replies)
        }))
    }

    const treeData: TreeDataNode[] = selectRecord?.comments ? selectRecord.comments
        .filter((item) => (item.parentComment === null))
        .map((item) => ({
            key: String(item.commentId),
            title: (
                <Flex align="start" gap={10} className="w-full">
                    <Avatar src={`${storageUrl}/avatar/${item.user.avatar}`} alt={item.user.fullname} />
                    <Space direction="vertical" size="small">
                        <Typography.Text strong>{item.user.fullname}</Typography.Text>
                        <span>{dayjs(item.createdAt).format("DD/MM/YYYY HH:MM")}</span>
                        <Typography.Text>{item.content}</Typography.Text>
                        <div className="flex gap-5">
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
                            <IconText icon={MessageOutlined} text="" key="list-vertical-message" onClick={() => handleExpandComment(String(item.commentId))} />
                        </div>

                    </Space>
                </Flex>),


            children: convertToDataNode(item.replies)
        })) : [];

    const currentComments = treeData.slice(indexOfFirstComment, indexOfLastComment);
    const handleOnSelect = () => {
        console.log("check")
    }
    return (
        <>
            <Table
                className="overflow-y-auto max-h-[calc(100vh-100px)] mb-8 pl-6 pr-6"
                columns={columns}
                dataSource={blogPageResponse.content}
                rowKey={"blogId"}
                pagination={{
                    current: page,
                    pageSize: blogPageResponse.pageSize,
                    total: blogPageResponse.totalElements,
                    onChange(page, pageSize) {
                        const params = new URLSearchParams(searchParam);
                        params.set('page', page.toString());
                        router.replace(`${pathName}?${params}`);
                    },
                }}
                showSorterTooltip={false}
            />
            <Modal open={isModalOpen} onCancel={closeDetail} className="w-[90%]" footer={null} width={850}>
                {selectRecord ? (
                    <>
                        <h1 className="mb-4 text-[25px]"><strong>{selectRecord.title}</strong></h1>
                        <Descriptions items={items} />
                        <img src={selectRecord?.thumbnail ? `${storageUrl}/blog/${selectRecord.thumbnail}` : undefined} alt="" className="mt-5" />
                        <DisplayBlog content={selectRecord.content} />
                        <div>
                            <h1 className="mb-2 font-semibold">Tags:</h1>
                            <Flex gap="4px 0" wrap>
                                {selectRecord.hashtags.map((tag) => (
                                    <Tag color="blue" key={tag.tagId}>{tag.tagName}</Tag>
                                ))}
                            </Flex>
                        </div>
                        <hr className="my-9" />
                        <h1 className="font-[600] text-[20px] flex gap-3">
                            <CommentOutlined className="!text-blue-500" /> {selectRecord.totalComments}
                            <LikeOutlined className="!text-blue-500" />{selectRecord.totalLikes}
                        </h1>
                        <div className="mt-5">
                            {selectRecord.comments !== null && (
                                <ListComment
                                    blog={selectRecord}
                                    comments={comments}
                                    setComments={setComments}
                                    hasParent={-1}
                                />
                            )}
                        </div>
                    </>
                ) : <></>}
            </Modal>
            <BlogUpdate
                openUpdate={openUpdate}
                setOpenUpdate={setOpenUpdate}
                selectRecord={selectRecord}
                setSelectRecord={setSelectRecord}
            />

        </>
    )
}

export default BlogTable;