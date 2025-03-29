import { formatToText_HoursMinutes } from "@/utils/format";
import { CloseOutlined } from "@ant-design/icons";
import { Button, message, Modal, Radio } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

const UpdateQuizModal = ({ selectedChapterIndex, chapters, open, setOpen, quizzes, setSelectedChapterIndex }: {
    quizzes: QuizInfoResponse[]
    selectedChapterIndex: number | null,
    chapters: ChapterResponse[],
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
}) => {
    if (selectedChapterIndex === null) return;
    const currentQuiz = chapters[selectedChapterIndex].quizInfo;
    if (!currentQuiz) return;

    const [selectedQuizId, setSelectedQuizId] = useState<number>(currentQuiz.quizId);

    const handleCancel = () => {
        setOpen(false);
        setSelectedChapterIndex(null);
    }

    const handleUpdateQuiz = () => {
        // if (selectedQuizId !== null && selectedQuizId !== currentQuiz.quizId) {
        //     if (chapters.find((chapter, index) => chapter.quizInfo && chapter.quizInfo.quizId === selectedQuizId && index !== selectedChapterIndex)) {
        //         message.error("Bài kiểm tra này đã được sử dụng trong 1 chương khác!");
        //         return;
        //     } else {
        //         setChapters(prev => prev.map((chapter, index) => index === selectedChapterIndex ? ({
        //             ...chapter,
        //             quizInfo: quizzes.find(quiz => quiz.quizId === selectedQuizId) || null
        //         }) : chapter));
        //     }
        // }
        handleCancel();
    }

    return (
        <Modal title={`Cập nhật bài kiểm tra cuối chương`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} key="cancel" onClick={handleCancel}>Hủy</Button>,
            <Button key="submit" type="primary" onClick={handleUpdateQuiz}>Cập nhật</Button>
        ]}>
            <Radio.Group
                style={{ display: 'flex', flexDirection: 'column', rowGap: '12px' }}
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
            >
                {quizzes.map(quiz => (
                    <Radio key={quiz.quizId} value={quiz.quizId} className="transition-all duration-200 w-full border border-gray-300 !px-5 !py-3 rounded-md hover:border-[#3b82f6]">
                        <p className="font-semibold">{quiz.title}</p>
                        <p>Thời gian làm bài: {formatToText_HoursMinutes(quiz.duration)}</p>
                    </Radio>
                ))}
            </Radio.Group>
        </Modal>
    )
}

export default UpdateQuizModal;
