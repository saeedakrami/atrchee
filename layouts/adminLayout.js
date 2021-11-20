import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import ls from "local-storage";
import Router from "next/router";

const AdminLayout = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(!!ls.get('admin_token'));
    const token = ls.get('admin_token')

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    if (typeof window === 'undefined')
        return <p>redirecting</p>
    if (!isAuthenticated && (Router.pathname !== '/admin/login')) {
        Router.push('/admin/login')
        return <div className='w-full h-screen flex items-center justify-center'> Redirecting ... </div>
    } else if (isAuthenticated && (Router.pathname === '/admin/login')) {
        Router.push('/admin/orderSubmission')
        return <div className='w-full h-screen flex items-center justify-center'> Redirecting ... </div>
    }
    return (
        <div id="admin" className="bg-gray-300">
            <div className="container mx-auto bg-white min-h-screen py-3">
                {children}
            </div>

        </div>
    )
}
export default dynamic(() => Promise.resolve(AdminLayout), {
    ssr: false,
});