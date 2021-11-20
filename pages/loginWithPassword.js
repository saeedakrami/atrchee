import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import Link from 'next/link'
import Api from "./api/v1/Api";
import ls from 'local-storage'
import Router from 'next/router'
import {showNotification} from "../components/ErrorHandling";
import Back from '../components/Back';
import Input from '../components/Input';
import Button from '../components/Button';

function LoginWithPassword() {
    const intialValues = {password: ""};
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mobile = ls.get('mobile')
    const api = new Api();


    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            login();
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
    };

    const validate = (values) => {
        let errors = {};
        if (!values.password) {
            errors.password = "لطفا رمز ورود خود را وارد نمایید";
        }
        return errors;
    }



    const login = () => {
        setLoading(true)
        const params = {
            cellphone: mobile,
            password: formValues.password
        }
        api.loginWithPassword(params)
            .then((response) => {
                if(response.data.customer){
                    ls.set('token', response.data.jwt)
                    ls.set('user', response.data.customer)
                    let redirect = ls.get('atrchee-redirect')
                    ls.remove('atrchee-redirect')
                    if (redirect) {
                        redirect = redirect.replace(".html?", "?");
                        Router.push(redirect)
                    }
                    else
                        Router.push('/userOrders')
                    setLoading(false)
                }
            })
            .catch((err) => {
                if(err){
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
                    رمز عبور را وارد کنید
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mt-6 pt-1 size-12 dark-gray">
                        <label htmlFor="mobile">
                            رمز عبور حساب کاربری خود را وارد کنید
                        </label>
                    </div>
                    <div className="mt-3">
                        <Input
                            className="font-regular size-16 password-input"
                            id="password"
                            name="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleChange}
                            error={formErrors.password}
                        />
                    </div>
                    <div className="mt-8 pt-1">
                        <Link href={{pathname: '/loginWithOTP', query: {otpType: 'LOGIN_WITH_NO_PASS'}}} passHref>
                            <a className='text-atrcheeBlue size-10 font-regular'>
                                <span className=''>ورود از طریق رمز یکبار مصرف</span>
                                <i className='fa fa-chevron-left mr-1'/>
                            </a>
                        </Link>
                    </div>
                    <div className="mt-4">
                        <Link href={{pathname: '/loginWithOTP', query: {otpType: 'PASSWORD_RECOVERY'}}} passHref>
                            <a className='text-atrcheeBlue size-10 font-regular'>
                                <span className=''>بازیابی رمز عبور</span>
                                <i className='fa fa-chevron-left mr-1'/>
                            </a>
                        </Link>
                    </div>
                    <div className="mt-8">
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

export default LoginWithPassword