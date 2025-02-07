export const isFullNumber = (s: string): boolean => {
    const regex = /^\d+$/;
    if (!regex.test(s))
        return false;
    return true;
}