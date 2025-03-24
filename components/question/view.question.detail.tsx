import { CheckOutlined, CloseOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer } from 'antd'
import React, { SetStateAction } from 'react'

interface IProps {
    question: QuestionResponse | null
    openDraw: any
    setOpenDraw: any
    setQuestion: React.Dispatch<SetStateAction<QuestionResponse | null>>
}
const ViewQuestionDetail = (props: IProps) => {

    const { question, openDraw, setOpenDraw } = props

    const onClose = () => {
        setOpenDraw(false);
    };



    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {question ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Id:</span>{question.questionId}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Nội dung câu hỏi: </span>{question.title}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tất cả câu trả lời:
                    </span>{question.answers.length}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...question.answers].map((answer, index) => (
                                            <ol key={index}>
                                                <span className='gap-2 mr-2' style={{ fontWeight: answer.correct ? 'bold' : 'normal' }}>
                                                    {answer.correct ?
                                                        <CheckOutlined style={{ color: 'green', marginRight: '10px' }} /> :
                                                        <CloseOutlined style={{ color: 'red', marginRight: '10px' }} />
                                                    }
                                                    {answer.content}
                                                </span>
                                            </ol>
                                        ))}
                                    </ul>


                            }]}
                        />
                    </div>
                    {/* <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Bài kiểm tra liên quan:
                    </span>{question.quizzes.length}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...question.quizzes].map((quizze, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{quizze}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div> */}

                    {/* 
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>
                        Số lượng khóa học: </span>{question.totalCourses}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...question.listCourses].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div> */}


                    {/* <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/avatar/${question.avatar}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={question.fullname}
                            />
                        </div>
                    </div> */}

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>)
}

export default ViewQuestionDetail