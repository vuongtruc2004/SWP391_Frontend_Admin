export const getPublished = (value: string | undefined | null) => {

    if (!value || (value !== 'active' && value !== 'unactive')) {
        return 'ALL';
    }
    else {
        return value;
    }

}

export const getMaxAttempts = (value: string | null | undefined): string | number => {
    if (!value || !/^\d+(\.\d+)?$/.test(value.trim())) {
        return '';
    }
    return Number(value);
};

export const getStartedAt = (value: string | undefined | null) => {

    if (!value || (value !== 'noTime' && value !== 'haveTime')) {
        return 'ALL';
    }
    else {
        return value;
    }

}