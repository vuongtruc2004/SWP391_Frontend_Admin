'use client'
import { calculateReadingTime } from "@/helper/get.youtube.duration.helper";
import { formatDateTime, formatToHHMMSS } from "@/utils/format";
import { CaretRightOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined, PlusCircleOutlined, PlusOutlined, ProfileOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Collapse, CollapseProps, Divider, Popconfirm, Tooltip } from "antd"
import { useEffect, useState } from "react"
import UpdateChapterModal from "./update.chapter.modal";
import UpdateVideoModal from "./update.video.modal";
import CreateChapterModal from "./create.chapter.modal";
import UpdateDocumentModal from "./update.document.modal";

const UpdateLessonsForm = ({ course }: { course: CourseDetailsResponse }) => {
    const [chapters, setChapters] = useState<ChapterRequest[]>([]);
    const [items, setItems] = useState<CollapseProps['items']>([]);
    const [isSaved, setIsSaved] = useState(true);
    const [openCreateChapterModal, setOpenCreateChapterModal] = useState(false);
    const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);
    const [openUpdateVideoModal, setOpenUpdateVideoModal] = useState(false);
    const [openUpdateDocumentModal, setOpenUpdateDocumentModal] = useState(false);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonRequest | null>(null);

    const handleDeleteChapter = (chapterIndex: number) => {
        setChapters(prev => prev.filter((_, i) => i !== chapterIndex));
        setIsSaved(false);
    };

    const handleDeleteLesson = (lessonIndex: number, chapterIndex: number) => {
        setChapters(prev => prev.map((chapter, i) => i === chapterIndex ? ({
            ...chapter,
            lessons: chapter.lessons.filter((_, j) => j !== lessonIndex)
        }) : chapter));
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
            }))
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
                            <Tooltip title={`Cập nhật chương ${chapterIndex + 1}`} placement="bottom">
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
                                description={`Bạn có chắc chắn muốn xóa chương học ${chapterIndex + 1}?`}
                                onConfirm={() => handleDeleteChapter(chapterIndex)}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <Tooltip title={`Xóa chương ${chapterIndex + 1}`} placement="bottom">
                                    <DeleteOutlined className="text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation() }} />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    </div>
                ),
                children: (
                    <div>
                        <p><span className="font-semibold mb-3">Mô tả về chương học:</span> {chapter.description}</p>
                        <ul>
                            {chapter.lessons.map((lesson, lessonIndex) => {
                                return (
                                    <li key={lesson.lessonType + lessonIndex} className={`flex items-center justify-between gap-x-5 px-4 pt-4 ${lessonIndex < chapter.lessons.length - 1 && "border-b border-gray-300 pb-4"}`}>
                                        <div className="flex items-center gap-x-3">
                                            {lesson.lessonType === 'VIDEO' ? (
                                                <PlayCircleOutlined className="text-xl" />
                                            ) : (
                                                <ProfileOutlined className="text-xl" />
                                            )}

                                            <div>
                                                <p><span className="font-semibold">{lessonIndex + 1}. {lesson.lessonType === "VIDEO" ? "Video" : "Tài liệu đọc thêm"}</span> {lesson.title}</p>
                                                {lesson.lessonType === 'VIDEO' ? (
                                                    <p className="flex items-center gap-x-2"><ClockCircleOutlined /> {formatToHHMMSS(lesson.duration)}</p>
                                                ) : (
                                                    <p>{calculateReadingTime(lesson.documentContent || "")} phút đọc</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-3">
                                            <Tooltip title={`Cập nhật bài giảng ${lessonIndex + 1}`} placement="bottom" >
                                                <EditOutlined className="text-orange-500 cursor-pointer" onClick={() => {
                                                    setSelectedLesson(lesson);
                                                    if (lesson.lessonType === 'VIDEO') {
                                                        setOpenUpdateVideoModal(true);
                                                    } else {
                                                        setOpenUpdateDocumentModal(true);
                                                    }
                                                }} />
                                            </Tooltip>

                                            <Popconfirm
                                                title="Xóa bài giảng"
                                                description={`Bạn có chắc chắn muốn bài giảng ${lessonIndex + 1} của chương học ${chapterIndex + 1}?`}
                                                onConfirm={() => handleDeleteLesson(lessonIndex, chapterIndex)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <Tooltip title={`Xóa bài giảng ${lessonIndex + 1}`} placement="bottom" >
                                                    <DeleteOutlined className="text-red-500 cursor-pointer" />
                                                </Tooltip>
                                            </Popconfirm>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                        <Divider variant="dashed" style={{ borderColor: '#6c757d' }} dashed>
                            <p className="flex items-center gap-x-2 cursor-pointer text-sm"><PlusCircleOutlined /> Thêm bài giảng cho chương {chapterIndex + 1}</p>
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
                    <Button icon={<SaveOutlined />} iconPosition="start">Lưu bản nháp</Button>
                    <Button icon={<PlusOutlined />} iconPosition="start" onClick={() => setOpenCreateChapterModal(true)}>Thêm chương học</Button>
                </div>

                <div className="flex items-center gap-x-5">
                    {isSaved ? (
                        <p className="flex items-center gap-x-2 text-sm"><CheckCircleOutlined /> Đã lưu</p>
                    ) : (
                        <p className="flex items-center gap-x-2 text-sm"><CloseCircleOutlined /> Chưa lưu thay đổi</p>
                    )}

                    <p className="flex items-center gap-x-2 text-sm"><HistoryOutlined /> Cập nhật lần cuối: <strong className="text-blue-500">{formatDateTime(course.updatedAt)}</strong></p>
                </div>
            </div>

            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} items={items} />

            <CreateChapterModal
                open={openCreateChapterModal}
                setOpen={setOpenCreateChapterModal}
                setChapters={setChapters}
                setIsSaved={setIsSaved}
            />

            <UpdateChapterModal
                selectedChapterIndex={selectedChapterIndex}
                setSelectedChapterIndex={setSelectedChapterIndex}
                open={openUpdateChapterModal}
                setOpen={setOpenUpdateChapterModal}
                setIsSaved={setIsSaved}
                setChapters={setChapters}
                chapters={chapters}
            />

            <UpdateVideoModal
                open={openUpdateVideoModal}
                setOpen={setOpenUpdateVideoModal}
                setIsSaved={setIsSaved}
                setChapters={setChapters}
                setSelectedLesson={setSelectedLesson}
                selectedLesson={selectedLesson}
            />

            <UpdateDocumentModal
                open={openUpdateDocumentModal}
                setOpen={setOpenUpdateDocumentModal}
                setIsSaved={setIsSaved}
                setChapters={setChapters}
                setSelectedLesson={setSelectedLesson}
                selectedLesson={selectedLesson}
            />
        </div>
    )
}

export default UpdateLessonsForm