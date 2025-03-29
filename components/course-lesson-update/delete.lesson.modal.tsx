import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Popconfirm, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DeleteLessonModal = ({ lesson }: { lesson: LessonResponse }) => {
    const { data: session, status } = useSession();
    const { refresh } = useRouter();

    const handleDeleteLesson = async () => {
        if (status === 'authenticated') {
            const response = await sendRequest<ApiResponse<void>>({
                url: `${apiUrl}/lessons/${lesson.lessonId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });

            if (response.status === 200) {
                message.success(response.message.toString());
                refresh();
            } else {
                message.error(response.message.toString());
            }
        }
    }

    return (
        <Popconfirm
            title="Xóa bài giảng"
            description={`Bạn có chắc chắn muốn xóa ${lesson.lessonType === 'DOCUMENT' ? 'tài liệu' : 'video'} này không?`}
            onConfirm={handleDeleteLesson}
            okText="Xóa"
            cancelText="Hủy"
        >
            <Tooltip title={`Xóa ${lesson.lessonType === 'DOCUMENT' ? "tài liệu" : "video"}`} placement="bottom" >
                <DeleteOutlined className="text-red-500 cursor-pointer" />
            </Tooltip>
        </Popconfirm>
    )
}

export default DeleteLessonModal