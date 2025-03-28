'use client'
import { formatDateTime } from "@/utils/format";
import { CaretRightOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined, PlusOutlined, ProfileOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Collapse, CollapseProps, Divider, Popconfirm, Tooltip } from "antd"
import { useEffect, useState } from "react"
import UpdateChapterModal from "./update.chapter.modal";
import UpdateVideoModal from "./update.video.modal";
import CreateChapterModal from "./create.chapter.modal";
import UpdateDocumentModal from "./update.document.modal";
import CreateVideoModal from "./create.video.modal";

const UpdateLessonsForm = ({ course }: { course: CourseDetailsResponse }) => {
    const [chapters, setChapters] = useState<ChapterRequest[]>([]);
    const [items, setItems] = useState<CollapseProps['items']>([]);

    const [openCreateChapterModal, setOpenCreateChapterModal] = useState(false);
    const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);

    const [openCreateVideoModal, setOpenCreateVideoModal] = useState(false);
    const [openUpdateVideoModal, setOpenUpdateVideoModal] = useState(false);

    const [openUpdateDocumentModal, setOpenUpdateDocumentModal] = useState(false);

    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

    const handleDeleteChapter = (chapterIndex: number) => {
        setChapters(prev => prev.filter((_, i) => i !== chapterIndex));
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
                        <p><span className="font-semibold">Mô tả về chương học:</span> {chapter.description}</p>
                        <ul>
                            {chapter.lessons.map((lesson, lessonIndex) => {
                                return (
                                    <li key={lesson.lessonType + lessonIndex} className={`flex items-center justify-between gap-x-5 px-4 pt-5 ${lessonIndex < chapter.lessons.length - 1 && "border-b border-gray-300 pb-5"}`}>
                                        <div className="flex items-center gap-x-3">
                                            {lesson.lessonType === 'VIDEO' ? (
                                                <PlayCircleOutlined className="text-xl" />
                                            ) : (
                                                <ProfileOutlined className="text-xl" />
                                            )}

                                            <p><span className="font-semibold">{lessonIndex + 1}. {lesson.lessonType === "VIDEO" ? "Video" : "Tài liệu đọc thêm"}</span> {lesson.title}</p>
                                        </div>

                                        <div className="flex items-center gap-x-3">
                                            <Tooltip title={`Cập nhật bài giảng ${lessonIndex + 1}`} placement="bottom" >
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
                            <div className="flex items-center gap-x-3">
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500" onClick={() => {
                                    setSelectedChapterIndex(chapterIndex);
                                    setOpenCreateVideoModal(true);
                                }}>Thêm video</p>
                                <p>|</p>
                                <p className="flex items-center gap-x-2 cursor-pointer text-sm hover:text-gray-500">Thêm tài liệu đọc thêm</p>
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
                    <Button icon={<SaveOutlined />} iconPosition="start">Lưu bản nháp</Button>
                    <Button icon={<PlusOutlined />} iconPosition="start" onClick={() => setOpenCreateChapterModal(true)}>Thêm chương học</Button>
                </div>

                <p className="flex items-center gap-x-2 text-sm"><HistoryOutlined /> Cập nhật lần cuối: <strong className="text-blue-500">{formatDateTime(course.updatedAt)}</strong></p>
            </div>

            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} items={items} />

            <CreateChapterModal
                open={openCreateChapterModal}
                setOpen={setOpenCreateChapterModal}
                setChapters={setChapters}
            />

            <CreateVideoModal
                open={openCreateVideoModal}
                setOpen={setOpenCreateChapterModal}
                setChapters={setChapters}
                setSelectedChapterIndex={setSelectedChapterIndex}
                selectedChapterIndex={selectedChapterIndex}
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
        </div>
    )
}

export default UpdateLessonsForm