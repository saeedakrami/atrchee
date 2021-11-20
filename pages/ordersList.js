import React, {useEffect, useState} from 'react';
import MainLayout from '../layouts/mainlayout';
import Link from "next/link";
import Api from './api/v1/Api';
import Loading from "../components/Loading";
import {numberWithCommas} from "../etc/FormatNumber";
import Button from '../components/Button';

const OrdersList = () => {
    const [title, setTitle] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const api = new Api();
    
    useEffect(() => {
        setLoading(true)
        const queryString = window.location.search;
        let orderType = queryString.slice(queryString.indexOf('=')+1);
        api.getOrders(orderType).then((response) => {
            setOrders(response.data.orders)
            setLoading(false)
        }).catch((err) => {
            if (err) {
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
        switch(orderType) {
            case 'WAITING_FOR_PAYMENT':
                return setTitle('در انتظار پرداخت');
            case 'BEING_PROCESSED_TO_BE_SENT':
                return setTitle('در حال پردازش و ارسال');
            case 'DELIVERED':
                return setTitle('تحویل شده');
            case 'EXPIRED':
                return setTitle('سفارش منقضی شده');
        }

    }, [])

    function onlyDate(date) {
        let removeWeekDay = date.split(',')[1];
        let removeTime = removeWeekDay.substring(0, removeWeekDay.length-9)
       return removeTime;
    }

    return (
        <MainLayout>
            <section className="page-section pt-1 pb-32">
                <Link href="/userOrders" passHref>
                    <a className="dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span className="size-16 font-bold">{title}</span>
                    </a>
                </Link>
                <div className="mt-8 divider" />
                <div className="mt-6 pt-1">
                    {loading ?
                        <Loading loading={loading} color={'#861E3F'} size={'30'} />
                    :
                        orders && orders.length > 0 && orders.map(order => (
                            <div className="orders-list-container mt-3">
                                <div className="w-full flex justify-between items-center">
                                    <div>
                                        <div className="font-bold size-14">{order.code}</div>
                                        <div className="font-regular size-12 fanum mt-1">{onlyDate(order.order_date)}</div>
                                    </div>
                                    <div className="font-regular size-12 fanum">
                                        {numberWithCommas(order.total_payment)} تومان
                                    </div>
                                </div>
                                <div className="w-full flex justify-between">
                                    <div className="flex">
                                        {order.products.map(product => (
                                            <div className="product-thumbnail-pic">

                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {order.status === 'سفارش جدید' ? (
                                            <div className="ordersList-button-container">
                                                <Button loading={loading} text="پرداخت" height="28px" className="size-12 font-medium bg-success" />
                                            </div>
                                        ) : (
                                            <div>
                                                <Link href={{
                                                    pathname: '/orderDetails',
                                                    query: { orderId: order.id }
                                                }} passHref>
                                                    <a className='text-atrcheeBlue'>
                                                        <span className='size-12 font-medium'>جزییات سفارش</span>
                                                        <i className='fa fa-chevron-left mr-2 size-10' />
                                                    </a>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </MainLayout>
    );
}
 
export default OrdersList;