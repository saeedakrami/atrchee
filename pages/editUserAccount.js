import React, {useEffect, useState} from "react";
import ls from 'local-storage'
import Api from "./api/v1/Api";
import Router from "next/router";
import {showNotification} from "../components/ErrorHandling";
import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

function editUserAccount(){
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState({})

    const api = new Api()
    let user=ls.get('user')

    useEffect(()=>{
        setData({
            first_name:user.first_name,
            last_name:user.last_name,
            gender:user.gender
        })
    },[])

    function onChange(e){
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    function editAccountInfo(e){
        setLoading(true)
        e.preventDefault();
        if (data.first_name === "" && data.last_name === "") {
            setLoading(false);
            setError({first_name: "نام نمی تواند خالی باشد.", last_name: "نام خانوادگی نمی تواند خالی باشد."});
        }
        else if (data.first_name === "") {
            setLoading(false);
            setError({first_name: "نام نمی تواند خالی باشد."});
        }
        else if(data.last_name === "") {
            setLoading(false);
            setError({last_name: "نام خانوادگی نمی تواند خالی باشد."});
        }
        else if (data.first_name !== "" && data.last_name !== "") {
            api.EditProfile(data).then((response) => {
                if (response) {
                    Object.assign(user, data)
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
    }
    return(
        user &&
        <MainLayout>
            <section className="page-section mt-8 pt-1">
                <Link href="/profile" passHref>
                    <a className="dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span className="size-16 font-bold">نام و نام خانوادگی</span>
                    </a>
                </Link>
                <div className="mt-8 divider"></div>
                <form className='gray-title' onSubmit={editAccountInfo}>
                    <div className="mt-6">
                        <Select 
                            value={user.gender}
                            name="gender"
                            id="gender"
                            label="جنسیت"
                            onChange={onChange}
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
                            defaultValue={user.first_name}
                            type="text"
                            placeholder="نام"
                            onChange={onChange}
                            error={error.first_name}
                            innerLabel={true}
                        />
                    </div>
                    <div className="mt-5">
                        <Input
                            id="last_name"
                            name="last_name"
                            type="text"
                            defaultValue={user.last_name}
                            placeholder="نام خانوادگی"
                            onChange={onChange}
                            error={error.last_name}
                            innerLabel={true}
                        />
                    </div>
                    <div className="mt-8">
                        <Button loading={loading} text="ثبت اطلاعات" />
                    </div>
                </form>
            </section>
        </MainLayout>
    )
}
export default editUserAccount