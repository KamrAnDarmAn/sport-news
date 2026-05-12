import { auth } from '@/auth';
import { prisma } from '@/lib/prisma'
import React from 'react'

const SS = async () => {
    const users = await prisma.user.findMany();
    const session = await auth();
    console.log('CURRENT USER', session)

    return (
        <div>
            <div>
                {
                    users && users.map(user => <div key={user.id}>
                        {user.email}
                    </div>)
                }
            </div>

            <div>
                IS LOGGED IN <br />
                {session ? session.user.email : "Oops!"}
            </div>


        </div >
    )
}

export default SS