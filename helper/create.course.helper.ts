import { SetStateAction } from "react";

export const isNumber = (s: string): boolean => {
    const regex = /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/;
    if (!regex.test(s))
        return false;
    return true;
}

export const isValidYouTubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(\S*)?$/;
    if (!regex.test(url))
        return false;
    return true;
};


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

export const validWordCountTile = (title: ErrorResponse, setTitleWordCount: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    const wordCount = title.value.trim().split(/\s+/).length;
    if (wordCount > 20) {
        setTitleWordCount({
            ...title,
            error: true,
            message: 'Độ dài tên khoá hoc không vượt quá 20 từ!'
        });
        return false;
    }
    return true;
};


export const validIntroduction = (introduction: ErrorResponse, setIntroduction: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (introduction.value.trim() === '' || !(isValidYouTubeUrl(introduction.value.trim()))) {
        setIntroduction({
            ...introduction,
            error: true,
            message: 'Link giới thiệu có định dạng không hợp lệ!'
        })
        return false;
    }
    return true;
}

export const validOriginPrice = (originPrice: ErrorResponse, setOriginPrice: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (originPrice.value.trim() === '') {
        setOriginPrice({
            ...originPrice,
            error: true,
            message: 'Giá gốc không được để rỗng!'
        })
        return false;
    }
    if (!isNumber(originPrice.value.trim())) {
        setOriginPrice({
            ...originPrice,
            error: true,
            message: 'Giá gốc phải là một số lớn hơn 0!'
        })
        return false;
    }
    return true;
}


export const validDes = (des: ErrorResponse, setDes: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (des.value.trim() === '') {
        setDes({
            ...des,
            error: true,
            message: 'Mô tả không được để rỗng!'
        })
        return false;
    }
    return true;
}



