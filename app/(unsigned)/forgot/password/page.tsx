import ResetPassword from "@/components/reset-password/reset.password";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đổi mật khẩu",
};
const ForgotPasswordPage = () => {
    return (
        <ResetPassword />
    )
}

export default ForgotPasswordPage