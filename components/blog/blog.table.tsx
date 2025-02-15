'use client'
import { CheckOutlined, CloseOutlined, DeleteOutlined, InfoCircleOutlined, LikeOutlined, MessageOutlined, StarOutlined, ToTopOutlined } from "@ant-design/icons"
import { Avatar, Descriptions, DescriptionsProps, Empty, List, Modal, Popconfirm, Space, Table, TableProps } from "antd"
import dayjs from "dayjs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import BlogUpdate from "./blog.update"
import './overwrite.style.scss'
import { apiUrl, storageUrl } from "@/utils/url"

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

    const data = selectRecord?.comments ? selectRecord?.comments
        .filter((item) => (item.parentComment === null))
        .map((item) => ({
            title: item.user.fullname,
            avatar: `${storageUrl}/avatar/${item.user.avatar}`,
            description: `${dayjs(item.createdAt).format("DD/MM/YYYY")}`,
            content: item.content,
            numReplies: item.replies.length,

        })) : [];

    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );
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
                        <img src={selectRecord?.thumbnail ? `${storageUrl}/blog/${selectRecord.thumbnail}` : ""} alt="" className="mt-5" />
                        <div dangerouslySetInnerHTML={{ __html: selectRecord.content }} className="my-10"></div>
                        <hr className="mb-9" />
                        <h1 className="font-[600] text-[20px]"><strong>Bình luận:<Avatar size={30} style={{ marginLeft: "10px" }}>{selectRecord.totalComments}</Avatar></strong></h1>
                        <div>

                            {selectRecord.comments ? (
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={{
                                        onChange: (page) => {
                                            console.log(page);
                                        },
                                        pageSize: 3,
                                    }}
                                    dataSource={data}
                                    renderItem={(item) => (
                                        <List.Item
                                            key={item.title}
                                            actions={[
                                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                                <IconText icon={MessageOutlined} text={item.numReplies ? `${item.numReplies}` : "0"} key="list-vertical-message" />,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.avatar} />}
                                                title={item.title}
                                                description={item.description}
                                            />
                                            {item.content}
                                        </List.Item>
                                    )}
                                />
                            ) : (<Empty />)}

                            {/* <List.Item.Meta
                                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                /> */}
                        </div>

                    </>

                ) : (
                    <Empty />
                )}
            </Modal >
            <BlogUpdate
                openUpdate={openUpdate}
                setOpenUpdate={setOpenUpdate}
                selectRecord={selectRecord}
            />
        </>
    )
}

export default BlogTable;