
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
