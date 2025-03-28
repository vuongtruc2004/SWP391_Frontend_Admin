'use client'
import '@ant-design/v5-patch-for-react-19';
import { formatDateTime, formatToHHMMSS, formatToText_HoursMinutes } from "@/utils/format";
import { CaretRightOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined, PlusOutlined, ProfileOutlined, QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Collapse, CollapseProps, Divider, message, Popconfirm, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import CreateChapterModal from "./create.chapter.modal";
import CreateVideoModal from "./create.video.modal";
import CreateDocumentModal from "./create.document";
import UpdateChapterModal from "./update.chapter.modal";
import UpdateVideoModal from "./update.video.modal";
import UpdateDocumentModal from "./update.document.modal";
import AddQuizModal from './add.quiz.modal';

const UpdateLessonsForm = ({ course, quizzes }: { course: CourseDetailsResponse, quizzes: QuizInfoResponse[] }) => {
    const [chapters, setChapters] = useState<ChapterRequest[]>([]);
    const [items, setItems] = useState<CollapseProps['items']>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [openCreateChapterModal, setOpenCreateChapterModal] = useState(false);
    const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);

    const [openCreateVideoModal, setOpenCreateVideoModal] = useState(false);
    const [openUpdateVideoModal, setOpenUpdateVideoModal] = useState(false);

    const [openCreateDocumentModal, setOpenCreateDocumentModal] = useState(false);
    const [openUpdateDocumentModal, setOpenUpdateDocumentModal] = useState(false);

    const [openAddQuizModal, setOpenAddQuizModal] = useState(false);
    const [openUpdateQuizModal, setOpenUpdateQuizModal] = useState(false);

    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

    const handleDeleteChapter = (chapterIndex: number) => {
        setChapters(prev => prev.filter((_, i) => i !== chapterIndex));
    };

    const handleDeleteQuiz = (chapterIndex: number) => {
        setChapters(prev => prev.map((chapter, i) => i === chapterIndex ? ({
            ...chapter,
            quizInfo: null
        }) : chapter));
    }

    const handleDeleteLesson = (lessonIndex: number, chapterIndex: number) => {
        setChapters(prev => prev.map((chapter, i) => i === chapterIndex ? ({
            ...chapter,
            lessons: chapter.lessons.filter((_, j) => j !== lessonIndex)
        }) : chapter));
    }

    const saveAllChapters = async () => {
        let isValid = true;
        chapters.forEach((chapter, index) => {
            if (!chapter.lessons || chapter.lessons.length === 0) {
                message.error(`Chương ${index + 1} chưa có bài giảng!`);
                isValid = false;
            }
        });

        if (isValid) {
        }
    }

    useEffect(() => {
        setChapters(course.chapters.map(chapter => ({
            title: chapter.title,
            description: chapter.description,
            lessons: chapter.lessons.map(lesson => ({
                title: lesson.title,
                description: lesson.description || null,
                duration: lesson.duration,
                lessonType: lesson.lessonType,
                videoUrl: lesson.videoUrl || null,
                documentContent: lesson.documentContent || null
            })),
            quizInfo: chapter.quizInfo ? {
                quizId: chapter.quizInfo.quizId,
                title: chapter.quizInfo.title,
                duration: chapter.quizInfo.duration
            } : null
        })));
    }, [course]);

    useEffect(() => {
        const newItems: CollapseProps['items'] = chapters.map((chapter, chapterIndex) => {
            return ({
                key: chapterIndex + chapter.title,
                label: (
                    <div className="flex items-center justify-between pr-3 gap-x-5">
                        <p className="font-semibold">Chương {chapterIndex + 1}. {chapter.title}</p>
                        <div className="flex items-center gap-x-3">
                            <Tooltip title="Cập nhật chương học" placement="bottom">
                                <EditOutlined
                                    className="text-orange-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChapterIndex(chapterIndex);
                                        setOpenUpdateChapterModal(true);
                                    }}
                                />
                            </Tooltip>

                            <Popconfirm
                                title="Xóa chương học"
                                description="Bạn có chắc chắn muốn xóa chương học này không?"
                                onConfirm={() => handleDeleteChapter(chapterIndex)}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Xóa chương học" placement="bottom">
                                    <DeleteOutlined className="text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation() }} />
                                </Tooltip>
                            </Popconfirm>
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
                                                    setSelectedChapterIndex(chapterIndex);
                                                    setSelectedLessonIndex(lessonIndex);
                                                    if (lesson.lessonType === 'VIDEO') {
                                                        setOpenUpdateVideoModal(true);
                                                    } else {
                                                        setOpenUpdateDocumentModal(true);
                                                    }
                                                }} />
                                            </Tooltip>

                                            <Popconfirm
                                                title="Xóa bài giảng"
                                                description={`Bạn có chắc chắn muốn xóa ${lesson.lessonType === 'DOCUMENT' ? 'tài liệu' : 'video'} này không?`}
                                                onConfirm={() => handleDeleteLesson(lessonIndex, chapterIndex)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <Tooltip title={`Xóa ${lesson.lessonType === 'DOCUMENT' ? "tài liệu" : "video"}`} placement="bottom" >
                                                    <DeleteOutlined className="text-red-500 cursor-pointer" />
                                                </Tooltip>
                                            </Popconfirm>
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

                                    <div className="flex items-center gap-x-3">
                                        <Tooltip title="Chọn 1 bài kiểm tra khác" placement="bottom" >
                                            <EditOutlined className="text-orange-500 cursor-pointer" onClick={() => {

                                            }} />
                                        </Tooltip>

                                        <Popconfirm
                                            title="Xóa bài kiểm tra (Bài kiểm tra sẽ không bị xóa, bạn chỉ xóa nó khỏi chương này)"
                                            description={`Bạn có chắc chắn muốn xóa bài kiểm tra này không?`}
                                            onConfirm={() => handleDeleteQuiz(chapterIndex)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <Tooltip title="Xóa bài kiểm tra" placement="bottom" >
                                                <DeleteOutlined className="text-red-500 cursor-pointer" />
                                            </Tooltip>
                                        </Popconfirm>
                                    </div>
                                </li>
                            )}
                        </ul>

                        <Divider variant="dashed" style={{ borderColor: '#6c757d', marginTop: '32px' }} dashed>
                            <div className="flex items-center gap-x-3">
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                    setSelectedChapterIndex(chapterIndex);
                                    setOpenCreateVideoModal(true);
                                }}>Thêm video</p>

                                <p>|</p>
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                    setSelectedChapterIndex(chapterIndex);
                                    setOpenCreateDocumentModal(true);
                                }}>Thêm tài liệu</p>

                                {!chapter.quizInfo && (
                                    <>
                                        <p>|</p>
                                        <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                            setSelectedChapterIndex(chapterIndex);
                                            setOpenAddQuizModal(true);
                                        }}>Thêm bài kiểm tra cuối chương</p>
                                    </>
                                )}
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
                <div className="flex items-center gap-x-3">
                    <Button icon={<SaveOutlined />} iconPosition="start" onClick={saveAllChapters}>Lưu các chương học</Button>
                    <Button icon={<PlusOutlined />} iconPosition="start" onClick={() => setOpenCreateChapterModal(true)}>Thêm chương học</Button>
                </div>

                <p className="flex items-center gap-x-2 text-sm"><HistoryOutlined />Cập nhật lần cuối: <strong className="text-blue-500">{formatDateTime(course.updatedAt)}</strong></p>
            </div>

            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} items={items} />

            <CreateChapterModal
                chapters={chapters}
                open={openCreateChapterModal}
                setOpen={setOpenCreateChapterModal}
                setChapters={setChapters}
                bottomRef={bottomRef}
            />

            <CreateVideoModal
                chapters={chapters}
                open={openCreateVideoModal}
                setOpen={setOpenCreateVideoModal}
                setChapters={setChapters}
                setSelectedChapterIndex={setSelectedChapterIndex}
                selectedChapterIndex={selectedChapterIndex}
            />

            <CreateDocumentModal
                chapters={chapters}
                open={openCreateDocumentModal}
                setOpen={setOpenCreateDocumentModal}
                setChapters={setChapters}
                setSelectedChapterIndex={setSelectedChapterIndex}
                selectedChapterIndex={selectedChapterIndex}
            />

            <AddQuizModal
                chapters={chapters}
                setChapters={setChapters}
                quizzes={quizzes}
                open={openAddQuizModal}
                setOpen={setOpenAddQuizModal}
                selectedChapterIndex={selectedChapterIndex}
                setSelectedChapterIndex={setSelectedChapterIndex}
            />

            <UpdateChapterModal
                selectedChapterIndex={selectedChapterIndex}
                setSelectedChapterIndex={setSelectedChapterIndex}
                open={openUpdateChapterModal}
                setOpen={setOpenUpdateChapterModal}
                setChapters={setChapters}
                chapters={chapters}
            />

            <UpdateVideoModal
                setSelectedChapterIndex={setSelectedChapterIndex}
                setSelectedLessonIndex={setSelectedLessonIndex}
                chapters={chapters}
                open={openUpdateVideoModal}
                setOpen={setOpenUpdateVideoModal}
                setChapters={setChapters}
                selectedLessonIndex={selectedLessonIndex}
                selectedChapterIndex={selectedChapterIndex}
            />

            <UpdateDocumentModal
                setSelectedChapterIndex={setSelectedChapterIndex}
                setSelectedLessonIndex={setSelectedLessonIndex}
                chapters={chapters}
                open={openUpdateDocumentModal}
                setOpen={setOpenUpdateDocumentModal}
                setChapters={setChapters}
                selectedLessonIndex={selectedLessonIndex}
                selectedChapterIndex={selectedChapterIndex}
            />

            <div ref={bottomRef} />
        </div>
    )
}

export default UpdateLessonsForm