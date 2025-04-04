"use client";
import { useEffect, useRef, useState } from "react";
import * as XLSX from 'xlsx';
import QuizSearch from "./quiz.search";
import QuizTable from "./quiz.table";
import QuizTableButton from "./quiz.table.button";
const QuizPageClient = (props: {
    keyword: string,
    published: string,
    createdFrom: string,
    allowSeeAnswers: string,
    createdTo: string,
    durationFrom: string | number,
    durationTo: string | number,
    quizPageResponse: PageDetailsResponse<QuizResponse[]>,
    allQuiz: QuizResponse[],
}) => {
    const { keyword, published, allowSeeAnswers, createdFrom, createdTo, durationFrom, durationTo, quizPageResponse, allQuiz } = props;
    const [sheetData, setSheetData] = useState<QuizResponse[]>([]);

    useEffect(() => {
        if (allQuiz.length > 0) {
            setSheetData([...allQuiz]);
        }
    }, [allQuiz]);
    const handelOnExportExcel = () => {
        if (sheetData.length > 0) {
            const data = sheetData.map((d, index) => {
                return {
                    STT: index + 1,
                    "Tiêu đề": d.title,
                    "Trạng thái": d.published ? 'Mở' : 'Đóng',
                    "Khóa học": d.chapter.course.courseName,
                    "Chương học": d.chapter.title,
                    "Mô tả": d.description,
                    "Ngày tạo": d.createdAt,
                    "Thời gian làm bài (phút)": d.duration / 60,
                    "Cho xem đáp án": d.allowSeeAnswers ? 'Mở' : 'Đóng',
                    "Danh sách câu hỏi": d.questions.map(q => q.title).join("\n")
                };
            });

            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(data);

            const colIndex = Object.keys(data[0]).indexOf("Danh sách câu hỏi");
            if (colIndex !== -1) {
                const colLetter = String.fromCharCode(65 + colIndex);
                ws[colLetter + "1"].s = { alignment: { wrapText: true } };
            }

            XLSX.utils.book_append_sheet(wb, ws, "MySheet");
            XLSX.writeFile(wb, "QuizExcel.xlsx");
        }
    };
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col">
            <QuizSearch keyword={keyword} published={published} allowSeeAnswers={allowSeeAnswers} createdFrom={createdFrom} createdTo={createdTo} durationFrom={durationFrom} durationTo={durationTo} />
            <QuizTableButton handelOnExportExcel={handelOnExportExcel} />
            <QuizTable quizPageResponse={quizPageResponse} />
        </div>
    );
};

export default QuizPageClient;
