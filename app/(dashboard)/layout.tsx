import React from 'react'
import { Navbar } from './_components/(navbar)'
import { Sidebar } from './_components/(sidebar)';
import {Container} from './_components/container'

interface BrowserLayoutProps {
    children: React.ReactNode;
}

function Browserlayout({ children }: BrowserLayoutProps) {
    return (
        <>
            <Navbar></Navbar>
            <div className='flex h-full pt-20'>
                <Sidebar></Sidebar>
                <Container>
                    {children}
                </Container>
            </div>
        </>
    )
}

export default Browserlayout