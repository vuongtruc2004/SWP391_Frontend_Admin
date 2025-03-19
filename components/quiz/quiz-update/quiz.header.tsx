'use client'
import { LeftOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd"
import Link from "next/link"
import { useState } from "react";
import { useQuizUpdate } from "@/wrapper/quiz-update/quiz.update.wrapper";
import QuestionBank from "./question.bank";

const QuizHeader = () => {
    const { form } = useQuizUpdate();
    const [openBank, setOpenBank] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between py-3.5 px-5 border border-b-gray-300 relative">
                <div className="flex items-center gap-x-3">
                    <Link href={"/quiz"}>
                        <Button shape="circle" icon={<LeftOutlined />} />
                    </Link>
                    <p>Trở lại</p>
                </div>

                <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-1 text-center font-semibold text-xl">
                    Cập nhật bài kiểm tra
                </h1>

                <div className="flex items-center gap-x-3">
                    <Button onClick={() => setOpenBank(true)}>
                        Chọn câu hỏi có sẵn
                    </Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Cập nhật
                    </Button>
                </div>
            </div>

            <Drawer title="Ngân hàng câu hỏi" onClose={() => setOpenBank(false)} open={openBank}>
                <QuestionBank />
            </Drawer>
        </>
    )
}

export default QuizHeader
