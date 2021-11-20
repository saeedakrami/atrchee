import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/mainlayout";
import ls from "local-storage";
import {useRouter} from "next/router";
import Api from "./api/v1/Api";
import Link from "next/link";
import Router from 'next/router'
import {showNotification} from "../components/ErrorHandling";
import Loading from "../components/Loading";
import Input from '../components/Input';
import Button from '../components/Button';

function EditPersonalUser() {

    const [validation, setValidate] = useState(undefined);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [newCellphone, setNewCellphone] = useState({});
    const [form, setForm] = useState(undefined);
    const [title, setTitle] = useState({});

    const api = new Api()
    const router = useRouter()
    let name = router.query.name
    const user = ls.get('user')


    useEffect(()=>{
        setLoading(true)
    },[])

    useEffect(()=>{
        loadForm();
        loadTitle();
    },[name,data])

    useEffect(()=>{
        if(form){
            setTimeout(()=>{
                setLoading(false)
            },1000)
        }

    },[form])

    function onChange(e) {
            setData({
                ...data,
                [e.target.name]: e.target.value
            })
    }

    function editInfo(e) {
        setLoading(true)
        e.preventDefault();
        api.EditProfile(data).then((response) => {
            if (response) {
                Object.assign(user, data)
                ls.set("user", user)
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


    function MobileValidation (e) {
        let value = e.target.value
        if (value) {
            const patternMobile = /^(\+98|0)?9\d{9}$/;
            const resExpMobile = new RegExp(patternMobile, 'g');
            if (resExpMobile.test(value)) {
                onChange(e)
                setNewCellphone(value)
                setValidate(true)
            } else {
                setValidate(false)
                setMessage('شماره تلفن وارد شده صحیح نمی باشد.')
            }
        }
    }

    function changeCellphone() {
        Router.push({
            pathname: "/confirmNewCellphone",
            query: {otpType: 'CHANGE_CELLPHONE', newCellphone: newCellphone}
        })
    }

    function loadTitle() {
        switch (name) {
            case 'identity_number':
                return setTitle({title: "کد ملی", buttonText: "ثبت اطلاعات", onClick: editInfo});
            case 'cellphone' :
                return setTitle({title: "شماره موبایل", buttonText: "ارسال کد تأیید", onClick: changeCellphone});
            case 'email' :
                return setTitle({title: "ایمیل", buttonText: "ثبت ایمیل", onClick: editInfo});
            case 'card_number' :
                return setTitle({title: "شماره کارت", buttonText: "ثبت شماره کارت", onClick: editInfo});
            default: return title;
        }
    }

    const cardNumberInput = (e) => {
        let id= e.target.id;
        let value = e.target.value;
        let nextId = id.substring(0,id.length-1) + (parseInt(id.charAt(id.length-1)) + 1);
        let nextElem = document.getElementById(nextId);
        let cardNumberIsComplete = false;
        let cardNumber=[];
        if (value.length === 4) {
            document.getElementById(id).value = value.substring(0,4);
            if(nextElem) {
                nextElem.focus();
            } else {
                document.querySelector('button').focus();
                for (let i=1;i<5;i++) {
                    if (document.getElementById('cardNumber' + i).value.length === 4) {
                        cardNumberIsComplete = true;
                        cardNumber.push(document.getElementById('cardNumber' + i).value);
                    } else {
                        cardNumberIsComplete = false;
                        cardNumber.push(null)
                    }
                }
                if (cardNumberIsComplete) {
                    setData({
                        ...data,
                        'card_number': cardNumber.join('')
                    })
                }
            }
        }
    }

    const cardNumberBackspaceClick = (e) => {
        let id= e.target.id;
        let value = e.target.value;
        let prevId = id.substring(0,id.length-1) + (parseInt(id.charAt(id.length-1)) - 1);
        let prevElem = document.getElementById(prevId);
        if (e.keyCode === 8) {
            if (value.length === 0 && prevElem) {
                prevElem.focus();
            }
        }
    }

    function loadForm () {
        switch (name) {
            case 'identity_number':
                return setForm(
                    <div className= "mt-10">
                        <Input 
                            className="font-regular fanum"
                            id="identityNumber"
                            name="identity_number"
                            type="number"
                            value={user.identity_number}
                            placeholder="کد ملی"
                            onChange={onChange}
                            error={validation === false}
                        />
                    </div>)
            case 'cellphone' :
                return setForm(
                    <div className="md:flex mt-6 pt-1">
                        <Input 
                            className="font-regular fanum"
                            id="cellphone"
                            name="cellphone"
                            type="number"
                            value={user.cellphone}
                            placeholder="شماره موبایل"
                            onChange={MobileValidation}
                            error={validation === false}
                        />
                    </div>)
            case 'email' :
                return setForm(
                    <div className="md:flex mt-6 pt-1">
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            value={user.email}
                            placeholder="ایمیل"
                            onChange={onChange}
                            error={validation === false}
                        />
                    </div>)
            case 'card_number' :
                return setForm(
                <div>
                    <div className="mt-6 pt-1">
                        <span className="size-12 dark-gray">
                        جهت مرجوعی وجه خرید، باید شماره کارت حساب بانکی متعلق به خود را وارد نمایید.
                        </span>
                    </div>
                    <div className="mt-4">
                        <div className={`select-container rounded-md flex card-number-container ${validation === false ? 'select-container-error': ''}`}>
                            <input 
                                className="text-center rounded-md font-regular fanum" 
                                id="cardNumber1"
                                name="card_number"
                                type="number"
                                onInput={cardNumberInput}
                                onKeyDown={cardNumberBackspaceClick}
                                defaultValue={user.card_number && parseInt(user.card_number.substring(0,4))}
                            />
                            <div>
                                <span className="size-18 dark-gray">_</span>
                            </div>
                            <input 
                                className="text-center rounded-md font-regular fanum" 
                                id="cardNumber2"
                                name="card_number"
                                type="number"
                                onInput={cardNumberInput}
                                onKeyDown={cardNumberBackspaceClick}
                                defaultValue={user.card_number && parseInt(user.card_number.substring(4,8))}
                            />
                            <div>
                                <span className="size-18 dark-gray">_</span>
                            </div>
                            <input 
                                className="text-center rounded-md font-regular fanum" 
                                id="cardNumber3"
                                name="card_number"
                                type="number"
                                onInput={cardNumberInput}
                                onKeyDown={cardNumberBackspaceClick}
                                defaultValue={user.card_number && parseInt(user.card_number.substring(8,12))}
                            />
                            <div>
                                <span className="size-18 dark-gray">_</span>
                            </div>
                            <input 
                                className="text-center rounded-md font-regular fanum" 
                                id="cardNumber4"
                                name="card_number"
                                type="number"
                                onInput={cardNumberInput}
                                onKeyDown={cardNumberBackspaceClick}
                                defaultValue={user.card_number && parseInt(user.card_number.substring(12,16))}
                            />
                        </div>
                    </div>
                </div>)
            case 'password' :

               return  Router.push('/changePassword')
            default:
                return form
        }
        return form
    }

    return (
        <MainLayout>
            <section className="page-section mt-8 pt-1">
                <Link href="/profile" passHref>
                    <a className="dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span className="size-16 font-bold">{title.title}</span>
                    </a>
                </Link>
                <div className="mt-8 divider"></div>
                <form onSubmit={title.onClick}>
                    {loading ?
                        <Loading loading={loading} color={'#861E3F'} size={'30'}/> :
                        form
                    }
                    <div className="mt-8">
                        <Button
                            loading={loading}
                            text={title.buttonText}
                        />
                    </div>
                </form>
            </section>
        </MainLayout>

    )
}

export default EditPersonalUser