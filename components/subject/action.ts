'use server'
export interface UpdateSubjectFieldResponse {
    subjectName: {
        error: boolean;
        value: string;
        message?: string
    },
    description: {
        error: boolean;
        value: string;
        message?: string
    }

}
export const validSubject = async (subjectId: number, prev: any, formData: FormData): Promise<UpdateSubjectFieldResponse> => {
    const subjectName = formData.get("subjectName")?.toString() || ""
    const description = formData.get("description")?.toString() || ""

    const result: UpdateSubjectFieldResponse = {
        subjectName: {
            error: false,
            value: subjectName
        },
        description: {
            error: false,
            value: description
        }
    }
    if (subjectName.trim() === "") {
        result.subjectName.error = true
        result.subjectName.message = "Tên môn học không được để trống!"
    }
    if (description.trim() === "") {
        result.description.error = true
        result.description.message = "Mô tả không được để trống!"
    }

    return result;

}
