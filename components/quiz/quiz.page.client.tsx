"use client";
import { useEffect, useRef, useState } from "react";
import * as XLSX from 'xlsx';
import QuizSearch from "./quiz.search";
import QuizCreateBtn from "./quiz.create.btn";
import QuizTable from "./quiz.table";
import dayjs from "dayjs";
const QuizPageClient = (props: {
    keyword: string,
    published: string,
    maxAttempts: string | number,
    haveTime: string,
    startedFrom: string,
    startedTo: string,
    endedFrom: string,
    endedTo: string,
    quizPageResponse: PageDetailsResponse<QuizResponse[]>,
    allQuiz: QuizResponse[],
}) => {
    const { keyword, published, maxAttempts, haveTime, startedFrom, startedTo, endedFrom, endedTo, quizPageResponse, allQuiz } = props;
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
                    "Số lượt kiểm tra": d.maxAttempts,
                    "Trạng thái": d.published ? 'Đang mở' : 'Bị đóng',
                    "Bắt đầu": d.startedAt ? dayjs(d.startedAt).format("DD-MM-YYYY HH:mm:ss") : '',
                    "Kết thúc": d.endedAt ? dayjs(d.endedAt).format("DD-MM-YYYY HH:mm:ss") : '',
                    "Danh sách câu hỏi": d.questions.map(q => q.title).join("\n") // Sử dụng xuống dòng
                };
            });

            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(data);

            // Bật chế độ Wrap Text cho cột "Danh sách câu hỏi"
            const colIndex = Object.keys(data[0]).indexOf("Danh sách câu hỏi"); // Xác định cột index
            if (colIndex !== -1) {
                const colLetter = String.fromCharCode(65 + colIndex); // Chuyển index thành chữ (A, B, C, ...)
                ws[colLetter + "1"].s = { alignment: { wrapText: true } }; // Thiết lập wrapText
            }

            XLSX.utils.book_append_sheet(wb, ws, "MySheet");
            XLSX.writeFile(wb, "QuizExcel.xlsx");
        }
    };
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col">
            <QuizSearch keyword={keyword} published={published} maxAttempts={maxAttempts} startedFrom={startedFrom} startedTo={startedTo} endedFrom={endedFrom} endedTo={endedTo} haveTime={haveTime} />
            <QuizCreateBtn handelOnExportExcel={handelOnExportExcel} />
            <QuizTable quizPageResponse={quizPageResponse} />
        </div>
    );
};

export default QuizPageClient;
