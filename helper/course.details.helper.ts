export const getNumberOfLessonType = (
    course: CourseDetailsResponse,
    type: "VIDEO" | "DOCUMENT"
): number => {
    return course.chapters.reduce((rs, chapter) =>
        rs + chapter.lessons.reduce((sum, lesson) =>
            lesson.lessonType === type ? sum + 1 : sum
            , 0)
        , 0);
}

export const convertSecondToTime = (second: number): string => {
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const seconds = second % 60;

    let arr: number[] = [];

    if (hours > 0) {
        arr.push(hours, minutes, seconds);
    } else if (minutes > 0) {
        arr.push(minutes, seconds);
    } else {
        arr.push(seconds);
    }

    return arr.map(unit => unit.toString().padStart(2, '0')).join(':');
};