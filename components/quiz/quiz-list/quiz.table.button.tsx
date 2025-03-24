'use client'

import { Button } from "antd";

const QuizTableButton = (props: {
    handelOnExportExcel: any;
}) => {
    const { handelOnExportExcel } = props;
    return (
        <>
            <div className="flex justify-between mb-3">
                <div className="ml-6">
                </div>
                <div className="mr-8">
                    <Button
                        style={{ background: 'green', borderColor: "green" }}
                        type="primary"
                        onClick={() => handelOnExportExcel()}
                        className="w-fit hover:bg-green-100 hover:border-green-700">
                        Xuất Excel
                    </Button>
                </div>
            </div>

        </>
    )
}
export default QuizTableButton;