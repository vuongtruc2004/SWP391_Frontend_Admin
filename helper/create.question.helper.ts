import { SetStateAction } from "react";

export const validTitle = (title: ErrorResponse, setTitle: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (title.value.trim() === '') {
        setTitle({
            ...title,
            error: true,
            message: 'Tiêu đề không được để rỗng!'
        })
        return false;
    }
    return true;
}



