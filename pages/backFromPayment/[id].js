import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Api from '../api/v1/Api';
import MainLayout from "../../layouts/mainlayout";
import Button from '../../components/Button';
import ls from 'local-storage';
import Router from 'next/router';


// let path = document.location.pathname;

export default function BackFromPayment() {
    const router = useRouter()
    const { id } = router.query;
    const api = new Api();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

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
        if(id && id !== 'card') {
            api.getPaymentData(id).then(response => {
                setData(response.data)
            })
        }
    }, [])

    return (
        <MainLayout logo={true}>
            <section className="page-section">
                <figcaption>
                    <form className='m-auto'>
                        <div className='w-full mt-6'>
                            <span className='green font-medium size-16'>
                                {id !== 'card' ? 
                                'پرداخت شما با موفقیت انجام شد.':
                                 'درخواست شما با موفقیت ثبت شد.'}
                            </span>
                            {id !== 'card' ? (
                                <>
                                    <div className="mt-5">
                                        <span className="size-12 gray font-medium ml-2">شناسه پرداخت:</span>
                                        <span className="size-12 font-regular fanum">{data.order_code}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="size-12 gray font-medium ml-2">شناسه پیگیری:</span>
                                        <span className="size-12 font-regular fanum">{data.payment_reference_number}</span>
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
  
 