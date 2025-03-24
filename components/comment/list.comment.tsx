import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import SingleComment from './comment';
import { useSession } from 'next-auth/react';

const ListComment = ({ blog, comments, setComments, hasParent }: {
    blog: BlogDetailsResponse,
    comments: CommentResponse[],
    setComments: Dispatch<SetStateAction<CommentResponse[]>>,
    hasParent: number,
}) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { data: session } = useSession();
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastCommentElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || !hasMore) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (hasParent > -1) return;
        const getCommentOfBlog = async () => {
            const getCommentRequest = await sendRequest<ApiResponse<PageDetailsResponse<CommentResponse[]>>>({
                url: `${apiUrl}/comments?page=${page}&size=5&filter=blog.blogId:${blog.blogId} and parentComment is null&sort=createdAt,desc&sort=commentId,asc`,
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                }
            });
            if (getCommentRequest.status === 200) {
                setComments(prev => {
                    //loc tat ca cac comment da ton tai de tranh trung key
                    const newComments = getCommentRequest.data.content.filter(newComment =>
                        !prev.some(comment => comment.commentId === newComment.commentId) //kiểm tra xem newComment.commentId đã tồn tại trong prev chưa. Nếu có thì loại bỏ nó, chưa thì giữ lại thêm vào danh sách
                    );
                    return [...prev, ...newComments];
                });
                if (page >= getCommentRequest.data.totalPages) {
                    setHasMore(false);
                }
            }
            setLoading(false);
        }
        getCommentOfBlog();
        if (hasMore) {
            getCommentOfBlog()
        }
    }, [page, hasMore]);
    return (
        <>
            <div>
                {comments.map((comment, index) => {
                    return (
                        <div key={`${comment.commentId} - ${index}`}>
                            <SingleComment
                                commentResponse={comment}
                                blog={blog}
                                setComments={setComments}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ListComment
