import React, { useEffect, useState } from 'react'
import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import Api from './api/v1/Api'
import { showNotification } from "../components/ErrorHandling";
import Loading from "../components/Loading";
import ls from 'local-storage'
import Router from 'next/router';
import Button from '../components/Button';
import Menu from '../components/Menu';


function UserAddresses() {

    const [addresses, setAddresses] = useState([]);
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(2);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");

    const limit = 2;
    let arrayForHoldingPosts = [];
    const api = new Api()

    let fromOrders = ls.get('fromOrders');

    useEffect(() => {
        setLoading(true)
        api.userAddresses().then((response) => {
            if (response) {
                setAddresses(response.data.addresses)
                setLoading(false)
            }
        }).catch((err) => {
            if (err) {
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }, [])

    useEffect(()=>{

        let addressId=ls.get("orderAddrId")
        if(addressId){

            setSelectedAddress(addressId)
        }

    },[])
    useEffect(() => {
        loopWithSlice(0, limit);
    }, [addresses]);

    const loopWithSlice = (start, end) => {
        const slicedPosts = addresses.slice(start, end);
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };

    const handleShowMorePosts = () => {
        loopWithSlice(0, next + limit);
        setNext(next + 2);
    };

    return (
        <section className="page-section mt-10 pb-32">
            <form>
                {loading ?
                    <Loading loading={loading} color={'#861E3F'} size={'30'} /> :
                        postsToShow && postsToShow.length > 0 ?
                            postsToShow.map((address) => (
                                <div key={address.id} className="pb-1 mb-6">
                                    <div className="size-12 dark-gray">
                                        {address.address}
                                    </div>
                                    <div className="mt-6 pt-1">
                                        <i className='fa fa-map-marker-alt gray size-16 ml-1' />
                                        <span className='gray size-12 font-medium'>
                                            {`${address.province || "-"}, ${address.city || "-"}`}
                                        </span>
                                    </div>
                                    <div className='mt-4'>
                                        <i className='far fa-envelope gray size-16 ml-1' />
                                        <span className='gray size-12 font-medium fanum'>{address.post_code || "-"}</span>
                                    </div>
                                    <div className='mt-4'>
                                        <i className='fa fa-phone-alt gray size-16 ml-1' />
                                        <span className='gray size-12 font-medium fanum'>{address.cellphone || "-"}</span>
                                    </div>
                                    <div className='mt-4'>
                                        <i className='far fa-user gray size-16 ml-1' />
                                        <span
                                            className='gray size-12 font-medium'>{`${address.first_name || "-"} ${address.last_name || "-"}`}</span>
                                    </div>
                                    <div className="mt-5 flex justify-between">
                                        <div>
                                            <Link href={{
                                                pathname: '/editAddress',
                                                query: { addressId: address.id }
                                            }} passHref>
                                                <a className='text-atrcheeBlue'>
                                                    <span className='size-12'> ویرایش نشانی</span>
                                                    <i className='fa fa-chevron-left mr-2 size-10' />
                                                </a>
                                            </Link>
                                        </div>
                                        {(fromOrders && postsToShow.length > 1) && (
                                            <div className="select-default-address">
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    let oId = ls.get('addrSelectFor');
                                                    if (oId) {
                                                        ls.remove('addrSelectFor')
                                                        ls.set('orderAddrId', address.id)
                                                        Router.push({
                                                            pathname: '/orders',
                                                            query: { id: oId }
                                                        })
                                                    }
                                                }}>
                                                    <Button
                                                        text="انتخاب آدرس"
                                                        height="28px"
                                                        secondaryButton={true}
                                                        className="size-14 font-medium"
                                                    />
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-1 line-divider" />
                                </div>
                            )):
                                <div className='text-center pt-5'>
                                    <span className='text-xs text-gray-500'>
                                        هنوز آدرسی از شما ثبت نشده است.
                                    </span>
                                </div>
                        }
                    </form>
                    {postsToShow.length < addresses.length &&
                        <div className='w-full text-center'>
                            <a href='#' className='text-xs text-atrcheeBlue'
                                onClick={handleShowMorePosts}>آدرس های بیشتر ...</a>
                        </div>
                    }
            <div className=' mx-2 pt-2'>
                <Link href='/editAddress'>
                    <a className="dark-gray">
                        <i className="far fa-plus-square size-16 ml-1"></i>
                        <span className="size-12">اضافه کردن آدرس جدید</span>
                    </a>
                </Link>
            </div>
        </section>
    )
}


function userAddressesPage() {
    return (
        <MainLayout logo={true}>
            <UserAddresses />
            <Menu />
        </MainLayout>
    )
}

export default userAddressesPage


 
