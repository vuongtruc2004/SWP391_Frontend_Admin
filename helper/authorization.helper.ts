export const getNavigateLink = (roleName: string): string => {
    switch (roleName) {
        case 'EXPERT':
            return "/course"
        case 'MARKETING':
            return "/blog"
        default:
            return "/dashboard"
    }
}