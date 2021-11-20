import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import ls from "local-storage";
import dynamic from "next/dynamic";
import Api from '../pages/api/v1/Api';
import {useRouter} from "next/router";

const MainLayout = (props) => {

    const [isAuthenticated, setIsAuthenticated] = useState(!!ls.get('token'));
    const token = ls.get('token')
    const api = new Api()
    const router = useRouter()
    // let orderId = router.query.id;
    // useEffect(() => {
    //     orderId = router.query.id;
    //     console.log(orderId)
    //   }, [router.query]);

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])
    let path = window.location.pathname;
    let pathArr = path.split('/').filter(Boolean);
    let orderId = pathArr[1];
    console.log(orderId)

    if (typeof window === 'undefined')
        return <p>redirecting</p>

    if (!isAuthenticated && !(path.startsWith('/login') ||  path === '/createAccount')) {
        ls.clear()
        if (path.startsWith('/order')) {
            // let orderId = window.location.search.slice(window.location.search.indexOf('?id=') + 4);
            // if (orderId.indexOf('/') !== -1) orderId = orderId.slice(0,orderId.indexOf('/'));
            ls.set('atrchee-redirect',path)
            api.getOrderValidity(orderId,{}).then(response => {
                console.log(response)
                if(!response.data.is_link_valid) {
                    let errorReason = response.data.reason_for_invalidity;
                    let error = '';
                    if(errorReason === 'هیچ سفارشی یافت نشد!') error = 'ORDER_NOT_FOUND';
                    else if (errorReason === 'لینک سفارش منقضی شده است.') error = 'ORDER_IS_EXPIRED';
                    ls.clear();
                    router.push({pathname: '/errorPage', query:{error: error}})
                } else {
                    router.push('/login');
                }
            })
        } else {
            router.push('/login');
        }
        return <div className='w-full h-screen flex items-center justify-center'></div>
    }
    if (isAuthenticated && (path.startsWith('/login') || path === '/' || path === '')) {
        router.push('/userOrders')
        return <div className='w-full h-screen flex items-center justify-center'></div>
    }
    return (
        <div id="app">
            <div className="full-width mx-auto bg-white relative">
                <Header logo={props.logo} />
                {props.children}
            </div>
        </div>
    )
}
export default dynamic(() => Promise.resolve(MainLayout), {
    ssr: false,
});