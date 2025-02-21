export const getOrderStatus = (value: string | null | undefined) => {

    if (!value || (value !== 'PENDING' && value !== 'COMPLETED')) {
        return 'ALL';
    } else {
        return value;
    }
}

export const getPrice = (value: string | null | undefined): string | number => {
    if (!value || !/^\d+(\.\d+)?$/.test(value.trim())) {
        return '';
    }
    return Number(value);
};

