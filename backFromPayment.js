import React, {useState, useEffect} from 'react'
import MainLayout from "../layouts/mainlayout";
import Router from 'next/router'
import ls from 'local-storage'
import Button from '../components/Button';

function BackFromPayment() {
    const [loading, setLoading] = useState(false);
    const [paymentCodes,setPaymentCodes] = useState([]);
    
    function followingOrder(e){
        e.preventDefault();
        let orderId = ls.get('order_id');
        ls.remove('order_id');
        setLoading(true)
        Router.push({
            pathname: '/orderDetails',
            query: { orderId: orderId }})
        setLoading(false)
    }

    useEffect(()=> {
        let queryString = window.location.pathname;
        console.log('aaaa', queryString);
        // let is_verified = queryString.slice(queryString.indexOf('is_verified=')+12, queryString.indexOf('&'));
        // if(parseInt(is_verified)===1) {
        //     let lastQuery = queryString.slice(queryString.indexOf('payment_reference_number='));
        //     let payment_reference_number = lastQuery.slice(25,lastQuery.indexOf('&'));
        //     let order_code = lastQuery.slice(lastQuery.indexOf("order_code=")+11);
        //     setPaymentCodes([payment_reference_number, order_code]);
        // }
    }, [])


    return (
        <MainLayout logo={true}>
            <section className="page-section">
                <figcaption>
                    <form className='m-auto'>
                        <div className='w-full mt-6'>
                            <span className='green font-medium size-16'>
                                {paymentCodes && paymentCodes.length>0 ? 
                                'پرداخت شما با موفقیت انجام شد.':
                                 'درخواست شما با موفقیت ثبت شد.'}
                            </span>
                            {paymentCodes && paymentCodes.length>0 ? (
                                <>
                                    <div className="mt-5">
                                        <span className="size-12 gray font-medium ml-2">شناسه پرداخت:</span>
                                        <span className="size-12 font-regular fanum">{paymentCodes[0]}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="size-12 gray font-medium ml-2">شناسه پیگیری:</span>
                                        <span className="size-12 font-regular fanum">{paymentCodes[1]}</span>
                                    </div>
                                </>
                            ): (
                                <div className="mt-4">
                                    <span className="size-11 dark-gray">
                                        محصولات خریداری‌شده، شما پس از تایید پرداخت توسط عطرچی برای شما ارسال خواهد شد.
                                    </span>
                                </div>
                            )}
                            <div className="mt-6 pt-1">
                                <form onSubmit={followingOrder}>
                                    <Button loading={loading} text="مشاهده و پیگیری سفارش" />
                                </form>
                            </div>
                        </div>
                    </form>
                </figcaption>
            </section>
        </MainLayout>
    )
}

export default BackFromPayment