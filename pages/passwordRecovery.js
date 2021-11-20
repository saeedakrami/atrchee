import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import Api from "./api/v1/Api";
import lg from "local-storage";
import {useRouter} from "next/router";
import {showNotification} from "../components/ErrorHandling";
import Back from '../components/Back';
import Input from '../components/Input';
import Button from '../components/Button';
import Router from 'next/router'

function PasswordRecovery() {

    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter()
    const api = new Api()
    const mobile = lg.get('mobile')
    const OTP = router.query.OTP

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            changePassword();
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

    function changePassword() {
        setLoading(true)

        const params={
            cellphone:mobile,
            otp:OTP,
            ...formValues
        }
        api.passwordRecovery(params)
            .then((response) => {
                if (response) {
                    setLoading(false)
                    Router.push('/profile')
                }
            })
            .catch((err) => {
                if (err) {
                    setLoading(false)
                    showNotification(err.response?.data?.user_message)
                }
            });
    }

    const validate = values => {
        const errors = {};
        if (!values.password) {
            errors.password = 'رمز جدید خود را وارد نمایید';
        } else if (values.password.length < 6) {
            errors.password = 'رمز باید حداقل 6 کاراکتر باشد';
        }
        if (!values.password_confirmation) {
            errors.password_confirmation = 'رمز جدید خود را تکرار نمایید';
        } else if (values.password !== values.password_confirmation) {
            errors.password_confirmation = 'رمز و تکرار رمز با هم یکسان نیستند.';
        }
        return errors;
    }

    const backClick = () => {
        Router.push('/login')
    }


    return (
        <MainLayout>
            <section className="page-section mt-16 pt-2">
                <Back onClick={backClick} />
                <div className="mt-5 font-bold size-16">
                    تغییر رمز عبور
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mt-8 pt-2">
                        <Input
                            className="font-regular size-16"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="رمز عبور جدید"
                            value={formValues.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            innerLabel={true}
                        />
                    </div>
                    <div className="mt-5">
                        <Input
                            className="font-regular size-16"
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            placeholder="تکرار رمز عبور "
                            value={formValues.password_confirmation}
                            onChange={handleChange}
                            error={formErrors.password_confirmation}
                            innerLabel={true}
                        />
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

export default PasswordRecovery