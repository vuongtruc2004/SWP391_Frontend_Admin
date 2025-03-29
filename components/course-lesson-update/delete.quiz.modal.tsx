import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Popconfirm, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DeleteQuizModal = ({ quiz }: { quiz: QuizInfoResponse }) => {
    const { data: session, status } = useSession();
    const { refresh } = useRouter();

    const handleDeleteQuiz = async () => {
        if (status === 'authenticated') {
            const response = await sendRequest<ApiResponse<void>>({
                url: `${apiUrl}/quizzes/${quiz.quizId}`,
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
            title="Xóa bài kiểm tra (Bài kiểm tra sẽ không bị xóa, bạn chỉ xóa nó khỏi chương này)"
            description={`Bạn có chắc chắn muốn xóa bài kiểm tra này không?`}
            onConfirm={handleDeleteQuiz}
            okText="Xóa"
            cancelText="Hủy"
        >
            <Tooltip title="Xóa bài kiểm tra" placement="bottom" >
                <DeleteOutlined className="text-red-500 cursor-pointer" />
            </Tooltip>
        </Popconfirm>
    )
}

export default DeleteQuizModal