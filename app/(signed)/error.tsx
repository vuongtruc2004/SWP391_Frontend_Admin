'use client'
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useEffect } from 'react'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className='w-full h-screen bg-white flex items-center justify-center text-black'>
            <div className='flex flex-col items-center justify-center'>
                <div className='mb-1.5 flex items-center justify-center'>
                    <p className='font-semibold text-2xl'>Error</p>
                    <Divider orientation="vertical" sx={{ borderColor: '#6c757d', height: '30px', marginInline: '10px' }} variant="middle" flexItem />
                    <h2 className='text-lg'>{error.message}</h2>
                </div>
                <Button onClick={() => window.location.reload()} variant='contained' color='error'>
                    Try again
                </Button>
            </div>
        </div>
    )
}