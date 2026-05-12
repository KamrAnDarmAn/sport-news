import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { BookmarksProvider } from '@/hooks/use-bookmarks';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    // if (!session)
    //     redirect('/auth')

    return (
        <BookmarksProvider>
            {React.cloneElement(children as any, { session })}
        </BookmarksProvider>
    )
}

export default Layout