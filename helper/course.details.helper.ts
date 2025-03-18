import dayjs from "dayjs";

export const validTitle = (title: ErrorResponse, setTitle: React.Dispatch<React.SetStateAction<ErrorResponse>>) => {
    if (title.value === null || title.value === "") {
        setTitle({
            ...title,
            error: true,
            message: "Tiêu đề không được để trống!"
        })
        return false;
    }
    setTitle({
        ...title,
        error: false,
        message: ""
    })
    return true;
}

export const validContent = (content: ErrorResponse, setContent: React.Dispatch<React.SetStateAction<ErrorResponse>>) => {
    if (content.value === null || content.value === "") {
        setContent({
            ...content,
            error: true,
            message: "Nội dung không được để trống!"
        })
        return false;
    }
    setContent({
        ...content,
        error: false,
        message: ""
    })
    return true;
}

export const validDateSet = (status: string, dateSet: ErrorResponse, setDateSet: React.Dispatch<React.SetStateAction<ErrorResponse>>) => {
    if (status === 'PENDING' && (dateSet.value === null || dateSet.value === '')) {
        setDateSet({
            ...dateSet,
            error: true,
            message: "Thời gian đặt lịch không được để trống!",
        })
        return false;
    }

    setDateSet({
        ...dateSet,
        error: false,
        message: ''
    })
    return true;
}

export const formatDate = (createdAt: string) => {
    return dayjs(createdAt).locale('vi').format('D [tháng] M, YYYY');
};
