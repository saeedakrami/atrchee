import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import Api from './api/v1/Api';
import Router from 'next/router'
import ls from 'local-storage'
import {showNotification} from "../components/ErrorHandling";
import Input from '../components/Input';
import Link from 'next/link';
import Button from '../components/Button';

function Login() {
    const intialValues = {mobile: ""};
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            userExist();
        }
    }, [formErrors]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const inputClear = (name) => {
        setFormValues({...formValues, [name]: ""});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
    };

    const validate = (values) => {
        let errors = {};
        const regex = /^(\+98|0)?9\d{9}$/i;
        if (!values.mobile) {
            errors.mobile = "لطفا شماره موبایل خود را وارد کنید";
        } else if (!regex.test(values.mobile)) {
            errors.mobile = "شماره موبایل وارد شده صحیح نمی باشد";
        }
        return errors;
    }

    const userExist = () => {
        setLoading(true)
        ls.set('mobile', formValues.mobile)
        const api = new Api();
        api.userExistence(formValues.mobile, {})
            .then((response) => {

                if (response.data.does_customer_exist === true) {
                    if (response.data.is_customer_data_completed === true) {
                        Router.push({
                            pathname:'/loginWithOTP',
                            query: {otpType: 'LOGIN_WITH_NO_PASS'}
                        })
                        setLoading(false)
                    } else {
                        Router.push({
                            pathname:'/loginWithOTP',
                            query: {otpType: 'data_not_completed'}
                        }) //
                        setLoading(false)
                    }

                } else {
                    Router.push({
                        pathname: '/loginWithOTP',
                        query: {otpType: 'FIRST_TIME_LOGIN'}
                    }, "loginWithOTP")
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (err) {
                    setLoading(false)
                    showNotification(err.response?.data?.user_message)
                }
            });
    }

    return (
        <MainLayout>
            <section className="page-section pt-2">
                    <Link href={'/login'}>
                        <a className="block mx-auto atrchee-logo h-100 mt-16" />
                    </Link>
                    <div className="mt-8 font-bold size-16">
                        ورود / ثبت‌نام در عطرچی
                    </div>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mt-6 pt-1">
                            <label
                                className="size-12 dark-gray"
                                htmlFor="mobile">
                                شماره‌ی تلفن همراه خود را وارد نمایید
                            </label>
                        </div>
                        <div className="mt-3">
                            <Input 
                                id="mobile"
                                name="mobile"
                                value={formValues.mobile}
                                type="number"
                                placeholder=""
                                className="login-input"
                                onChange={handleChange}
                                error={formErrors.mobile}
                                innerLabel={false}
                                clearIconClick={inputClear}
                            />
                        </div>
                        <div className="mt-8">
                            <Button
                                text="ورود"
                                loading={loading}
                            />
                        </div>
                    </form>
            </section>
        </MainLayout>

    )
}

export default Login
