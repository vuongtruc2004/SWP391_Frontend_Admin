'use client'
import { sendRequest } from '@/utils/fetch.api';
import { storageUrl } from '@/utils/url';
import { useCollapseContext } from '@/wrapper/collapse-sidebar/collapse.sidebar.wrapper';
import { ArrowLeftOutlined, CheckOutlined, ClockCircleOutlined, HistoryOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Carousel, Divider, Image, Rate, Tag } from 'antd';
import dayjs from 'dayjs';
import { url } from 'inspector';
import React, { useEffect } from 'react'
import { IoIosInfinite } from 'react-icons/io';
import CourseContent from './course.content';
import { getNumberOfLessonType } from '@/helper/course.details.helper';
import CourseRate from './course_rate/course.rates';

export const getVideoIdFromUrl = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
}

export const countTotalTime = (course: CourseDetailsResponse): string => {
    let totalSeconds = 0;
    for (let chapter of course.chapters) {
        totalSeconds += chapter.lessons.reduce((sum, lesson) => sum + Math.max(lesson.duration || 0, 60), 0);
    }

    const totalMinutes = Math.floor(totalSeconds / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return [
        days > 0 ? `${days} ngày` : "",
        hours > 0 ? `${hours} giờ` : "",
        minutes > 0 ? `${minutes} phút` : ""
    ].filter(Boolean).join(" ") || "0 phút";
};

const ViewCourseDetail = (props: { courseDetail: CourseDetailsResponse, expertDetail: ExpertDetailsResponse }) => {
    const { courseDetail, expertDetail } = props;
    const { collapsed, setCollapsed } = useCollapseContext();

    console.log("before", collapsed);
    useEffect(() => {
        if (!collapsed) {
            setCollapsed(true);
            console.log("after", collapsed)
        }
    }, []);



    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    return (
        <>
            {/* <div className='w-full h-full flex flex-col relative'> */}
            <div className='bg-slate-600 w-full h-[50%]'>
                <div className='ml-28 my-14'>
                    <h1 className='text-white font-semibold text-[30px]'>{courseDetail.courseName}</h1>
                    <p className='text-white font-semibold'>{courseDetail.description}</p>
                    <Rate disabled defaultValue={courseDetail.averageRating === null ? 0 : Number(courseDetail.averageRating.toFixed(1))} style={{ marginTop: '25px' }} /> <span className='ml-4 text-[20px] text-white font-semibold'>{courseDetail.averageRating === null ? 0 : courseDetail.averageRating.toFixed(1)}</span>
                    <div className='text-white font-semibold text-[16px]'>
                        ({courseDetail.totalRating === null ? 0 : courseDetail.totalRating} đánh giá)
                    </div>
                    <div className='mt-8'>
                        {courseDetail.subjects.map(subject => (
                            <Tag color="#2db7f5" key={subject.subjectId}>{subject.subjectName}</Tag>
                        ))}
                    </div>
                    <div className='mt-5 flex gap-3'>
                        <Avatar size={64} src={`${storageUrl}/avatar/${expertDetail.user.avatar}`} />
                        <div className='self-center'>
                            <h2 className='text-white font-semibold text-[20px]'>{expertDetail.user.fullname}</h2>
                            <p className='text-[#dee2e6]'>{expertDetail.job}</p>
                        </div>
                    </div>

                </div>

            </div>
            <div className='grid grid-cols-[60%_30%] '>
                <div className='mt-3 ml-32'>
                    <div>
                        <h1 className='text-[30px] font-semibold'>Mục tiêu khóa học</h1>
                        <div className='grid grid-cols-2 gap-x-5 gap-y-3 mt-3'>
                            {courseDetail.objectives.map((object, index) => (
                                <p key={`${courseDetail.courseId}-objective-${index}`}><CheckOutlined style={{ color: '#52b788', fontSize: '20px' }} /> {object}</p>
                            ))}
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h1 className='text-[30px] font-semibold'>Nội dung khóa học</h1>
                        <div className="flex items-center justify-between text-gray-600 mb-4 px-1 text-sm">
                            <p className="flex items-center gap-x-1">
                                <strong className="text-black">{courseDetail?.chapters.length}</strong> chương
                                <span>•</span>
                                <strong className="text-black">{getNumberOfLessonType(courseDetail, "VIDEO")}</strong> bài giảng
                                <span>•</span>
                                <strong className="text-black">{getNumberOfLessonType(courseDetail, 'DOCUMENT')}</strong> bài đọc
                                <span>•</span>
                                <strong className="text-black">{0}</strong> bài kiểm tra
                            </p>

                        </div>
                        <div className='mt-3'>
                            <CourseContent courseDetail={courseDetail} />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <h1 className='text-[30px] font-semibold'>Đánh giá về khóa học</h1>
                        <div>
                            <CourseRate courseDetail={courseDetail} />
                        </div>
                    </div>

                </div>
                <div className='border bg-white border rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] w-[30%] absolute top-[160px] right-12 pb-11'>
                    <div className='border rounded-lg overflow-hidden h-[100%]'>
                        <Carousel afterChange={onChange}>
                            <div className='h-full'>
                                <img src={`${storageUrl}/course/${courseDetail.thumbnail}`} alt="" className='h-[280px] w-full' />
                            </div>
                            <div className='overflow-hidden'>
                                <iframe
                                    width='100%'
                                    height='280px'
                                    src={`https://www.youtube.com/embed/${getVideoIdFromUrl(courseDetail.introduction)}?autoplay=0`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Carousel>
                    </div>
                    <div className='mt-8 mx-5'>
                        <p><UserOutlined /> Số lượng người đăng kí khóa học: <span className='text-blue-600'>{courseDetail.totalPurchased === null ? 0 : courseDetail.totalPurchased}</span></p>
                    </div>
                    <div className='mt-3 mx-5'>
                        <p><ClockCircleOutlined /> Tổng thời lượng: <span className='text-green-600'>{countTotalTime(courseDetail)}</span></p>
                    </div>
                    <div className='mt-3 mx-5 flex gap-1 items-center'>
                        <IoIosInfinite className='text-[20px] seft-center' /> <p> Quyền truy cập đầy đủ suốt đời</p>
                    </div>
                    <div className='mt-3 mx-5'>
                        <p><HistoryOutlined /> Cập nhật lần cuối: <span>{courseDetail.updatedAt === "" ? dayjs(courseDetail.createdAt).format("DD/MM/YYYY") : dayjs(courseDetail.updatedAt).format("DD/MM/YYYY")}</span></p>
                    </div>
                    <div className='mt-4 mx-5 text-[40px] font-semibold'>
                        {courseDetail.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                    </div>
                </div>
            </div>
            {/* </div> */}
        </>

    )
}

export default ViewCourseDetail
