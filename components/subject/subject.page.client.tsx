"use client";
import { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import * as XLSX from 'xlsx';
import SubjectSearch from "./subject.search";
import SubjectCreateBtn from "./subject.create.btn.";
import SubjectTable from "./subject.table";
const SubjectPageClient = ({ keyword, subjectPageResponse, allSubjects }: {
    keyword: string, subjectPageResponse: PageDetailsResponse<SubjectResponse[]>, allSubjects: SubjectResponse[]
}) => {
    const componentPDF = useRef<HTMLDivElement>(null);
    const [sheetData, setSheetData] = useState<SubjectResponse[]>([]);


    useEffect(() => {
        if (allSubjects.length > 0) {
            setSheetData([...allSubjects]); // Sao chép dữ liệu, tránh lỗi reference
        }
    }, [allSubjects]);



    const handelOnExportExcel = () => {

        if (sheetData.length > 0) {
            const data = sheetData.map((d, index) => {
                return {
                    STT: index + 1,
                    "Tên lĩnh vực": d.subjectName,
                    "Mô tả": d.description,
                    "Số lượng khóa học": d.totalCourses,
                    "Danh sách khóa học": d.listCourses.join("\n")

                }
            })
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(data);

            // Bật chế độ Wrap Text cho cột "Danh sách câu hỏi"
            const colIndex = Object.keys(data[0]).indexOf("Danh sách khóa học"); // Xác định cột index
            if (colIndex !== -1) {
                const colLetter = String.fromCharCode(65 + colIndex); // Chuyển index thành chữ (A, B, C, ...)
                ws[colLetter + "1"].s = { alignment: { wrapText: true } }; // Thiết lập wrapText
            }

            XLSX.utils.book_append_sheet(wb, ws, "MySheet");
            XLSX.writeFile(wb, "SubjectExcel.xlsx");
        }
    }
    return (
        <div className="borde w-full h-[87vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <SubjectSearch keyword={keyword} />
            <SubjectCreateBtn handelOnExportExcel={handelOnExportExcel} />
            <SubjectTable subjectPageResponse={subjectPageResponse} componentPDF={componentPDF} />
        </div>
    );
};

export default SubjectPageClient;
