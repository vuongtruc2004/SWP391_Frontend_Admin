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
    createdFrom: string,
    createdTo: string,
    quizPageResponse: PageDetailsResponse<QuizResponse[]>,
    allQuiz: QuizResponse[],
}) => {
    const { keyword, published, createdFrom, createdTo, quizPageResponse, allQuiz } = props;
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
                    "Trạng thái": d.published ? 'Đang mở' : 'Bị đóng',
                    "Danh sách câu hỏi": d.questions.map(q => q.title).join("\n") // Sử dụng xuống dòng
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
            <QuizSearch keyword={keyword} published={published} createdFrom={createdFrom} createdTo={createdTo} />
            <QuizCreateBtn handelOnExportExcel={handelOnExportExcel} />
            <QuizTable quizPageResponse={quizPageResponse} />
        </div>
    );
};

export default QuizPageClient;
