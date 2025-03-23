'use client'

import { validDate, validMaxAttempts, validTitle } from "@/helper/create.quiz.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { DeleteFilled, DeleteOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleFilled, PlusCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, DatePickerProps, Image, Input, Modal, notification, Select, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { url } from "inspector";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
const initState: ErrorResponse = {
    error: false,
    value: ''

}
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