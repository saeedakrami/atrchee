import React, {useEffect, useState} from 'react'
import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import Api from './api/v1/Api';
import {showNotification} from "../components/ErrorHandling";
import Loading from "../components/Loading";
import Menu from '../components/Menu';

function userOrders() {

    const [loading, setLoading] = useState(false);
    const [ordersCount, setOrdersCount] = useState([]);

    const api = new Api();
    useEffect(() => {
        setLoading(true)
        api.getOrdersCount().then((response) => {
            setOrdersCount(response.data.order_counts)
            setLoading(false)
        }).catch((err) => {
            if (err) {
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }, [])

    return (
        <MainLayout logo={true}>
            {loading ?
                <Loading loading={loading} color={'#861E3F'} size={'30'}/> 
            :
                <section className="page-section mt-4 pb-32">
                    {ordersCount.map(order => (
                        <Link href={order.count > 0 ? {pathname: '/ordersList', query: {ordersType: order.status}}: ''}>
                            <a>
                                <div className="order-list-card mt-4">
                                    <div className="font-bold size-16">{order.readable_status}</div>
                                    <div className={`order-list-card-count size-14 font-extrabold fanum white ${(order.status === 'WAITING_FOR_PAYMENT' && order.count > 0) ? "bg-atrcheePrimary" : ""}`}>{order.count}</div>
                                </div>
                            </a>
                        </Link>
                    ))}
                </section>
            }
            <Menu />
        </MainLayout>
    )
}

export default userOrders