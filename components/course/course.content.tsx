import { convertSecondToTime } from '@/helper/course.details.helper'
import { FileDoneOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Collapse, CollapseProps } from 'antd'
import Box from 'next-auth/providers/box'
import React from 'react'

const CourseContent = (props: { courseDetail: CourseDetailsResponse }) => {
    const { courseDetail } = props

    const items: CollapseProps['items'] = courseDetail.chapters.map((chapter, index) => ({
        key: chapter.chapterId,
        label: `Chương ${index}: ${chapter.title}`,
        children: chapter.lessons.map((lesson) => (
            <div key={lesson.lessonId + '_' + lesson.title}>
                {lesson.lessonType === "VIDEO" ? (
                    <div className='flex justify-between'>
                        <div className="flex items-center">
                            <PlayCircleOutlined style={{ fontSize: '1.2rem' }} className="text-blue-300 mr-5" />
                            <div>
                                <p>{lesson.title}</p>
                                <p className="text-gray-600 text-sm">Video</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">{convertSecondToTime(lesson.duration)}</p>
                    </div>
                ) : (
                    <div className='flex justify-between my-4'>
                        <div className="flex items-center">
                            <FileDoneOutlined style={{ fontSize: '1.2rem' }} className="text-blue-300 mr-5" />
                            <div>
                                <p>{lesson.title}</p>
                                <p className="text-gray-600 text-sm">Tài liệu đọc thêm</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">{Math.ceil(lesson.duration / 60)} phút đọc</p>
                    </div>
                )}
            </div>
        ))

    }))
    return (
        <div className='w-full'>
            <Collapse items={items} size='large' style={{
                width: '100%'
            }} />
        </div>
    )
}

export default CourseContent
