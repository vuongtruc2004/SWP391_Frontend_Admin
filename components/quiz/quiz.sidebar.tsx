import { DeleteOutlined } from "@ant-design/icons"
import { Button, Popconfirm } from "antd"

const QuizSidebar = () => {
    return (
        <div className="w-[300px] shrink-0 border border-r-gray-300 h-[calc(100vh-61.6px)] sticky top-0 left-0">
            <div className="flex items-center justify-between py-2 px-3">
                <h1>Số câu hỏi trong đề: <span className="text-blue-500 font-semibold">{40}</span></h1>

                <Popconfirm
                    title="Xóa tất cả câu hỏi"
                    description="Bạn có muốn xóa toàn bộ câu hỏi không?"
                    // onConfirm={confirm}
                    // onCancel={cancel}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />

                </Popconfirm>
            </div>
        </div>
    )
}

export default QuizSidebar
