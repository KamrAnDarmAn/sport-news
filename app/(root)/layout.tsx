import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    // const session = await auth();
    // if (!session)
    //     redirect('/auth')

    return (
        <>
            {children}
        </>
    )
}

export default Layout