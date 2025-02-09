'use client'
import { SessionProvider } from 'next-auth/react'

const NextAuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
export default NextAuthWrapper