import withAuth from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/login'
    }
});

// Áp dụng middleware cho tất cả các đường dẫn **trừ** `/forgot/password`
export const config = {
    matcher: [
        '/((?!forgot/password).*)', // Tất cả trừ "/forgot/password"
    ]
};
