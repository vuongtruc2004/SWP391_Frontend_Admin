export { }

declare global {
    interface BlogFilter {
        key: string;
        name: string;
        icon?: React.ReactNode;
    }
}