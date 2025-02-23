import dayjs from "dayjs";
import { SetStateAction } from "react";

export const getPublished = (value: string | undefined | null) => {

    if (!value || (value !== 'active' && value !== 'unactive')) {
        return 'ALL';
    }
    else {
        return value;
    }

}

export const getMaxAttempts = (value: string | null | undefined): string | number => {
    if (!value || !/^\d+(\.\d+)?$/.test(value.trim())) {
        return '';
    }
    return Number(value);
};

export const getStartedAt = (value: string | undefined | null) => {

    if (!value || (value !== 'noTime' && value !== 'haveTime')) {
        return 'ALL';
    }
    else {
        return value;
    }

}



export const validTitle = (title: ErrorResponse, setTitle: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (title.value.trim() === '') {
        setTitle({
            ...title,
            error: true,
            message: 'Vui lòng không để trống tiêu đề bài kiểm tra'
        })
        return false;
    }


    return true;

}

export const validMaxAttempts = (maxAttempts: ErrorResponse, setMaxAttempts: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (maxAttempts.value.trim() === '') {
        setMaxAttempts({
            ...maxAttempts,
            error: true,
            message: 'Vui lòng không để trống lượt kiểm tra'
        })
        return false;
    }
    const regex = /^\d+$/;

    if (!regex.test(maxAttempts.value)) {
        setMaxAttempts({
            ...maxAttempts,
            error: true,
            message: 'Lượt kiểm tra phải là số nguyên dương'
        });
        return false;
    }


    return true;

}

export const validDate = (startedAt: ErrorResponse, endedAt: ErrorResponse, setStartedAt: React.Dispatch<SetStateAction<ErrorResponse>>, setEndedAt: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (startedAt.value && endedAt.value === '') {
        setEndedAt({
            ...endedAt,
            error: true,
            message: 'Thời gian kết thúc không được để trống'
        })
        return false;
    }

    if (startedAt.value === '' && endedAt.value) {
        setStartedAt({
            ...startedAt,
            error: true,
            message: 'Thời gian bắt đầu không được để trống'
        })
        return false;
    }

    if (startedAt.value && endedAt.value) {
        const startDate = dayjs(startedAt.value);
        const endDate = dayjs(endedAt.value);

        if (startDate.isAfter(endDate)) {
            setStartedAt({
                ...startedAt,
                error: true,
                message: 'Thời gian bắt đầu phải nhỏ thời gian kết thúc'
            });

            setEndedAt({
                ...endedAt,
                error: true,
                message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
            });

            return false;
        }
    }


    return true;

}

export const validQuestionContent = (title: ErrorResponse, setTitle: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (title.value.trim() === '') {
        setTitle({
            ...title,
            error: true,
            message: 'Tiêu đề bài kiểm tra không được để rỗng'
        })
        return false;
    }


    return true;
}