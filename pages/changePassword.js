import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import Api from "./api/v1/Api";
import Router from "next/router";
import Link from "next/link";
import {showNotification} from "../components/ErrorHandling";
import ls from 'local-storage'
import Input from '../components/Input';
import Button from '../components/Button';

function ChangePassword() {

    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const api = new Api()
    const user = ls.get('user')

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

    const validate = values => {
        const errors = {};
        if (user && user.has_password) {
            if (!values.old_password) {
                errors.old_password = 'رمز فعلی خود را وارد نمایید';
            } else if (values.old_password.length < 6) {
                errors.old_password = 'رمز باید حداقل 6 کاراکتر باشد';
            }
        }
        if (!values.password) {
            errors.password = 'رمز عبور جدید خود را وارد نمایید';
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

    function changePassword() {
        setLoading(true)
        api.EditProfile(formValues).then((response) => {
            if (response) {
                Object.assign(user, {has_password: true})
                ls.set("user", user)
                Router.push('/userPersonalInfo')
                setLoading(false)
            }
        }).catch((err) => {
            if (err) {
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    return (
        <MainLayout>
            <section className="page-section mt-8 pt-1">
                <Link href="/profile" passHref>
                    <a className="dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span className="size-16 font-bold">ویرایش رمز عبور</span>
                    </a>
                </Link>
                <div className="mt-8 divider"></div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mt-5">
                        <label className='dark-gray size-12 font-regular fanum'>
                            رمز عبور حداقل باید 6 حرف باشد.
                        </label>
                        {
                            user && user.has_password &&
                            <div className="mt-3">
                                <Input
                                    id="oldPassword"
                                    name="old_password"
                                    type="password"
                                    placeholder="رمز عبور فعلی"
                                    value={formValues.old_password}
                                    onChange={handleChange}
                                    error={formErrors.old_password}
                                />
                            </div>
                        }
                        <div className="mt-5">
                            <Input
                                id="newPassword"
                                name="password"
                                type="password"
                                placeholder="رمز عبور جدید"
                                value={formValues.password}
                                onChange={handleChange}
                                error={formErrors.password}
                            />
                        </div>
                        <div className="mt-5">
                            <Input
                                id="confirmPassword"
                                name="password_confirmation"
                                type="password"
                                placeholder="تکرار رمز عبور جدید"
                                value={formValues.password_confirmation}
                                onChange={handleChange}
                                error={formErrors.password_confirmation}
                            />
                        </div>
                    </div>
                    <div className="mt-8">
                        <Button
                            loading={loading}
                            text="ثبت"
                        />
                    </div>
                </form>
            </section>
        </MainLayout>
    )
}

export default ChangePassword