import React, {useEffect, useState} from 'react'
import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import Api from './api/v1/Api'
import {useRouter} from "next/router";
import {showNotification} from "../components/ErrorHandling";
import {numberWithCommas} from "../etc/FormatNumber";

function OrderDetails() {
    const [data, setData] = useState(undefined);
    const [orders, setOrders] = useState([])
    const [order, setOrder] = useState({});
    const api = new Api()
    const router = useRouter();
    const orderId = router.query.orderId
    
    useEffect(() => {
        setData({
            ...data,
            products: orders
        })
    }, [orders]);
    
    
    useEffect(() => {
        api.getOrder(orderId, {}).then((response) => {
            if (response) {
                console.log(response.data)
                setOrder(response.data)
            }
        }).catch((err) => {
            if(err){
                showNotification(err.response?.data?.user_message)
            }
        })
    }, [])

    function fullName() {
        let full_name = "-"
        if (order && order.customer) {
            full_name = `${order.customer.first_name} ${order.customer.last_name}`
        }
        return full_name
    }

    function onlyDate(date) {
        let removeWeekDay = date.split(',')[1];
        let removeTime = removeWeekDay.substring(0, removeWeekDay.length-9)
       return removeTime;
    }

    function loadColorStatus(status) {
        switch (status) {
            case 'موفق':
            case 'پرداخت‌شده':
                return '#00AE40';
            case 'تراکنش ناموفق':
                return '#FF0000';
            case 'منتظر تأیید پرداخت':
                return '#FFAA00';
            default:
                return '#B2B2B2';
        }
    }


    return (
        <MainLayout>
            <section className="page-section mt-8 pt-1 pb-32">
                <figcaption>
                    <Link href="/userOrders" passHref>
                        <a className="size-16 font-bold dark-gray">
                            <span className="fa fa-arrow-right back-arrow-big" />
                            <span>جزییات سفارش</span>
                        </a>
                    </Link>
                    <div className="mt-8 divider mb-8"></div>
                    <div className="flex">
                        <div className="order-detail-table first-col">
                            <div className="font-medium size-12 gray">
                                تاریخ ثبت سفارش
                            </div>
                            <div className="size-12 font-regular fanum">
                                {order.order_date ? onlyDate(order.order_date) : '-'}
                            </div>
                        </div>
                        <div className="order-detail-table">
                            <div className="font-medium size-12 gray">
                                مبلغ کل
                            </div>
                            <div className="size-12 font-regular fanum">
                                {order.total_payment ? numberWithCommas(order.total_payment) + ' تومان' : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="order-detail-table first-col">
                            <div className="font-medium size-12 gray">
                                تحویل گیرنده
                            </div>
                            <div className="size-12 font-regular fanum">
                                {fullName()}
                            </div>
                        </div>
                        <div className="order-detail-table">
                            <div className="font-medium size-12 gray">
                                شماره تماس
                            </div>
                            <div className="size-12 font-regular fanum">
                                {order.customer && order.customer.cellphone || '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="order-detail-table first-col">
                            <div className="font-medium size-12 gray">
                                تعداد کالا
                            </div>
                            <div className="size-12 font-regular fanum">
                                {order.products_count || '-'}
                            </div>
                        </div>
                        <div className="order-detail-table">
                            <div className="font-medium size-12 gray">
                                شماره سفارش
                            </div>
                            <div className="size-12">
                                {order.code || '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="order-detail-table first-col">
                            <div className="font-medium size-12 gray">
                                روش پرداخت
                            </div>
                            <div className="size-12 font-regular fanum">
                                {order.payment && order.payment.method || '-'}
                            </div>
                        </div>
                        <div className="order-detail-table">
                            <div className="font-medium size-12 gray">
                                وضعیت پرداخت
                            </div>
                            <div className="size-12" style={{color: loadColorStatus(order.status)}}>
                                {order.status || '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="order-detail-table first-col">
                            <div className="font-medium size-12 gray">
                                روش ارسال
                            </div>
                            <div className="size-12">
                                {order.shipment ? order.shipment.type : '' || '-'}
                            </div>
                        </div>
                        <div className="order-detail-table">
                            <div className="font-medium size-12 gray">
                                زمان ارسال
                            </div>
                            <div className="size-12 font-regular fanum">
                                {(order.shipment && (order.shipment.real_date ? order.shipment.real_date : order.shipment.committed_date)) || '-'}
                            </div>
                        </div>
                    </div>
                    <div className="text-center size-12 dark-gray mt-3">ارسال به</div>
                    <div className="text-center size-12 mt-4">
                        {order.address && `${order.address.province}، ${order.address.city}، ${order.address.address}. ${order.address.post_code ? `کدپستی: ${order.address.post_code}` : ""}`  ||
                        order.customer && order.customer.addresses && order.customer.addresses.length >0 &&
                        order.customer.addresses[0].province + "، " + order.customer.addresses[0].city + "، " + order.customer.addresses[0].address ||
                        '-'}
                    </div>
                    <div className="mt-8 pt-1 divider mb-8 pb-1"></div>
                    <div className="size-14 font-bold mb-4">اقلام سفارش‌داده‌شده</div>
                    {order && order.products && order.products.length > 0 && 
                    <>
                    {order.products.map(product => (
                        <div className="order-item-container mt-2 flex justify-between">
                            <div className="order-item-discount flex flex-col items-center justify-center white font-bold fanum">
                                <div className="size-11" style={{lineHeight: "0.7"}}>{product.discount || '10%'}</div>
                                <div className="size-7">تخفیف</div>
                            </div>
                            <div className="order-item-image-container">

                            </div>
                            <div style={{width: "135px"}}>
                                <div className="font-medium size-15">{product.fa_title || "کرید اونتوس"}</div>
                                <div className="dark-gray size-10 font-regular fanum">
                                    <div className="mt-1">{product.brand || "هوس آف سیلیج کالکشن"}</div>
                                    <div className="mt-1">{product.model || "ادوپرفیوم"}</div>
                                    <div className="mt-1">{product.size || "۴۰ میل"}</div>
                                </div>
                                <div className="mt-3 flex justify-between font-medium fanum">
                                    <div className="size-12">{product.count} عدد</div>
                                    <div className="size-13">{numberWithCommas(product.total_price)} تومان</div>
                                </div>
                            </div>
                        </div>
                    ))}
                        <div className="mt-8 pt-1">
                            <div className="payment-amount-container">
                                <div className="flex justify-between size-14 font-medium fanum">
                                    <div className="mr-2">{`قیمت کالاها (${order.products_count}عدد)`}</div>
                                    <div className="ml-2">{numberWithCommas(order.order_products_price) + ' تومان'}</div>
                                </div>
                                <div className="flex justify-between size-14 font-medium fanum mt-4">
                                    <div className="mr-2">هزینه ارسال</div>
                                    <div className="ml-2">{numberWithCommas(order.shipment.price) + ' تومان'}</div>
                                </div>
                                {(order.discount && order.discount !== 0) ? (
                                    <div className="flex justify-between size-14 font-medium fanum mt-4">
                                        <div className="mr-2">تخفیف</div>
                                        <div className="ml-2">{numberWithCommas(order.discount) + ' تومان'}</div>
                                    </div>
                                ): null}
                                <div className="flex justify-between size-15 font-bold text-atrcheeBlue fanum mt-4 total-amount-div">
                                    <div>جمع کل</div>
                                    <div>{numberWithCommas(order.total_payment) + ' تومان'}</div>
                                </div>
                            </div>
                        </div>
                    </>
                    }
                    <div className="mt-8 pt-1 divider mb-8 pm-1"></div>
                    <div className="size-14 font-bold">جزییات تراکنش</div>
                    {order.payment &&  order.payment.method==='آنلاین' &&
                        <>
                            <div className="mt-6 pt-1">
                                <span className="font-medium gray size-12 ml-3">زمان پرداخت:</span>
                                <span className="size-12 font-light fanum">{order.payment.pay_time || '-'}</span>
                            </div>
                            <div className="mt-4">
                            <span className="font-medium gray size-12 ml-3">شناسه پرداخت:</span>
                                <span className="size-12 font-light fanum">{order.payment.code || '-'}</span>
                            </div>
                            <div className="mt-4">
                            <span className="font-medium gray size-12 ml-3">شناسه پیگیری:</span>
                                <span className="size-12 font-light fanum">{order.payment.ref_num || '-'}</span>
                            </div>
                        </>
                    }
                    {order.payment &&  order.payment.method==='کارت به کارت' &&
                        <>
                            <div className="mt-6 pt-1">
                                <span className="font-medium gray size-12 ml-1">زمان کارت به کارت:</span>
                                <span className="size-12 font-regular fanum">{order.payment && order.payment.pay_time || '-'}</span>
                            </div>
                            <div className="mt-4">
                            <span className="font-medium gray size-12 ml-3">چهار رقم آخر کارت:</span>
                                <span className="size-12 font-regular fanum">{order.payment && order.payment.card_last_four_digits || '-'}</span>
                            </div>
                        </>
                    }
                </figcaption>
            </section>
        </MainLayout>
    )
}

export default OrderDetails