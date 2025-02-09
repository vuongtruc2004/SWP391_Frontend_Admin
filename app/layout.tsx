import { Quicksand } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ProgressBarWrapper from "@/wrapper/progress-bar/progress.bar.wrapper";
import { ToastContainer } from "react-toastify";
import { CollapseSidebarWrapper } from "@/wrapper/collapse-sidebar/collapse.sidebar.wrapper";
import NextAuthWrapper from "@/wrapper/next-auth/next.auth.wrapper";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={quicksand.className}>

        <AntdRegistry>

          <NextAuthWrapper>
            <ProgressBarWrapper>

              <CollapseSidebarWrapper>

                {children}
                <ToastContainer />

              </CollapseSidebarWrapper>

            </ProgressBarWrapper>
          </NextAuthWrapper>

        </AntdRegistry>

      </body>

    </html>
  );
}
