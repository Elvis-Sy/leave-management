"use client"

import { useEffect } from 'react'
import { initSocket } from './socket'

export const SocketProvider = ({children} : {children: React.ReactNode}) => {

    useEffect(()=>{
        initSocket()
    }, [])

    return <>{children}</>
}