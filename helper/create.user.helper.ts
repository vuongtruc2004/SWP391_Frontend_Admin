import dayjs from "dayjs";
import { SetStateAction } from "react";

export const validEmail = (email: ErrorResponse, setEmail: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (email.value.trim() === '') {
        setEmail({
            ...email,
            error: true,
            message: 'Email không được để rỗng'
        })
        return false
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.value)) {
        setEmail({
            ...email,
            error: true,
            message: "Email không đúng định dạng"
        })
        return false;
    }
    setEmail({ ...email, error: false, message: "" });
    return true;
}

export const validFullName = (fullName: ErrorResponse, setFullName: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (fullName.value.trim() === '') {
        setFullName({
            ...fullName,
            error: true,
            message: 'Họ và tên không được để rỗng'
        })
        return false;
    }


    return true;

}

export const validPassword = (password: ErrorResponse, setPassword: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (password.value.trim() === '') {
        setPassword({
            ...password,
            error: true,
            message: 'Mật khẩu không được để rỗng'
        })
        return false;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password.value)) {
        setPassword({
            ...password,
            error: true,
            message: 'Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ cái và số!'
        })
        return false;
    }
    return true;

}

export const validGender = (gender: ErrorResponse, setGender: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (gender.value.trim() === '') {
        setGender({
            ...gender,
            error: true,
            message: 'Giới tính không được để rỗng'
        })
        return false;
    }
    return true;

}

export const validRole = (role: ErrorResponse, setRole: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (role.value.trim() === '') {
        setRole({
            ...role,
            error: true,
            message: 'Vai trò không được để trống'
        })
        return false;
    }
    return true;

}


export const validDob = (dob: ErrorResponse, setDob: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (!dob.value || dob.value.trim() === '') {
        setDob({
            ...dob,
            error: true,
            message: 'Ngày sinh không được để trống'
        })
        return false;
    }

    const birthDate = dayjs(dob.value);
    const age = dayjs().diff(birthDate, 'year');
    if (age < 6) {
        setDob({
            ...dob,
            error: true,
            message: 'Tuổi phải lớn hơn hoặc bằng 6'
        });
        return false;
    }
    return true;

}

export const validDobUpdate = (dob: ErrorResponse, setDob: React.Dispatch<SetStateAction<ErrorResponse>>): boolean => {
    if (!dob.value || dob.value.trim() === '') {
        return true;
    }

    const birthDate = dayjs(dob.value);
    const age = dayjs().diff(birthDate, 'year');
    if (age < 6) {
        setDob({
            ...dob,
            error: true,
            message: 'Tuổi phải lớn hơn hoặc bằng 6'
        });
        return false;
    }
    return true;

}

export const getLocked = (value: string | undefined | null) => {

    if (!value || (value !== 'active' && value !== 'unactive')) {
        return 'ALL';
    }
    else {
        return value;
    }

}
export const getRoleName = (value: string | undefined | null) => {
    if (!value || (value !== 'ADMIN' && value !== 'EXPERT' && value !== 'USER' && value !== 'MARKETING')) {
        return 'ALL';
    } else {
        return value;
    }
}

export const getGender = (value: string | null | undefined) => {

    if (!value || (value !== 'MALE' && value !== 'FEMALE')) {
        return 'ALL';
    } else {
        return value;
    }
}