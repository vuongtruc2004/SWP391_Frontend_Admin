import { formatToText_HoursMinutes } from "@/utils/format";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Radio } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

const AddQuizModal = ({ selectedChapterIndex, chapters, setChapters, open, setOpen, quizzes, setSelectedChapterIndex }: {
    quizzes: QuizInfoResponse[]
    selectedChapterIndex: number | null,
    chapters: ChapterRequest[],
    setChapters: Dispatch<SetStateAction<ChapterRequest[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setSelectedChapterIndex: Dispatch<SetStateAction<number | null>>,
}) => {
    if (selectedChapterIndex === null || chapters[selectedChapterIndex].quizInfo !== null) return;

    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

    const handleCancel = () => {
        setOpen(false);
        setSelectedChapterIndex(null);
        setSelectedQuizId(null);
    }

    const handleAddQuiz = () => {
        if (selectedQuizId === null) {
            return;
        }
        setChapters(prev => prev.map((chapter, index) => index === selectedChapterIndex ? ({
            ...chapter,
            quizInfo: quizzes.find(quiz => quiz.quizId === selectedQuizId) || null
        }) : chapter));
        handleCancel();
    }

    return (
        <Modal title={`Thêm bài kiểm tra cuối chương`} open={open} closable={false} footer={[
            <Button icon={<CloseOutlined />} key="cancel" onClick={handleCancel}>Hủy</Button>,
            <Button key="submit" type="primary" onClick={handleAddQuiz}>Thêm</Button>
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

export default AddQuizModal;
