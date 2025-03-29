import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Popconfirm, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DeleteChapterModal = ({ chapter }: { chapter: ChapterResponse }) => {
    const { data: session, status } = useSession();
    const { refresh } = useRouter();

    const handleDeleteChapter = async () => {
        if (status === 'authenticated') {
            const response = await sendRequest<ApiResponse<void>>({
                url: `${apiUrl}/chapters/${chapter.chapterId}`,
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
            title="Xóa chương học"
            description="Bạn có chắc chắn muốn xóa chương học này không?"
            onConfirm={handleDeleteChapter}
            okText="Xóa"
            cancelText="Hủy"
        >
            <Tooltip title="Xóa chương học" placement="bottom">
                <DeleteOutlined className="text-red-500 cursor-pointer" />
            </Tooltip>
        </Popconfirm>
    )
}

export default DeleteChapterModal