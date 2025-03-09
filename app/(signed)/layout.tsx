import AppHeader from "@/components/header/app.header";
import AppSidebar from "@/components/sidebar/app.sidebar";

const SignedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            <AppSidebar />
            <div className="w-full bg-[#ebf2fa] overflow-y-auto min-h-screen relative h-screen">
                <AppHeader />
                <div className="p-5 overflow-auto h-[calc(100vh-64px)]">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SignedLayout