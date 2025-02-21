import { DoubleRightOutlined } from "@ant-design/icons";
import { Collapse, Drawer } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const ViewQuizDetail = (props: {
    openDraw: any,
    quizDetail: QuizResponse | null,
    setOpenDraw: any
}) => {
    const { openDraw, quizDetail, setOpenDraw } = props;
    const onClose = () => {
        setOpenDraw(false);
    }


    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };
    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {quizDetail ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tiêu đề bài kiểm tra: </span>{quizDetail.title}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượt kiểm tra: </span>{quizDetail.maxAttempts}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Trạng thái: </span>{quizDetail.published ? 'Đang mở' : 'Bị đóng'}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Bắt đầu: </span>{quizDetail.startedAt == null ? 'Vô thời hạn' : dayjs(quizDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Kết thúc: </span>{quizDetail.endedAt == null ? 'Vô thời hạn' : dayjs(quizDetail.endedAt).format("DD/MM/YYYY HH:mm:ss")}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tác giả: </span>{quizDetail.expert.user.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Bài học: </span>{quizDetail.lesson.title}</div>


                    <div className='mb-2'>
                        <span className='text-blue-500 text-base mr-2 font-bold'>
                            Số lượng câu hỏi:
                        </span>{quizDetail.questions.length}
                    </div>

                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: 'Xem chi tiết câu hỏi',
                                children: (
                                    <ul className='ml-4'>
                                        {quizDetail.questions.map((question, index) => (
                                            <li key={index} className="mb-2">

                                                <div
                                                    className="flex items-center gap-2 cursor-pointer font-medium text-gray-700"
                                                    onClick={() => handleToggle(index)}>
                                                    <DoubleRightOutlined style={{ color: 'green' }} />
                                                    {question.title}
                                                </div>

                                                {activeQuestion === index && (
                                                    <ul className="ml-6 mt-2 ">
                                                        {question.correctAnswer.map((answer, idx) => (
                                                            <li key={idx} className="list-disc ">
                                                                <span className="text-green-600">{answer} </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ),
                            },
                        ]}
                    />

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>
    )
}


export default ViewQuizDetail;