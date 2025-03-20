import { SetStateAction } from "react";

const isNumber = (input: string) => {
    return /^-?\d+(\.\d+)?$/.test(input);
}

export const validDescription = (description: ErrorResponse, setDescription: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (description.value.trim() === '') {
        setDescription({
            ...description,
            error: true,
            message: 'Mô tả không được để rỗng!'
        })
        return false;
    }
    return true;
}
export const validCampaignName = (subjectName: ErrorResponse, setSubjectName: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (subjectName.value.trim() === '') {
        setSubjectName({
            ...subjectName,
            error: true,
            message: 'Tên chiến dịch không được để rỗng!'
        })
        return false;
    }
    return true;
}
export const validReduceValue = (reduceValue: ErrorResponse, setReduceValue: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (reduceValue.value.trim() === '') {
        setReduceValue({
            ...reduceValue,
            error: true,
            message: 'Giá trị giảm không được để rỗng!'
        })
        return false;
    } else {
        if (!isNumber(reduceValue.value)) {
            setReduceValue({
                ...reduceValue,
                error: true,
                message: 'Giá trị giảm phải là 1 số!'
            })
            return false;
        } else {
            if (Number(reduceValue.value) < 0) {
                setReduceValue({
                    ...reduceValue,
                    error: true,
                    message: 'Giá trị giảm không được nhỏ hơn 0!'
                })
                return false;
            }
        }
    }
    return true;
}



