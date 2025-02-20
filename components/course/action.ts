'use client'

import { SetStateAction } from "react";

interface CreateCourseResponse {
    courseName: ErrorResponse;
    introduction: ErrorResponse;
    originalPrice: ErrorResponse;
    salePrice: ErrorResponse;
    description: ErrorResponse;
    objectives: ErrorResponse;
    subjects: ErrorResponse;
    thumbnail: string;
    ok: boolean;
}
export const validateCreateCourse = async (setErrorThumbnail: React.Dispatch<SetStateAction<string>>, prev: any, formData: FormData): Promise<CreateCourseResponse> => {
    const result: CreateCourseResponse = {
        courseName: {
            error: false,
            value: formData.get('courseName')?.toString().trim() || "",
            message: ""
        },
        introduction: {
            error: false,
            value: formData.get('introduction')?.toString().trim() || "",
            message: ""
        },
        originalPrice: {
            error: false,
            value: formData.get('originalPrice')?.toString().trim() || "",
            message: ""
        },
        salePrice: {
            error: false,
            value: formData.get('salePrice')?.toString().trim() || "",
            message: ""
        },
        description: {
            error: false,
            value: formData.get('description')?.toString().trim() || "",
            message: ""
        },
        objectives: {
            error: false,
            value: formData.get('objectives')?.toString().trim() || "",
            message: ""
        },
        thumbnail: "",
        ok: false
    };

    let isValid = true;

    // Kiểm tra trường rỗng
    if (result.courseName.value === "") {
        result.courseName.error = true;
        result.courseName.message = "Tiêu đề không được để trống!";
        isValid = false;
    }
    if (result.introduction.value === "") {
        result.introduction.error = true;
        result.introduction.message = "Giới thiệu không được để trống!";
        isValid = false;
    }
    if (result.description.value === "") {
        result.description.error = true;
        result.description.message = "Mô tả không được để trống!";
        isValid = false;
    }
    if (result.objectives.value === "") {
        result.objectives.error = true;
        result.objectives.message = "Mục tiêu không được để trống!";
        isValid = false;
    }

    const thumbnail = formData.get("thumbnail") as File;
    if (!thumbnail || !(thumbnail instanceof File) || thumbnail.size === 0) {
        setErrorThumbnail("Ảnh không được để trống!");
        isValid = false;
    }

    // Kiểm tra giá có phải số nguyên dương
    const originalPrice = parseInt(result.originalPrice.value, 10);
    if (isNaN(originalPrice) || originalPrice <= 0) {
        result.originalPrice.error = true;
        result.originalPrice.message = "Giá gốc phải là số nguyên dương!";
        isValid = false;
    }

    const salePrice = parseInt(result.salePrice.value, 10);
    if (isNaN(salePrice) || salePrice <= 0) {
        result.salePrice.error = true;
        result.salePrice.message = "Giá khuyến mãi phải là số nguyên dương!";
        isValid = false;
    }

    if (!result.originalPrice.error && !result.salePrice.error) {
        if (Number(result.salePrice.value) > Number(result.originalPrice.value)) {
            result.salePrice.error = true;
            result.salePrice.message = "Giá khuyến mãi phải thấp hơn giá gốc!";
            isValid = false;
        }
    }
    result.ok = isValid;
    return result;
};
