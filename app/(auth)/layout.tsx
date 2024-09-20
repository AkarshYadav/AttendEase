import React from 'react'
import { Logo } from './_components/logo';

function Authlayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className=' h-full  flex flex-col justify-center items-center space-y-5 mt-10 '>
            <Logo />
            {children}</div>
    )
}

export default Authlayout