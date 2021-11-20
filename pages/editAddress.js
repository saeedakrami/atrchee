import React, {useEffect, useState} from 'react'
import MainLayout from "../layouts/mainlayout";
import {useRouter} from "next/router";
import Api from "./api/v1/Api";
import {provinces} from "../etc/city";
import Link from "next/link";
import ls from 'local-storage'
import Router from 'next/router'
import {showNotification} from "../components/ErrorHandling";
import Textarea from '../components/Textarea';
import Input from '../components/Input';
import Button from '../components/Button';
import AutocompleteInput from '../components/AutocompleteInput';
import Loading from '../components/Loading';

function editAddress() {

    const [cities, setCities] = useState([]);
    const [address, setAddress] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [provincesId, setProvincesId] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [recipientMyself, setRecipientMyself] = useState(false);
    const [isNewAddr, setIsNewAddr] = useState(true);
    const [citiesLoading, setCitiesLoading] = useState(false);


    const router = useRouter()

    const api = new Api()
    const user = ls.get('user')
    const addressId = router.query.addressId

    let fromOrders = ls.get('fromOrders');
    
    setTimeout(() => {
        setIsNewAddr(!addressId)
    }, 20); 
    


    useEffect(()=>{
        setData({
            first_name: address.first_name,
            last_name: address.last_name ,
            cellphone: address.cellphone,
            city_id: address.city_id,
            post_code: address.post_code,
            address: address.address,
            description:address.description,
        })
        setProvincesId(address.province_id)
        setCity(address.city)
    },[address])

    useEffect(()=>{
        if(addressId){
            api.getAddress(addressId,{}).then((response)=>{
                if(response){
                    setAddress(response.data)
                }
            }).catch((err)=>{
                if(err){
                    showNotification(err.response?.data?.user_message)
                }
            })
        }
    },[addressId])

    useEffect(() => {
        if(provincesId){
            loadCitiesOfProvinces()
        }
    }, [provincesId])

    useEffect(() => {
        if (user && recipientMyself) {
            setData({
                ...data,
                first_name: user.first_name,
                last_name: user.last_name,
                cellphone: user.cellphone,
            })
        }
    }, [recipientMyself])

    function onChange(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    function editUserAddress(e) {
        setLoading(true)
        e.preventDefault();

        let promiss 
        if (isNewAddr)
            promiss = api.storeAddress({...data,is_default:false})
        else
            promiss = api.editAddress(address.id, {...data,is_default:false})

        promiss.then((response) => {
            if (response) {
                if(fromOrders) {
                    let oId = ls.get('addrSelectFor');
                    if (oId) {
                        Router.push({
                            pathname: '/orders',
                            query: { id: oId }
                        })
                    }
                } else {
                    Router.push('/userAddresses')
                } 
                setLoading(false)
            }
        }).catch((err) => {
            if(err){
                setLoading(false)
                showNotification(err.response?.data?.user_message )
            }
        })
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

    function selectOptions(target, select) {
        if (select === "provinces") {
            setProvincesId(target.getAttribute('value'));
            setData({
                ...data,
                'city_id': ""
            })
        }else if (select === "city_id") {
            setData({
                ...data,
                'city_id': target.getAttribute('value')
            })
        }
    }

    return (
        <MainLayout>
            <section className="page-section mt-8 pt-1 pb-32">
                <Link href="/userAddresses" passHref>
                    <a className="size-16 font-bold dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span>{isNewAddr ? "جزییات آدرس": "ویرایش نشانی"}</span>
                    </a>
                </Link>
                <div className="mt-8 divider"></div>
                <form onSubmit={editUserAddress} autoComplete="off">
                    <div className="mt-6">
                        <label htmlFor="provinces" className="size-10 font-medium gray">استان</label>
                        <AutocompleteInput
                            id="provinces" 
                            name="provinces" 
                            defaultValue={provinces[provincesId]}
                            data={provinces}
                            selectOptions={selectOptions}
                        />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="provinces" className="size-10 font-medium gray">شهر</label>
                        {citiesLoading ? <Loading loading={citiesLoading} color="#62666d" /> : (
                            <AutocompleteInput
                                id="city"
                                name="city_id" 
                                defaultValue={cities[data.city_id]}
                                data={cities}
                                selectOptions={selectOptions}
                            />
                        )}
                    </div>
                    <div className="mt-6">
                        <Textarea 
                            innerLabel="نشانی"
                            placeholder="آدرس پستی خود را به طور کامل وارد کنید"
                            name="address"
                            id="address"
                            value={address.address}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mt-6">
                        <Input 
                            className="font-regular fanum"
                            type="number"
                            placeholder="کدپستی"
                            innerLabel={true}
                            name="post_code"
                            id="postalCode"
                            defaultValue={address.post_code}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mt-6 pt-1 line-divider"></div>
                    <div className="mt-8 flex">
                        <input
                            id='hasPostCode'
                            className="input-checkbox"
                            type="checkbox"
                            onChange={() => setRecipientMyself(!recipientMyself)}
                            checked={recipientMyself}
                        />
                        <label htmlFor="hasPostCode" className="mr-1 size-12 dark-gray">گیرنده سفارش خودم
                            هستم</label>
                    </div>
                    <div className="mt-8">
                        <Input 
                            type="text"
                            innerLabel={true}
                            name="first_name"
                            placeholder='نام گیرنده'
                            id="firstNameCode"
                            defaultValue={recipientMyself ? user && user.first_name : address.first_name}
                            // value={recipientMyself ? (user && user.first_name) : address.first_name}
                            onChange={onChange}
                            disabled={recipientMyself}
                        />
                    </div>
                    <div className="mt-5">
                        <Input 
                            type="text"
                            innerLabel={true}
                            name="last_name"
                            placeholder='نام خانوادگی گیرنده'
                            id="lastNameCode"
                            defaultValue={recipientMyself ? user && user.last_name : address.last_name}
                            onChange={onChange}
                            disabled={recipientMyself}
                        />
                    </div>
                    <div className="mt-5">
                        <Input 
                            className="font-regular fanum"
                            type="text"
                            innerLabel={true}
                            name="cellphone"
                            placeholder='شماره موبایل'
                            id="cellphone"
                            defaultValue={recipientMyself ? user && user.cellphone : address.cellphone}
                            onChange={onChange}
                            disabled={recipientMyself}
                        />
                    </div>
                    <div className="mt-8">
                        <Button 
                            loading={loading}
                            text={isNewAddr ? 'ثبت آدرس'
                            : 'ویرایش آدرس'}
                        />
                    </div>
                </form>
            </section>
        </MainLayout>

    )
}

export default editAddress