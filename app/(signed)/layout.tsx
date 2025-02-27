import AppHeader from "@/components/header/app.header";
import AppSidebar from "@/components/sidebar/app.sidebar";

const SignedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            <AppSidebar />
            <div className="w-full bg-[#ebf2fa] overflow-y-auto min-h-screen relative">
                <AppHeader />
                <div className="p-5">{children}</div>
            </div>
        </div>
    )
}

export default SignedLayout