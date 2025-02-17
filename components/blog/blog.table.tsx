'use client'
import { CheckOutlined, CloseOutlined, DeleteOutlined, InfoCircleOutlined, LikeOutlined, MessageOutlined, StarOutlined, ToTopOutlined } from "@ant-design/icons"
import { Avatar, Button, Descriptions, DescriptionsProps, Empty, Flex, List, Modal, Pagination, Popconfirm, Space, Table, TableProps, Tree, TreeDataNode, TreeProps, Typography } from "antd"
import dayjs from "dayjs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import BlogUpdate from "./blog.update"
import './overwrite.style.scss'
import { apiUrl, storageUrl } from "@/utils/url"
import { sendRequest } from "@/utils/fetch.api"
import { root } from "postcss"

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
    const openDetail = () => setIsModalOpen(true);
    const closeDetail = () => setIsModalOpen(false);
    const [selectRecord, setSelectRecord] = useState<BlogDetailsResponse | null>(null)
    const [openUpdate, setOpenUpdate] = useState(false);
    const [expendKey, setExpendKey] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    // const [replies, setReplies] = useState<CommentResponse[]>([]);
    const [openFormCreate, setOpenFormCreate] = useState(false);

    const indexOfLastComment = currentPage * pageSize;
    const indexOfFirstComment = indexOfLastComment - pageSize;

    const columns: TableProps<BlogResponse>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'blogId',
            key: 'id',
            width: '10%',
            sorter: {
                compare: (a, b) => a.blogId - b.blogId,
            },
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Người tạo',
            dataIndex: 'user',
            key: 'user',
            width: '20%',
            sorter: (a, b) => a.user.fullname.localeCompare(b.user.fullname),
            render: (user) => user?.fullname || "No author!"
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record: any) => (
                <Space size="middle">
                    <InfoCircleOutlined style={{ color: "blue" }} onClick={() => {
                        setIsModalOpen(true)
                        setSelectRecord(record);

                    }} />
                    <Popconfirm
                        placement="left"
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa khóa học này không?"
                        okText="Có"
                        cancelText="Không"
                    >
                        <DeleteOutlined style={{ color: "red" }} />
                    </Popconfirm>
                    <CheckOutlined
                        style={{
                            color: record.accepted ? "gray" : "#16db65",
                            cursor: record.accepted ? "not-allowed" : "pointer",
                            pointerEvents: record.accepted ? "none" : "auto"
                        }}

                    />
                    <CloseOutlined
                        style={{
                            color: record.accepted ? "red" : "gray",
                            pointerEvents: record.accepted ? "auto" : "none"
                        }}

                    />
                    <ToTopOutlined onClick={() => {
                        setOpenUpdate(true);
                        setSelectRecord(record)
                    }} />

                </Space>
            ),
        },
    ]

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Tác giả:',
            children: `${selectRecord?.user.fullname}`,
            style: {
                width: '60%'
            }

        },
        {
            key: '2',
            label: 'Ngày tạo:',
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

            console.log("Danh sách expandedKeys:", newKeys); // Kiểm tra log
            return newKeys;
        });
    };

    const handleOnClickButton = () => {
        setOpenFormCreate(true);
    }

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
                <Flex align="start" gap={10}>
                    <Avatar src={`${storageUrl}/avatar/${item.user.avatar}`} alt={item.user.fullname} />
                    <Space direction="vertical" size="small">
                        <Typography.Text strong>{item.user.fullname}</Typography.Text>
                        <span>{item.createdAt}</span>
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
    // const repliesResponse = async (parentCommentId: number) => {
    //     const repResponse = await sendRequest<ApiResponse<CommentResponse[] | null>>({
    //         url: `${apiUrl}/comments/reply/${parentCommentId}`,
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });


    //     setReplies(repResponse.data ? repResponse.data : []);

    // };







    const handleOnSelect = () => {
        console.log("check")
    }
    console.log("check comments: ", selectRecord?.comments)
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
                        <h1 className="mb-4"><strong>{selectRecord.title}</strong></h1>
                        <Descriptions items={items} />
                        <img src={selectRecord?.thumbnail ? `${storageUrl}/blog/${selectRecord.thumbnail}` : undefined} alt="" className="mt-5" />
                        <div dangerouslySetInnerHTML={{ __html: selectRecord.content }} className="my-10"></div>
                        <hr className="mb-9" />
                        <h1 className="font-[600] text-[20px]">
                            <strong>Bình luận:<Avatar size={30} style={{ marginLeft: "10px" }}>{selectRecord.totalComments}</Avatar></strong>
                        </h1>
                        <div className="mt-5">
                            <Tree
                                showLine
                                onSelect={handleOnSelect}
                                treeData={currentComments}
                                showIcon={false}
                                switcherIcon={null}
                                expandedKeys={expendKey}
                                onExpand={(keys) => { console.log("Các key đang mở:", keys); setExpendKey(keys as string[]) }}
                            />
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={treeData?.length}
                                onChange={(page) => setCurrentPage(page)}
                                style={{ marginTop: 16, textAlign: "center" }}
                                align="end"
                            />
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
            {/* <BlogCreate
                openFormCreate={openFormCreate}
                setOpenFormCreate={setOpenFormCreate}
            /> */}
        </>
    )
}

export default BlogTable;