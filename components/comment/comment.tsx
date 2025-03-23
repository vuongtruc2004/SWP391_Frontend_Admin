import { sendRequest } from '@/utils/fetch.api'
import { apiUrl, storageUrl } from '@/utils/url'
import { LikeOutlined, MessageOutlined } from '@ant-design/icons'
import IconContext from '@ant-design/icons/lib/components/Context'
import { Avatar, Space } from 'antd'
import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ListComment from './list.comment'


const SingleComment = ({ commentResponse, blog, setComments }: {
    commentResponse: CommentResponse,
    blog: BlogDetailsResponse,
    setComments: Dispatch<SetStateAction<CommentResponse[]>>
}) => {
    const [childrenVisibility, setChildrenVisibility] = useState<{ [key: number]: boolean }>({});
    const [childComment, setChildComment] = useState<CommentResponse[]>(commentResponse.replies);
    const IconText = ({ icon, text, onClick }: { icon: React.FC; text: string; onClick?: () => void }) => (
        <Space onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const toggleChildrenVisibility = (commentId: number) => {
        setChildrenVisibility(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    }

    useEffect(() => {
        const getChildComment = async () => {
            const getAllChildComment = await sendRequest<ApiResponse<CommentResponse[]>>({
                url: `${apiUrl}/comments/child-comment/${commentResponse.commentId}`,
                method: 'GET'
            });
            if (getAllChildComment.status === 200) {
                setChildComment(getAllChildComment.data);
            }
        }
        getChildComment
    }, [childrenVisibility[commentResponse.commentId]]);


    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <div className='flex gap-x-5 my-5'>
                        <div>
                            <Avatar alt={commentResponse.user.fullname} size={50} src={`${storageUrl}/avatar/${commentResponse.user.avatar}`} />
                        </div>
                        <div>
                            <p className='font-semibold'>{commentResponse.user.fullname}</p>
                            <span className='text-sm text-[#3a0ca3]'>{dayjs(commentResponse.createdAt).format("DD/MM/YYYY HH:MM")}</span >
                        </div >
                    </div >
                    <div className='pl-3 text-[17px]'>
                        {commentResponse.content}
                    </div>
                    <div className='flex gap-5'>
                        <IconText icon={LikeOutlined} text={`${commentResponse.likes.length}`} key="list-vertical-like-o" />
                        <IconText icon={MessageOutlined} text={`${commentResponse.replies.length}`} key="list-vertical-message" onClick={() => toggleChildrenVisibility(commentResponse.commentId)} />
                    </div>
                </div>
            </div>
            {childComment !== null && (
                <>
                    <div className={`flex ${!childrenVisibility[commentResponse.commentId] ? 'hidden' : ''}`}>
                        <div className='w-[2px] bg-gray-500'></div>
                        <div className='pl-6 grow box-border'>
                            <ListComment
                                comments={childComment}
                                blog={blog}
                                setComments={setChildComment}
                                hasParent={commentResponse.commentId}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default SingleComment
