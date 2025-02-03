import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ProgressBarWrapper from "@/components/wrapper/progress-bar/progress.bar.wrapper";
import { ToastContainer } from "react-toastify";
import { CollapseSidebarWrapper } from "@/components/wrapper/collapse-sidebar/collapse.sidebar.wrapper";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Name of this website",
  description: "Best website for online learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={poppins.className}>

        <AntdRegistry>

          <ProgressBarWrapper>

            <CollapseSidebarWrapper>

              {children}
              <ToastContainer />

            </CollapseSidebarWrapper>

          </ProgressBarWrapper>

        </AntdRegistry>

      </body>

    </html>
  );
}
