import AppHeader from "@/components/header/app.header"
import AppSidebar from "@/components/sidebar/app.sidebar"
import { Content } from "antd/es/layout/layout";

const SignedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            <AppSidebar />
            <div className="w-full bg-[#ebf2fa]">
                <AppHeader />
                <Content style={{ padding: '20px' }}>{children}</Content>
            </div>
        </div>
    )
}

export default SignedLayout