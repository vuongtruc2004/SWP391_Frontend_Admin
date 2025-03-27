'use client'
import { calculateReadingTime } from "@/helper/get.youtube.duration.helper";
import { formatDateTime, formatToHHMMSS } from "@/utils/format";
import { CaretRightOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined, PlusCircleOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Collapse, CollapseProps, Divider, Tooltip } from "antd"
import { useEffect, useState } from "react"
import UpdateChapterModal from "./update.chapter.modal";
import UpdateVideoModal from "./update.video.modal";

const UpdateLessonsForm = ({ course }: { course: CourseDetailsResponse }) => {
    const [chapters, setChapters] = useState<ChapterResponse[]>(course.chapters || []);
    const [items, setItems] = useState<CollapseProps['items']>([]);
    const [isSaved, setIsSaved] = useState(true);
    const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);
    const [openUpdateVideoModal, setOpenUpdateVideoModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);

    useEffect(() => {
        const newItems: CollapseProps['items'] = chapters.map((chapter, index) => {
            return ({
                key: chapter.chapterId,
                label: (
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">Chương {index + 1}. {chapter.title}</p>
                        <div className="flex items-center gap-x-3">
                            <Tooltip title={`Cập nhật chương ${index + 1}`} placement="bottom">
                                <EditOutlined
                                    className="text-orange-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChapter(chapter);
                                        setOpenUpdateChapterModal(true);
                                    }}
                                />
                            </Tooltip>

                            <Tooltip title={`Xóa chương ${index + 1}`} placement="bottom" >
                                <DeleteOutlined className="text-red-500 cursor-pointer" />
                            </Tooltip>
                        </div>
                    </div>
                ),
                children: (
                    <div>
                        <p><span className="font-semibold mb-3">Mô tả về chương học:</span> {chapter.description}</p>
                        <ul>
                            {chapter.lessons.map((lesson, index) => {
                                return (
                                    <li key={lesson.lessonId} className={`flex items-center justify-between px-4 pt-4 ${index < chapter.lessons.length - 1 && "border-b border-gray-300 pb-4"}`}>
                                        <div className="flex items-center gap-x-3">
                                            <PlayCircleOutlined className="text-xl" />
                                            <div>
                                                <p><span className="font-semibold">{lesson.lessonType === "VIDEO" ? "Video" : "Tài liệu đọc thêm"}</span> {lesson.title}</p>
                                                {lesson.lessonType === 'VIDEO' ? (
                                                    <p className="flex items-center gap-x-2"><ClockCircleOutlined /> {formatToHHMMSS(lesson.duration)}</p>
                                                ) : (
                                                    <p>{calculateReadingTime(lesson.documentContent || "")} phút đọc</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-3">
                                            <Tooltip title={`Cập nhật bài giảng ${index + 1}`} placement="bottom" >
                                                <EditOutlined className="text-orange-500 cursor-pointer" onClick={() => {
                                                    setSelectedLesson(lesson);
                                                    if (lesson.lessonType === 'VIDEO') {
                                                        setOpenUpdateVideoModal(true);
                                                    }
                                                }} />
                                            </Tooltip>

                                            <Tooltip title={`Xóa bài giảng ${index + 1}`} placement="bottom" >
                                                <DeleteOutlined className="text-red-500 cursor-pointer" />
                                            </Tooltip>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                        <Divider variant="dashed" style={{ borderColor: '#6c757d' }} dashed>
                            <p className="flex items-center gap-x-2 cursor-pointer text-sm"><PlusCircleOutlined /> Thêm bài giảng cho chương {index + 1}</p>
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
                <Button icon={<SaveOutlined />} iconPosition="start">Lưu bản nháp</Button>
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

            <UpdateChapterModal
                selectedChapter={selectedChapter}
                setSelectedChapter={setSelectedChapter}
                open={openUpdateChapterModal}
                setOpen={setOpenUpdateChapterModal}
                setIsSaved={setIsSaved}
                setChapters={setChapters}
            />

            <UpdateVideoModal
                open={openUpdateVideoModal}
                setOpen={setOpenUpdateVideoModal}
                setIsSaved={setIsSaved}
                setChapters={setChapters}
                setSelectedLesson={setSelectedLesson}
                selectedLesson={selectedLesson}
            />
        </div>
    )
}

export default UpdateLessonsForm