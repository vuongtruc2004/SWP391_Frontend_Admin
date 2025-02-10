import { storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer } from 'antd'
import dayjs from 'dayjs'
import React, { SetStateAction } from 'react'

const ViewCourseDetail = (props: {
    course: CourseResponse | null
    openDraw: any
    setOpenDraw: any
    setCourse: React.Dispatch<SetStateAction<CourseResponse | null>>
}) => {

    const { course, openDraw, setOpenDraw } = props

    const onClose = () => {
        setOpenDraw(false);
    };

    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {course ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Id:</span>{course.courseId}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên khóa học: </span>{course.courseName}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giảng viên: </span>{course.expert.user.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mô tả: </span>{course.description}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giá: </span>{course.price}</div>
                    <div className='mb-2'>
                        <span className='text-blue-500 text-base mr-2 font-bold'>Ngày tạo: </span>
                        {dayjs(course.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className='mb-2'>
                        <span className='text-blue-500 text-base mr-2 font-bold'>Ngày chỉnh sửa: </span>
                        {course.updatedAt ? dayjs(course.updatedAt).format("DD/MM/YYYY") : "Chưa chỉnh sửa"}
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>
                        Số lượng bài học: </span>{course.lessons.length}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...course.lessons].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course.title}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>
                        Số lượng môn học: </span>{course.subjects.length}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...course.subjects].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course.subjectName}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượt thích: </span>{course.totalLikes}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượt bình luận: </span>{course.totalComments}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượt học viên: </span>{course.totalPurchased}</div>


                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/course/${course.thumbnail}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={course.courseName}
                            />
                        </div>
                    </div>

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>)
}

export default ViewCourseDetail