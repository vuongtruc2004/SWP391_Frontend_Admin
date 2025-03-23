'use client'
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd"
import Link from "next/link"
import { useQuizCreate } from "@/wrapper/quiz-create/quiz.create.wrapper";

const QuizHeader = ({ course }: { course: CourseDetailsResponse }) => {
    const { form } = useQuizCreate();

    return (
        <div className="flex items-center justify-between py-3.5 px-5 border border-b-gray-300 relative">
            <Tooltip title="Quay về trang quản lí khóa học" color="blue">
                <Link href={"/course"} className="flex items-center justify-start gap-x-3 hover:text-blue-500 transition-all duration-200">
                    <LeftOutlined />
                    {course.courseName}
                </Link>
            </Tooltip>

            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-1 text-center font-semibold text-lg">
                Tạo bài kiểm tra
            </h1>

            <Button type="primary" onClick={() => form.submit()} icon={<PlusOutlined />} iconPosition="start" style={{ paddingInline: '20px' }}>
                Tạo bài kiểm tra
            </Button>
        </div>
    )
}

export default QuizHeader
