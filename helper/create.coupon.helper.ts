import { SetStateAction } from "react";
import { isNumber } from "./create.course.helper";



export const isValidCouponName = (couponName: ErrorResponse, setCouponName: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (couponName.value.trim() === '') {
        setCouponName({
            ...couponName,
            error: true,
            message: 'Tên coupon không được để rỗng!'
        })
        return false;
    }
    if (couponName.value.length > 40) {
        setCouponName({
            ...couponName,
            error: true,
            message: 'Tên coupon không được dài hơn 40 kí tự!'
        })
        return false;
    }

    return true;
};

export const isValidCouponCode = (couponCode: ErrorResponse, setCouponCode: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (couponCode.value.trim() === '') {
        setCouponCode({
            ...couponCode,
            error: true,
            message: 'Mã coupon không được để rỗng!'
        })
        return false;
    }
    if (couponCode.value.length > 5) {
        setCouponCode({
            ...couponCode,
            error: true,
            message: 'Mã coupon không được dài hơn 5 kí tự!'
        })
        return false;
    }

    return true;
};


export const isValidMaxUsed = (maxUsed: ErrorResponse, setMaxUsed: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (maxUsed.value.trim() === '') {
        setMaxUsed({
            ...maxUsed,
            error: true,
            message: 'Số lượng coupon không được để rỗng'
        })
        return false;
    }
    if (!isNumber(maxUsed.value)) {
        setMaxUsed({
            ...maxUsed,
            error: true,
            message: 'Số lượng coupon phải là một số!'
        })
        return false;
    }
    if (Number(maxUsed.value) <= 0) {
        setMaxUsed({
            ...maxUsed,
            error: true,
            message: 'Số lượng coupon phải lớn hơn 0!'
        })
        return false;
    }

    return true;
};

export const isValidCouponDescription = (couponDescription: ErrorResponse, setCouponDescription: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (couponDescription.value.trim() === '') {
        setCouponDescription({
            ...couponDescription,
            error: true,
            message: 'Mô tả coupon không được để rỗng!'
        })
        return false;
    }
    if (couponDescription.value.trim().split(/\s+/).length > 20) {
        setCouponDescription({
            ...couponDescription,
            error: true,
            message: 'Mô tả coupon không được dài hơn 20 từ!'
        })
        return false;
    }


    return true;
};
export const isValidMinOrderValue = (minOrderValue: ErrorResponse, setMinOrderValue: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (minOrderValue.value.trim() === '') {
        setMinOrderValue({
            ...minOrderValue,
            error: true,
            message: 'Giá trị áp dụng không được để rỗng!'
        })
        return false;
    }
    if (Number(minOrderValue.value) < 0) {
        setMinOrderValue({
            ...minOrderValue,
            error: true,
            message: 'Giá trị áp dụng không được nhỏ hơn 0!'
        })
        return false;
    }
    if (!isNumber(minOrderValue.value)) {
        setMinOrderValue({
            ...minOrderValue,
            error: true,
            message: 'Giá trị áp dụng phải là một số!'
        })
        return false;
    }


    return true;
};
export const isValidMaxAmount = (maxAmount: ErrorResponse, setMaxAmount: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    const numberRegex = /^\d+(\.\d+)?$/;
    if (Number(maxAmount.value) < 0) {
        setMaxAmount({
            ...maxAmount,
            error: true,
            message: 'Số tiền giảm tối đa không được nhỏ hơn 0!'
        })
        return false;
    }
    if (!numberRegex.test(maxAmount.value) && maxAmount.value) {
        setMaxAmount({
            ...maxAmount,
            error: true,
            message: 'Số tiền giảm tối đa phải là một số!'
        })
        return false;
    }
    if (Number(maxAmount.value) > 1000000) {
        setMaxAmount({
            ...maxAmount,
            error: true,
            message: 'Số tiền giảm tối đa không vượt quá 1 triệu!'
        })
        return false;
    }
    return true;
};

export const isValidDiscountValue = (minOrderValue: ErrorResponse, discountType: string, discountValue: ErrorResponse, setDiscountValue: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (discountValue.value.trim() === '') {
        setDiscountValue({
            ...discountValue,
            error: true,
            message: 'Giá trị giảm không được để rỗng!'
        })
        return false;
    }
    if (!isNumber(discountValue.value) && discountType === 'FIXED') {
        setDiscountValue({
            ...discountValue,
            error: true,
            message: 'Giá trị giảm tối đa phải là một số!'
        })
        return false;
    }
    if (discountType === 'PERCENTAGE' && (Number(discountValue.value) < 1 || Number(discountValue.value) > 99)) {
        setDiscountValue({
            ...discountValue,
            error: true,
            message: 'Giá trị giảm từ 1%-99%!'
        })
        return false;
    }
    if (discountType === 'FIXED' && (Number(discountValue.value) < 1000 || Number(discountValue.value) > 1000000)) {
        setDiscountValue({
            ...discountValue,
            error: true,
            message: 'Giá trị giảm từ 1.000VND-1.000.000VND!'
        })
        return false;
    }
    if (discountType === 'FIXED' && (Number(discountValue.value) > Number(minOrderValue.value))) {
        setDiscountValue({
            ...discountValue,
            error: true,
            message: 'Giá trị giảm phải nhỏ hơn giá trị tối thiểu!'
        })
        return false;
    }

    return true;
};








