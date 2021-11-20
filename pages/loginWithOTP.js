import React, {useState, useEffect} from 'react';
import MainLayout from "../layouts/mainlayout";
import Link from 'next/link'
import Api from './api/v1/Api'
import ls from "local-storage";
import CountDownTimer from "../components/CountDownTimer";
import {useRouter} from "next/router";
import Router from 'next/router'
import {showNotification} from "../components/ErrorHandling";
import Back from '../components/Back';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginWithOTP = () => {

    const [loading, setLoading] = useState(false);
    const [activeTimer, setActiveTimer] = useState(true);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [OTP, setOTP] = useState('');
    const api = new Api()
    const mobile = ls.get('mobile')
    const router = useRouter()
    const otpType = router.query.otpType

    const hideMobile = mobile && mobile.substring(mobile.length-4, mobile.length) + "***" + mobile.substring(0,mobile.length-7);
    let reason = otpType
    if (otpType === 'data_not_completed'){
        reason = 'LOGIN_WITH_NO_PASS'
    }

    const params = {
        cellphone: mobile,
        reason: reason
    }
    

    useEffect(() => {
        setTimeout(() => setActiveTimer(false), 120000)
    }, []);

    useEffect(()=>{
        if(activeTimer===true){
            sendOTP()
        }
    },[activeTimer])

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            loginOTP();
        }
    }, [formErrors]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
    }

    const validate = values => {
        const errors = {};
        if (!values.otp) {
            errors.otp = 'کد ارسال شده به شماره همراه خود را وارد نمایید';
        }
        return errors;
    }



    function sendOTP() {
        api.sendOtpCode(params).then((response) => {
            console.log({response});
        }).catch((err) => {

            if(err){
                console.log(err)
                showNotification(err.response?.data?.user_message)
            }
        })
    }


    const loginOTP = (e) => {
        setLoading(true)
        console.log(formValues)
        const params = {
            cellphone: mobile,
            otp: formValues.otp
        }

        api.loginWithOtp(params)
            .then((response) => {
                console.log('hello22')
                ls.set('token', response.data.jwt)
                ls.set('user', response.data.customer)
                switch (otpType) {
                    case 'data_not_completed':
                        Router.push({
                            pathname: '/createAccount',
                        })
                        setLoading(false)
                        break;
                    case "LOGIN_WITH_NO_PASS": // رمز یکبار مصرف
                        let redirect = ls.get('atrchee-redirect')
                        ls.remove('atrchee-redirect')
                        if (redirect) {
                            console.log(redirect)
                            Router.push({pathname: redirect})
                        }
                        else
                            Router.push('/userOrders')
                        setLoading(false)
                        break;
                    case "PASSWORD_RECOVERY":
                        Router.push({
                            pathname: '/passwordRecovery',
                            query: {OTP: formValues.otp}
                        })
                        setLoading(false)
                        break;
                    case "FIRST_TIME_LOGIN":
                        Router.push({
                            pathname: '/createAccount',
                        })
                        setLoading(false)
                        break;
                    default:
                        return otpType
                }
            })
            .catch((err) => {
                if(err && err.response){
                    setLoading(false)
                    showNotification(err.response?.data?.user_message)
                }
            });
    }

    const backClick = () => {
        Router.push('/login')
    }

    return (
        <MainLayout>
            <section className="page-section pt-2">
                <Back onClick={backClick} />
                <div className="mt-5 font-bold size-16">
                    ارسال کد یکبار مصرف
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mt-6 pt-1 size-12 dark-gray">
                        <label htmlFor="mobile">
                            کد تایید ارسال شده به شماره <span>({hideMobile})</span> را وارد نمایید
                        </label>
                    </div>
                    <div className="mt-3">
                        <Input
                            className="text-center otp-input"
                            id="mobile"
                            type="number"
                            name="otp"
                            placeholder="-----"
                            value={formValues.otp}
                            onChange={handleChange}
                            error={formErrors.otp}
                        />
                    </div>
                    <div className={`text-center ${reason !== "PASSWORD_RECOVERY" ? "mt-6" : "mt-8 pt-1"}`}>
                        {activeTimer ?
                            <label className='size-10 gray font-medium fanum'>ارسال مجدد کد تا<CountDownTimer/>دیگر</label>
                            :
                            <a href='#'>
                                <span  className='size-10 gray font-medium' onClick={()=>setActiveTimer(true)}>ارسال مجدد کد یکبار مصرف</span>
                            </a>
                        }

                    </div>
                    {reason !== "PASSWORD_RECOVERY" && (
                        <div className="mt-5 text-center">
                            <Link href={'/loginWithPassword'} passHref>
                                <a className='text-atrcheeBlue size-10 font-regular'>
                                    <span>ورود با رمز عبور</span>
                                    <i className='fa fa-chevron-left mr-1 size-8'/>
                                </a>
                            </Link>
                        </div>
                    )}
                    <div className={`pt-1 ${reason !== "PASSWORD_RECOVERY" ? "mt-6" : "mt-8"}`}>
                        <Button
                            text="ادامه"
                            loading={loading}
                        />
                    </div>
                </form>
            </section>
        </MainLayout>

    )
}

export default LoginWithOTP
