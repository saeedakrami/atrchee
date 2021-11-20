import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import MainLayout from "../../layouts/mainlayout";
import moment from 'moment-jalaali'
import Api from '../api/v1/Api'
import {provinces} from '../../etc/city'
import ls from 'local-storage'
import Router from 'next/router'
import {showNotification} from "../../components/ErrorHandling";
import {numberWithCommas} from "../../etc/FormatNumber";
import Link from "next/link";
import Loading from "../../components/Loading";
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import Input from '../../components/Input';
import AutocompleteInput from '../../components/AutocompleteInput';

import {useStateCallback} from '../../etc/myHooks'

moment.loadPersian({
    usePersianDigits: false,
    dialect: 'persian-modern'
})

function Orders()  {
    const [addressId, setAddressId] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useStateCallback({});
    const [address, setAddress] = useState(undefined);
    const [addressData, setAddressData] = useState({});
    const [cities, setCities] = useState([]);
    const [provincesId, setProvincesId] = useState(undefined);
    let [data, setData] = useState({});
    const [citiesLoading, setCitiesLoading] = useState(false);
    const router = useRouter()

    
    const token = ls.get('token')
    const api = new Api()
    let id = router.query.id;
    
    useEffect(() => {
        setData({oId:id,...data})
        ls.remove('fromOrders')
        if (token && id) {
            api.linkOrderInfo(id, {})
            .then((response) => {
                setOrderInfo(response.data.order,(orderInfo) => {
                    if (orderInfo?.customer?.addresses && orderInfo.customer.addresses.length>0) {
                        let AddrId = ls.get('orderAddrId')
                        ls.remove('orderAddrId')
                        if (AddrId){
                            setAddress(orderInfo.customer.addresses.find((a)=>a.id == AddrId));
                            setAddressData(orderInfo.customer.addresses.find((a)=>a.id == AddrId));
                        }else{
                            setAddress(orderInfo.customer.addresses[0]);
                            setAddressData(orderInfo.customer.addresses[0]);
                            setAddressId(orderInfo.customer.addresses[0].id);
                        }  
                    }
                })    
            }).catch((err) => {
                if(err){
                    showNotification(err.response?.data?.user_message)
                }
            })
        }
    }, [router.query.id]);


    useEffect(() => {
        if(provincesId){
            loadCitiesOfProvinces()
        }

    }, [provincesId])

    const onChange = (e) => {
        if (e.target.value) {
            setData({
                ...data,
                [e.target.name]: e.target.value,
            })
        }
    }

    function loadCitiesOfProvinces() {
        setCitiesLoading(true);
        let citiesArray={};
        api.getProvinceCities(provincesId, {}).then((response) => {
            response.data.cities.map(city => {
                citiesArray[city.id] = city.name;
            })
            setCities(citiesArray)
            setCitiesLoading(false)
        }).catch((err) => {
            if(err){
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    function onChangeAddress(e) {
        setAddressData({
            ...addressData,
            first_name:orderInfo.customer.first_name,
            last_name:orderInfo.customer.last_name,
            cellphone:orderInfo.customer.cellphone,
            [e.target.name]: e.target.value
        })
    }

    function addAddress(e) {
        e.preventDefault();
        api.storeAddress({...addressData,is_default:false}).then((response) => {
            if (response) {
                setAddressId(response.data.address.id)
                setTimeout((e)=>goToPayment(e),100)
            }
        }).catch((err) => {
            if(err){
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    function goToPayment(e) {
        console.log(id)
        setLoading(true);
        e && e.preventDefault();
        if(address && !address.post_code && orderInfo.shipment.type === "پست پیشتاز") {
            if (!addressData.post_code) {
                showNotification('تکمیل فیلد کدپستی اجباری است');
                setTimeout(()=> setLoading(false), 2000)
            } else {
                api.editAddress(address.id, {...addressData,is_default:false}).then(response=> {
                    if(response) {
                        ls.set('addrSelectFor',data.oId)
                        address && ls.set("orderAddrId",address.id)
                        Router.push({pathname: `/payment/${id}`});
                    }
                }).catch(error => {
                    console.log(error.response)
                })
            }
        } else {
            ls.set('addrSelectFor',data.oId)
            address && ls.set("orderAddrId",address.id)
            Router.push({pathname: `/payment/${id}`});
        }
    }

     function selectOptions(target, select) {
        if (select === "provinces") {
            setProvincesId(target.getAttribute('value'));
        }else if (select === "city_id") {
            setAddressData({
                ...data,
                'city_id': target.getAttribute('value')
            })
        }
    }

    return (

        orderInfo &&
        <MainLayout logo={true}>
            <div className="page-section">
                <section>
                    <div className="mt-10 pt-1 font-bold size-16 fanum">
                        شماره سفارش: {orderInfo.code}
                    </div>
                    <div className="flex flex-col items-center mt-5">
                        {orderInfo.products && orderInfo.products.length > 0 &&
                            orderInfo.products.map((product) => (
                                <div className="order-item-container mt-2 flex">
                                    <div className="order-item-discount flex flex-col items-center justify-center white font-bold fanum">
                                        <div className="size-11" style={{lineHeight: "0.7"}}>{product.discount || '10%'}</div>
                                        <div className="size-7">تخفیف</div>
                                    </div>
                                    <div className="order-item-image-container ml-5">

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
                    </div>
                </section>
                <div className="mt-8 pt-1 divider mb-8 pb-1"></div>
                {address ?
                    <>
                        <section>
                            <div className="flex justify-between size-12">
                                <div className="font-bold dark-gray">تاریخ ارسال</div>
                                <div className="font-regular fanum">{orderInfo.shipment.committed_date}</div>
                            </div>
                            <div className="flex justify-between size-12 mt-5">
                                <div className="font-bold dark-gray">روش ارسال</div>
                                <div className="font-regular fanum">{orderInfo.shipment.type}</div>
                            </div>
                            <div className="flex justify-between size-12 mt-5">
                                <div className="font-bold dark-gray">هزینه ارسال</div>
                                <div className="font-regular fanum">{numberWithCommas(orderInfo.shipment.price)} تومان</div>
                            </div>
                        </section>
                        <div className="mt-8 pt-1 divider mb-8 pb-1"></div>
                        <section>
                        <div className="font-bold size-12 dark-gray">ارسال به</div>
                        <div className='mt-2 font-light size-12 dark-gray'>{address.province}، {address.city}، {address.address}. 
                            {address.post_code &&
                                <span> کد پستی: {address.post_code}</span>
                            }
                            <br />
                            <span>{`${address.first_name} ${address.last_name} `}</span>
                        </div>
                        <div className="text-left">
                            <Link href='/userAddresses' passHref>
                                <a 
                                    onClick={()=>{
                                        ls.set('addrSelectFor',data.oId)
                                        ls.set("orderAddrId",address.id)
                                        ls.set('fromOrders', true)

                                    }}
                                    className='text-atrcheeBlue size-10'
                                >
                                    <span> ویرایش نشانی</span>
                                    <i className='fa fa-chevron-left mr-4'/>
                                </a>
                            </Link>
                        </div>
                        {(!address.post_code && orderInfo.shipment.type === "پست پیشتاز") && (
                            <div className="mt-8">
                                <Input 
                                    placeholder="کد پستی" 
                                    type="number"
                                    value={orderInfo.customer.post_code || ''}
                                    name='post_code'
                                    onChange={onChangeAddress}
                                    innerLabel={true}
                                    className="font-regular fanum"
                                />
                            </div>
                        )}
                        <div className="mt-6 line-divider" />
                        </section>
                        </> :orderInfo.customer?
                        <>
                        <section>
                            <div className="flex justify-between size-12">
                                <div className="font-bold dark-gray">تاریخ ارسال</div>
                                <div className="font-regular fanum">{orderInfo.shipment.committed_date}</div>
                            </div>
                            <div className="flex justify-between size-12 mt-5">
                                <div className="font-bold dark-gray">روش ارسال</div>
                                <div className="font-regular fanum">{orderInfo.shipment.type}</div>
                            </div>
                            <div className="flex justify-between size-12 mt-5">
                                <div className="font-bold dark-gray">هزینه ارسال</div>
                                <div className="font-regular fanum">{numberWithCommas(orderInfo.shipment.price)} تومان</div>
                            </div>
                        </section>
                        <div className="mt-8 pt-1 divider mb-8 pb-1"></div>
                        <section>
                            <div className="mt-8 pt-1 font-bold size-14">اطلاعات و نشانی گیرنده</div>
                            <div className="mt-8 pt-1">
                                <Input 
                                    placeholder="نام" 
                                    type="text"
                                    value={orderInfo.customer.first_name || ''}
                                    name='first_name'
                                    onChange={onChangeAddress}
                                    innerLabel={true}
                                />
                            </div>
                            <div className="mt-5">
                                <Input 
                                    placeholder="نام خانوادگی" 
                                    type="text"
                                    value={orderInfo.customer.last_name || ''}
                                    name='last_name'
                                    onChange={onChangeAddress}
                                    innerLabel={true}
                                />
                            </div>
                            <div className="mt-5">
                                <Input 
                                    placeholder="شماره موبایل" 
                                    type="number"
                                    value={orderInfo.customer.cellphone || ''}
                                    name='cellphone'
                                    onChange={onChangeAddress}
                                    innerLabel={true}
                                    className="font-regular fanum"
                                />
                            </div>
                            <div className="mt-5">
                                <AutocompleteInput 
                                     id="provinces" 
                                     name="provinces" 
                                     defaultValue={provinces[provincesId]}
                                     placeholder="انتخاب استان مقصد"
                                     data={provinces}
                                     selectOptions={selectOptions}
                                />
                            </div>
                            <div className="mt-5">
                                {citiesLoading ? <Loading loading={citiesLoading} color="#62666d" /> : (
                                    <AutocompleteInput
                                        id="city"
                                        name="city_id" 
                                        defaultValue={cities[addressData.city_id]}
                                        placeholder="انتخاب شهر مقصد"
                                        data={cities}
                                        selectOptions={selectOptions}
                                    />
                                )}
                            </div>
                            <div className="mt-8">
                                <Textarea
                                    placeholder="آدرس پستی خود را به طور کامل وارد نمایید"
                                    name='address'
                                    onChange={onChangeAddress}
                                    innerLabel="نشانی"
                                />
                            </div>
                            {orderInfo.shipment.type === "پست پیشتاز" && (
                                <div className="mt-8">
                                    <Input 
                                        placeholder="کد پستی" 
                                        type="number"
                                        value={orderInfo.customer.post_code || ''}
                                        name='post_code'
                                        onChange={onChangeAddress}
                                        innerLabel={true}
                                        className="font-regular fanum"
                                    />
                                </div>
                            )}
                        </section>
                        </>:
                        ''
                }
                
                <div className="mt-8">
                    <Textarea
                        placeholder="اگر نکته یا توضیحی برای سفارش دارید اینجا یادداشت کنید"
                        name='customer_description'
                        onChange={onChange}
                        innerLabel="یادداشت سفارش (اختیاری)"
                    />
                </div>
                <div className="mt-8 pt-1 pb-32">
                    <form onSubmit={address ? goToPayment : addAddress}>
                        <Button loading={loading} text="ادامه و پرداخت" />
                    </form>
                </div>
            </div>
        </MainLayout>


    )
}

export default Orders
