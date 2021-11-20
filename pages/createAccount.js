import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import Router from 'next/router'
import Api from "./api/v1/Api";
import ls from "local-storage";
import {showNotification} from "../components/ErrorHandling";
import Select from '../components/Select';
import Input from '../components/Input';
import Button from '../components/Button';

function CreateAccount() {
    const intialValues = {first_name: "",last_name:"",gender:""};
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const api = new Api()
    const user = ls.get('user')

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            createProfile();
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
    const validate = values => {
        const errors = {};
        if (!values.first_name) {
            errors.first_name = 'لطفا نام خود را وارد کنید';
        }
        if (!values.last_name) {
            errors.last_name = 'لطفا نام خانوادگی خود را وارد کنید';
        }
        if (!values.gender) {
            errors.gender = 'لطفا جنسیت خود را وارد کنید';
        }
        return errors;

    }

    function createProfile() {
        setLoading(true)
        api.EditProfile(formValues).then((response) => {
            if(response){
                Object.assign(user, formValues)
                ls.set("user", user)
                let redirect = ls.get('atrchee-redirect')
                ls.remove('atrchee-redirect')
                if (redirect) 
                    Router.push(redirect.replace(".html?", "?"))
                else
                    Router.push('/profile')
                setLoading(false)
            }
        }).catch((err) => {
            if(err){
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    return (
        <MainLayout>
            <section className="page-section">
                <div className="mt-16 pt-2 size-16 font-bold">
                    ایجاد حساب کاربری در عطرچی
                </div>
                <form className='' onSubmit={handleSubmit}>
                    <div className="mt-10 pt-1">
                    <Select 
                        value={formValues.gender}
                        name="gender"
                        id="gender"
                        label="جنسیت"
                        error={formErrors.gender}
                        onChange={handleChange}
                        options={[
                            {value: "", text: "جنسیت", hidden: true},
                            {value: "FEMALE", text: "خانم", hidden: false}, 
                            {value: "MALE", text:"آقا", hidden: false}
                        ]}
                    />
                    </div>
                    <div className="mt-5">
                        <Input
                            id="first_name"
                            name="first_name"
                            value={formValues.first_name}
                            type="text"
                            placeholder="نام"
                            onChange={handleChange}
                            error={formErrors.first_name}
                            innerLabel={true}
                        />
                    </div>
                    <div className="mt-5">
                        <Input
                            id="last_name"
                            name="last_name"
                            value={formValues.last_name}
                            type="text"
                            placeholder="نام خانوادگی"
                            onChange={handleChange}
                            error={formErrors.last_name}
                            innerLabel={true}
                        />
                    </div>
                    <div className="mt-8">
                        <Button loading={loading} text="ادامه" />
                    </div>
                </form>
            </section>
        </MainLayout>

    )
}

export default CreateAccount
