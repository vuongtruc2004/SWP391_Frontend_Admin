'use client'
import '@ant-design/v5-patch-for-react-19';
import { formatDateTime, formatToHHMMSS, formatToText_HoursMinutes } from "@/utils/format";
import { ArrowLeftOutlined, CaretRightOutlined, ClockCircleOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined, PlusOutlined, ProfileOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Button, Collapse, CollapseProps, Divider, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import CreateChapterModal from "./create.chapter.modal";
import CreateVideoModal from "./create.video.modal";
import CreateDocumentModal from "./create.document";
import UpdateChapterModal from "./update.chapter.modal";
import UpdateVideoModal from "./update.video.modal";
import UpdateDocumentModal from "./update.document.modal";
import DeleteChapterModal from './delete.chapter.modal';
import Link from 'next/link';
import DeleteLessonModal from './delete.lesson.modal';
import DeleteQuizModal from './delete.quiz.modal';

const UpdateLessonsForm = ({ course }: { course: CourseDetailsResponse }) => {
    const chapters = course.chapters;

    const [items, setItems] = useState<CollapseProps['items']>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [openCreateChapterModal, setOpenCreateChapterModal] = useState(false);
    const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);

    const [openCreateVideoModal, setOpenCreateVideoModal] = useState(false);
    const [openUpdateVideoModal, setOpenUpdateVideoModal] = useState(false);

    const [openCreateDocumentModal, setOpenCreateDocumentModal] = useState(false);
    const [openUpdateDocumentModal, setOpenUpdateDocumentModal] = useState(false);

    const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);

    useEffect(() => {
        const newItems: CollapseProps['items'] = chapters.map((chapter, chapterIndex) => {
            return ({
                key: chapter.chapterId + chapter.title,
                label: (
                    <div className="flex items-center justify-between pr-3 gap-x-5">
                        <p className="font-semibold">Chương {chapterIndex + 1}. {chapter.title}</p>

                        <div className="flex items-center gap-x-3" onClick={(e) => e.stopPropagation()}>
                            <Tooltip title="Cập nhật chương học" placement="bottom">
                                <EditOutlined
                                    className="text-orange-500 cursor-pointer"
                                    onClick={() => {
                                        setSelectedChapter(chapter);
                                        setOpenUpdateChapterModal(true);
                                    }}
                                />
                            </Tooltip>

                            <DeleteChapterModal chapter={chapter} />
                        </div>
                    </div>
                ),
                children: (
                    <div>
                        <p><span className="font-semibold">Mô tả về chương học:</span> {chapter.description}</p>
                        <ul className="mt-3">
                            {chapter.lessons.map((lesson, lessonIndex) => {
                                return (
                                    <li key={lesson.lessonType + lessonIndex} className={`flex items-center justify-between gap-x-5 px-4 py-5 border-b border-gray-300`}>
                                        <div className="flex items-center gap-x-3">
                                            {lesson.lessonType === 'VIDEO' ? (
                                                <PlayCircleOutlined className="text-xl" />
                                            ) : (
                                                <ProfileOutlined className="text-xl" />
                                            )}

                                            <div>
                                                <p><span className="font-semibold">{lessonIndex + 1}. {lesson.lessonType === "VIDEO" ? "Video" : "Tài liệu đọc thêm"}: </span>{lesson.title}</p>
                                                <div className='flex items-center gap-x-2'>
                                                    <ClockCircleOutlined />
                                                    <p>{formatToHHMMSS(lesson.duration)} {lesson.lessonType === 'DOCUMENT' && 'phút đọc'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-3">
                                            <Tooltip title={`Cập nhật ${lesson.lessonType === 'DOCUMENT' ? "tài liệu" : "video"}`} placement="bottom" >
                                                <EditOutlined className="text-orange-500 cursor-pointer" onClick={() => {
                                                    setSelectedChapter(chapter);
                                                    setSelectedLesson(lesson);
                                                    if (lesson.lessonType === 'VIDEO') {
                                                        setOpenUpdateVideoModal(true);
                                                    } else {
                                                        setOpenUpdateDocumentModal(true);
                                                    }
                                                }} />
                                            </Tooltip>

                                            <DeleteLessonModal lesson={lesson} />
                                        </div>
                                    </li>
                                )
                            })}
                            {chapter.quizInfo && (
                                <li className={`flex items-center justify-between gap-x-5 px-4 pt-5 border-b border-gray-300 pb-5`}>
                                    <div className="flex items-center gap-x-3">
                                        <QuestionCircleOutlined className='text-xl' />

                                        <div>
                                            <p><span className="font-semibold">{chapter.lessons.length + 1}. Bài kiểm tra cuối chương: </span>{chapter.quizInfo.title}</p>
                                            <div className='flex items-center gap-x-2'>
                                                <ClockCircleOutlined />
                                                <p>Thời gian làm bài: {formatToText_HoursMinutes(chapter.quizInfo.duration)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <DeleteQuizModal quiz={chapter.quizInfo} />
                                </li>
                            )}
                        </ul>

                        <Divider variant="dashed" style={{ borderColor: '#6c757d', marginTop: '32px' }} dashed>
                            <div className="flex items-center gap-x-3">
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                    setSelectedChapter(chapter);
                                    setOpenCreateVideoModal(true);
                                }}>Thêm video</p>
                                <p>|</p>
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                    setSelectedChapter(chapter);
                                    setOpenCreateDocumentModal(true);
                                }}>Thêm tài liệu</p>
                            </div>
                        </Divider>
                    </div>
                )
            })
        });

        setItems(newItems);
    }, [chapters]);

    return (
        <div className="bg-white rounded-md shadow-md p-5">
            <h1 className="font-semibold text-xl">{course.courseName}</h1>

            <div className="flex items-center justify-between mt-3 mb-5">
                <div className='flex items-center gap-x-3'>
                    <Link href={"/course"}>
                        <Tooltip title="Quay lại trang quản lí khóa học" placement='bottom'>
                            <Button>
                                <ArrowLeftOutlined />
                            </Button>
                        </Tooltip>
                    </Link>

                    <Button icon={<PlusOutlined />} iconPosition="start" onClick={() => setOpenCreateChapterModal(true)}>Thêm chương học</Button>
                </div>
                <p className="flex items-center gap-x-2 text-sm"><HistoryOutlined />Cập nhật lần cuối: <strong className="text-blue-500">{formatDateTime(course.updatedAt)}</strong></p>
            </div>

            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} items={items} />

            {openCreateChapterModal && (
                <CreateChapterModal
                    course={course}
                    chapters={chapters}
                    open={openCreateChapterModal}
                    setOpen={setOpenCreateChapterModal}
                    bottomRef={bottomRef}
                />
            )}

            {openCreateVideoModal && (
                <CreateVideoModal
                    open={openCreateVideoModal}
                    setOpen={setOpenCreateVideoModal}
                    setSelectedChapter={setSelectedChapter}
                    selectedChapter={selectedChapter}
                />
            )}

            {openCreateDocumentModal && (
                <CreateDocumentModal
                    open={openCreateDocumentModal}
                    setOpen={setOpenCreateDocumentModal}
                    selectedChapter={selectedChapter}
                    setSelectedChapter={setSelectedChapter}
                />
            )}

            {openUpdateChapterModal && (
                <UpdateChapterModal
                    setSelectedChapter={setSelectedChapter}
                    selectedChapter={selectedChapter}
                    open={openUpdateChapterModal}
                    setOpen={setOpenUpdateChapterModal}
                    chapters={chapters}
                    course={course}
                />
            )}

            {openUpdateVideoModal && (
                <UpdateVideoModal
                    open={openUpdateVideoModal}
                    setOpen={setOpenUpdateVideoModal}
                    setSelectedChapter={setSelectedChapter}
                    selectLesson={selectedLesson}
                    selectedChapter={selectedChapter}
                    setSelectLesson={setSelectedLesson}
                />
            )}

            {openUpdateDocumentModal && (
                <UpdateDocumentModal
                    open={openUpdateDocumentModal}
                    setOpen={setOpenUpdateDocumentModal}
                    setSelectedChapter={setSelectedChapter}
                    selectLesson={selectedLesson}
                    selectedChapter={selectedChapter}
                    setSelectLesson={setSelectedLesson}
                />
            )}

            <div ref={bottomRef} />
        </div>
    )
}

export default UpdateLessonsForm