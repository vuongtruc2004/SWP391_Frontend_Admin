"use client";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
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
    const generatePDF = useReactToPrint({
        documentTitle: 'Subjectdata',
        onAfterPrint: () => {
            notification.success({
                message: "Thành công",
                description: 'Xuất file PDF thành công!',
            });
        }
    });

    const handleExportPDF = () => {
        if (componentPDF.current) {
            generatePDF(() => componentPDF.current);
        } else {
            alert("Không tìm thấy nội dung để in!");
        }
    };

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
                    "Tên công nghệ": d.subjectName,
                    "Mô tả": d.description,
                    "Số lượng khóa học": d.totalCourses,
                    "Danh sách khóa học": d.listCourses.join(", ")

                }
            })
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
            XLSX.writeFile(wb, "UserExcel.xlsx");
        }
    }
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <SubjectSearch keyword={keyword} />
            <SubjectCreateBtn handleExportPDF={handleExportPDF} handelOnExportExcel={handelOnExportExcel} />
            <SubjectTable subjectPageResponse={subjectPageResponse} componentPDF={componentPDF} />
        </div>
    );
};

export default SubjectPageClient;
