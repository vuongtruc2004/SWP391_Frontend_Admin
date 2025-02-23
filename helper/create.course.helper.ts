import dayjs from "dayjs";
import { SetStateAction } from "react";
import { isFullNumber } from "./subject.helper";


const isNumber = (s: string): boolean => {
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

export const validIntroduction = (introduction: ErrorResponse, setIntroduction: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (introduction.value.trim() === '' || !(isValidYouTubeUrl(introduction.value.trim()))) {
        setIntroduction({
            ...introduction,
            error: true,
            message: 'Link giới thiệu không được để rỗng hoặc định dạng không hợp lệ!'
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

export const validSalePrice = (salePrice: ErrorResponse, setSalePrice: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (salePrice.value.trim() === '') {
        setSalePrice({
            ...salePrice,
            error: true,
            message: 'Giá khuyến mãi không được để rỗng!'
        })
        return false;
    }
    if (!isNumber(salePrice.value.trim())) {
        setSalePrice({
            ...salePrice,
            error: true,
            message: 'Giá khuyến mãi phải là một số lớn hơn 0!'
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



