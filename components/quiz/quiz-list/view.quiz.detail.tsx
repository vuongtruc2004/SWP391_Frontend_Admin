import { ArrowLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Button, Collapse, Drawer } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";
const ViewQuizDetail = (props: {
    quizDetail: QuizResponse | null
}) => {
    const { quizDetail } = props;
    const router = useRouter();


    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };
    console.log("quizDetail>>>", quizDetail);
    return (
        <>
            <div className="ml-3 mt-3">
                <div className="flex gap-5 mb-5">
                    <Link href="/quiz">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => {
                                router.push("/quiz");
                            }}
                        ></Button>
                    </Link>
                    <span className="text-xl font-bold ">THÔNG TIN CHI TIẾT</span>
                </div>

                {quizDetail ? <>
                    <div className="ml-3 mb-2">


                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tiêu đề bài kiểm tra: </span>{quizDetail.title}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Trạng thái: </span>{quizDetail.published ? 'Đang mở' : 'Bị đóng'}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Thời gian: </span>{quizDetail.duration} phút</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Cho xem đáp án: </span>{quizDetail.allowSeeAnswers ? 'Đang mở' : 'Bị đóng'}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Cập nhật lần cuối: </span>{quizDetail.updatedAt == null ? 'Chưa có dữ liệu' : dayjs(quizDetail.updatedAt).format("DD/MM/YYYY")}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Chương học: </span>{quizDetail.chapter != null ? quizDetail.chapter.title : ''}</div>


                        <div className='mb-2'>
                            <span className='text-blue-500 text-base mr-2 font-bold'>
                                Số lượng câu hỏi:
                            </span>{quizDetail.questions.length}
                        </div>
                        <span className='text-blue-900 text-base mr-2 font-bold'>Danh sách câu hỏi: </span>
                    </div>

                    <div className="ml-5">


                        <ul className="list-none">
                            {quizDetail.questions.map((question, index) => (
                                <li key={index} className="mb-4 border-b pb-2">
                                    <div
                                        className="flex items-center gap-2 cursor-pointer font-medium text-gray-700"
                                        onClick={() => handleToggle(index)}
                                    >
                                        <DoubleRightOutlined style={{ color: "green" }} />
                                        {question.title}
                                    </div>

                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === index ? "auto" : 0, opacity: activeQuestion === index ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="ml-6 mt-2">
                                            {question.answers && Array.isArray(question.answers) ? (
                                                question.answers.map((answer, idx) => (
                                                    <li key={idx} className="list-disc text-green-600">
                                                        {answer.content}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500">Không có đáp án đúng</li>
                                            )}
                                        </ul>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </div>


                </>
                    :
                    <div>Không có dữ liệu</div>
                }
            </div>


        </>
    )
}


export default ViewQuizDetail;