import { SetStateAction } from "react";

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
export const validSubjectName = (subjectName: ErrorResponse, setSubjectName: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (subjectName.value.trim() === '') {
        setSubjectName({
            ...subjectName,
            error: true,
            message: 'Tên lĩnh vực không được để rỗng!'
        })
        return false;
    }
    return true;
}


