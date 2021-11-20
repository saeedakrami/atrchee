import React, {useState, useEffect} from 'react';
import MainLayout from "../layouts/mainlayout";
import Api from './api/v1/Api'
import CountDownTimer from "../components/CountDownTimer";
import {useRouter} from "next/router";
import Router from 'next/router'
import {showNotification} from "../components/ErrorHandling";
import Loading from "../components/Loading";
import ls from "local-storage";

function ConfirmNewCellphone() {
    const router = useRouter()
    const [validation, setValidate] = useState(undefined);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [OTP, setOTP] = useState('');
    const api = new Api()

    const otpType = router.query.otpType
    const cellphone = router.query.newCellphone
    const [activeTimer, setActiveTimer] = useState(true);
    const user = ls.get('user')
    const params = {
        cellphone: cellphone,
        reason: otpType
    }

    useEffect(()=>{
        if(activeTimer===true) {
            sendOTP()
        }
    },[activeTimer])

    function sendOTP() {

        api.sendOtpForChangeMobile(params).then((response) => {
           if(response){
           }
        }).catch((err) => {
            if(err){
                showNotification(err.response?.data?.user_message)
            }

        })
    }

    useEffect(() => {
        setTimeout(() => setActiveTimer(false),
            120000)
    }, []);


    function editInfo(e) {
        setLoading(true)
        e.preventDefault();
        let params={
            cellphone:cellphone,
            otp:OTP
        }
        api.EditProfile(params).then((response) => {
            if (response) {
                Object.assign(user, params)
                ls.set("user", user)
                Router.push('/userPersonalInfo')
                setLoading(false)
            }
        }).catch((err) => {
            if(err){
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }


    function onChange(e) {
        if (e.target.value) {
            setOTP(e.target.value)
            setValidate(true)
        } else {
            setValidate(false)
            setMessage('کد را وارد نمایید')
        }
    }

    function getTestOTP() {
        api.getOtpCode(cellphone, {}).then((response) => {
            setOTP(response.data.otp)
        }).catch((err) => {
            if (err) {
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    return (
        <MainLayout>
            <section className="login-section flex px-3">
                <figcaption className="md:w-full font-medium">
                    <figure className="m-auto">
                        <div className="space-y-4">
                            <blockquote>
                                <h1 className="text-base font-irsans p-4 pb-3 text-atrcheeBlack font-semibold">
                                    تایید شماره موبایل
                                </h1>
                            </blockquote>
                        </div>
                    </figure>
                    <div className="text-atrcheeGray">
                        <form className='flex'>
                            <div className="bg-white flex flex-col px-5">
                                <div className="-mx-3 md:flex mb-2">
                                    <div className="md:w-full px-3">
                                        <label
                                            className="text-atrcheeGray text-xs mb-4"
                                            form="mobile">
                                            کد تایید ارسال شده به شماره<b className='m-1'>{cellphone}</b>را وارد نمایید:
                                        </label>
                                        <input
                                            className="w-full bg-white-200 h-39 text-black border border-atrcheeLightGray text-sm rounded-md px-3 py-2 mt-5 focus:border-0"
                                            id="mobile"
                                            type="number"
                                            placeholder="09355257020"
                                            onChange={onChange}
                                            style={validation === false ? {borderColor: 'red'} : null}
                                        />
                                        {
                                            validation === false && message !== undefined &&
                                            <div
                                                className='text-atrcheeRed w-full text-red-500 text-xs'>{message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="-mx-3 md:flex my-2">
                                    <div className="md:w-full px-3 text-center">
                                        {
                                            activeTimer ?
                                                <label className='text-xs'>ارسال کد تا<CountDownTimer/>دیگر</label>
                                                :
                                                <a href='#'>
                                                    <span  className='text-xs' onClick={()=>setActiveTimer(true)}>ارسال مجدد کد یکبار مصرف</span>
                                                </a>
                                        }
                                    </div>
                                </div>
                                <div className="-mx-3 md:flex ">
                                    <div className="md:w-full px-3 my-1 text-center">
                                        <button
                                            type={'button'}
                                            onClick={getTestOTP}
                                            className="md:w-full text-atrcheeViolet text-xs"
                                        >
                                            دریافت کد یکبار مصرف
                                        </button>
                                    </div>
                                </div>
                                <div className="-mx-3 md:flex my-2">
                                    <div className="md:w-full px-3">
                                        <button
                                            type={"submit"}
                                            className="md:w-full bg-atrcheeViolet text-white h-41 font-bold py-2 px-4 rounded-md mt-2"
                                            onClick={editInfo}
                                            children= {loading ? <Loading loading={loading}/> :'تایید'}
                                        />
                                    </div>
                                </div>


                            </div>
                        </form>
                    </div>
                </figcaption>
            </section>
        </MainLayout>

    )
}

export default ConfirmNewCellphone
