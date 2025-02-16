"use client";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { notification } from "antd";
import UserSearch from "@/components/user/user.search";
import UserTable from "@/components/user/user.table";
import UserCreateBtn from "./user.create.btn.";
import * as XLSX from 'xlsx';
import dayjs from "dayjs";
const UserPageClient = ({ keyword, userResponse, allUsers, roleName, locked, gender }: {
    keyword: string, userResponse: PageDetailsResponse<UserResponse[]>, allUsers: UserResponse[], roleName: string, locked: string, gender: string
}) => {
    const componentPDF = useRef<HTMLDivElement>(null);
    const [sheetData, setSheetData] = useState<UserResponse[]>([]);
    const generatePDF = useReactToPrint({
        documentTitle: 'Userdata',
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
        if (allUsers.length > 0) {
            console.log("Cập nhật sheetData với dữ liệu:", allUsers);
            setSheetData([...allUsers]); // Sao chép dữ liệu, tránh lỗi reference
        }
    }, [allUsers]);



    const handelOnExportExcel = () => {

        const data = sheetData.map((d, index) => {
            return {
                STT: index + 1,
                Email: d.email,
                Ảnh: d.avatar,
                Tên: d.fullname,
                "Loại tài khoản": d.accountType,
                "Giới tính": d.gender,
                Khóa: d.locked ? 'Bị khóa' : 'Không bị khóa',
                "Vai trò": d.roleName,
                "Ngày tạo": d.createdAt ? dayjs(d.createdAt).format("DD-MM-YYYY HH:mm:ss") : "",
                "Ngày cập nhật": d.updatedAt ? dayjs(d.createdAt).format("DD-MM-YYYY HH:mm:ss") : ""

            }
        })
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
        XLSX.writeFile(wb, "UserExcel.xlsx");
    }
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <UserSearch keyword={keyword} roleName={roleName} locked={locked} gender={gender} />
            <UserCreateBtn handleExportPDF={handleExportPDF} handelOnExportExcel={handelOnExportExcel} />
            <UserTable userPageResponse={userResponse} componentPDF={componentPDF} />
        </div>
    );
};

export default UserPageClient;
