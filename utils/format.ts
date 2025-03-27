import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN');
};

export const formatCouponSalePrice = (price: number): string => {
    if (price >= 1000000) {
        return (Number.isInteger((price / 1000000)) ? (price / 1000000) : (price / 1000000).toFixed(1)) + 'tr';
    } else if (price >= 1000) {
        return (Number.isInteger((price / 1000)) ? (price / 1000) : (price / 1000).toFixed(1)) + 'k';
    } else {
        return Number.isInteger(price) ? price.toString() : price.toFixed(1);
    }
}

export const formatDate = (date: string) => {
    return dayjs(date).locale('vi').format('D [tháng] M, YYYY');
};

export const formatDateTimeFull = (date: string) => {
    const formattedDate = dayjs(date)
        .locale('vi')
        .format('dddd, D [tháng] M YYYY, HH:mm');

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};
export const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime)
        .tz('Asia/Ho_Chi_Minh')
        .locale('vi')
        .format('HH:mm DD-MM-YYYY');
};

export const formatTotalFollowers = (total: number): string => {
    if (total >= 1000000000) {
        const value = total / 1000000000;
        return value % 1 === 0 ? `${value} T` : `${value.toFixed(1)} T`;
    } else if (total >= 1000000) {
        const value = total / 1000000;
        return value % 1 === 0 ? `${value} Tr` : `${value.toFixed(1)} Tr`;
    } else if (total >= 1000) {
        const value = total / 1000;
        return value % 1 === 0 ? `${value} N` : `${value.toFixed(1)} N`;
    } else {
        return `${total}`;
    }
};

export const formatToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(hours);
    parts.push(minutes, seconds);

    return parts.map(unit => unit.toString().padStart(2, '0')).join(':');
};

export const formatToText_HoursMinutes = (second: number): string => {
    const hours = Math.floor(second / 3600);
    const minutes = Math.ceil((second % 3600) / 60);

    return [
        hours > 0 ? `${hours} tiếng` : "",
        minutes > 0 ? `${minutes} phút` : ""
    ].filter(Boolean).join(' ');
};

export const formatToText_HoursMinutes_Short = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60);

    return [
        hours > 0 ? `${hours} giờ` : "",
        minutes > 0 ? `${minutes} phút` : ""
    ].filter(Boolean).join(' ');
};

export const formatToText_DaysHoursMinutes = (totalSeconds: number) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    return [
        days > 0 ? `${days} ngày` : "",
        hours > 0 ? `${hours} giờ` : "",
        minutes > 0 ? `${minutes} phút` : ""
    ].filter(Boolean).join(' ') || "0 phút";
};

export const formatToMMSS = (second: number): string => {
    const minutes = Math.floor(second / 60);
    const seconds = second % 60;

    return [minutes, seconds].map(unit => unit.toString().padStart(2, '0')).join(':');
};

export const formatToText_DaysHHMMSS = (totalSeconds: number) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    const timeParts = [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ].join(":");

    return [
        days > 0 ? `${days} ngày` : "",
        timeParts
    ].filter(Boolean).join(' ');
};
