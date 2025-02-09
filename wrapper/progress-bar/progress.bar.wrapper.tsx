'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height='3px'
                color='#60a5fa'
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    )
}

export default ProgressBarWrapper