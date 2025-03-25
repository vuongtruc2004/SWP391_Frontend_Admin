
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