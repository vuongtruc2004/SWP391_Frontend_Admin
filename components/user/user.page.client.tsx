"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { notification } from "antd";
import UserSearch from "@/components/user/user.search";
import UserTable from "@/components/user/user.table";
import UserCreateBtn from "./user.create.btn.";

const UserPageClient = ({ keyword, userResponse }: { keyword: string, userResponse: PageDetailsResponse<UserResponse[]> }) => {
    const componentPDF = useRef<HTMLDivElement>(null);

    const generatePDF = useReactToPrint({
        documentTitle: 'Userdata',
        onAfterPrint: () => {
            notification.success({
                message: "Thành công",
                description: 'Xuất file PDF thành công!',
            });
        }
    });

    const handlePrint = () => {
        if (componentPDF.current) {
            generatePDF(() => componentPDF.current);
        } else {
            alert("Không tìm thấy nội dung để in!");
        }
    };

    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col gap-5">
            <UserSearch keyword={keyword} />
            <UserCreateBtn handlePrint={handlePrint} />
            <UserTable userPageResponse={userResponse} componentPDF={componentPDF} />
        </div>
    );
};

export default UserPageClient;
