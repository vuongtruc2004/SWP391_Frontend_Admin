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

export const validIntroduction = (introduction: ErrorResponse, setIntroduction: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (introduction.value.trim() === '') {
        setIntroduction({
            ...introduction,
            error: true,
            message: 'Link video giới thiệu không được để rỗng!'
        })
        return false;
    }
    return true;
}
export const isValidYouTubeUrl = (url) => {
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})(&.*)?$/;
    return youtubePattern.test(url);
};

export const validVideoUrl = (videoUrl: ErrorResponse, setVideoUrl: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (videoUrl.value.trim() === '') {
        setVideoUrl({
            ...videoUrl,
            error: true,
            message: 'Video url không được để rỗng!'
        })
        return false;
    }
    return true;
}

export const validTitleDocument = (titleDocument: ErrorResponse, setTitleDocument: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (titleDocument.value.trim() === '') {
        setTitleDocument({
            ...titleDocument,
            error: true,
            message: 'Tiêu đề tài liệu không được để rỗng!'
        })
        return false;
    }
    return true;
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

export const validObject = (object: ErrorResponse, setObject: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (object.value.trim() === '') {
        setObject({
            ...object,
            error: true,
            message: 'Mục tiêu không được để rỗng!'
        })
        return false;
    }
    return true;
}

export const validLessionName = (lessionName: ErrorResponse, setLessionName: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (lessionName.value.trim() === '') {
        setLessionName({
            ...lessionName,
            error: true,
            message: 'Tên bài giảng không được để rỗng!'
        })
        return false;
    }
    return true;
}

export const validLessionDes = (lessionDes: ErrorResponse, validLessionDes: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (lessionDes.value.trim() === '') {
        validLessionDes({
            ...lessionDes,
            error: true,
            message: 'Mô tả bài giảng không được để rỗng!'
        })
        return false;
    }
    return true;
}



