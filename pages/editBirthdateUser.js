import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Api from "./api/v1/Api";
import Router from "next/router";
import ls from "local-storage";
import {showNotification} from "../components/ErrorHandling";
import Button from '../components/Button';
import moment from 'moment-jalaali';
import ScrollPicker from '../components/ScrollPicker';

function EditBirthdateUser(){
    const [data, setData] = useState({});
    const [birthdayDate, setBirthdayDate] = useState({});
    const [loading, setLoading] = useState(false);
    const [changeModal, setChangeModal] = useState(false);
    const [oldBirthdayDate, setOldBirthdayDate] = useState({});

    const api = new Api()
    const user = ls.get('user');
    let days=[];
    if(parseInt(birthdayDate.month)<7) days = setOptions(1,31,true);
    else if(parseInt(birthdayDate.month)<12) days = setOptions(1,30,true);
    else {
        if(moment.jIsLeapYear(birthdayDate.year)) days = setOptions(1,30,true);
        else days = setOptions(1,29,true);
    }
    const weekDays=['یکشنبه','دوشنبه','سه شنبه','چهارشنبه','پنج شنبه','جمعه','شنبه'];

    const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

    const years = setOptions(1300,moment().jYear(),false);

    function setOptions(start,end,addZero) {
        let options = [];
        for (let i=start; i<=end; i++) {
            if(addZero && i<10) i = "0" + i; 
            options.push(i.toString())
        }
        return options;
    }

    useEffect(()=>{
        if (user.birth_date) {
            splitBirthday()
        }
    },[])

    useEffect(()=>{
        mergeBirthday()
    },[birthdayDate])

    function splitBirthday() {
        if(user.birth_date){
            const [year, month, day] = user.birth_date.split('/')
            setBirthdayDate({year, month, day});
            setOldBirthdayDate({year, month, day});
        }
    }

    function editInfo(e) {
        setLoading(true)
        e.preventDefault();
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

    function mergeBirthday(){
        let date = `${birthdayDate.year}/${birthdayDate.month}/${birthdayDate.day}`
        setData({
            birth_date: date
        })
    }

    function birthDateChange(name, value) {
        if (name === "month") value = addZero((months.indexOf(value) + 1).toString());
        setBirthdayDate({
            ...birthdayDate,    
            [name]: value,
        })
    }

    function changeBirthDateCancel() {
        setBirthdayDate({
            year: oldBirthdayDate.year,
            month: oldBirthdayDate.month,
            day: oldBirthdayDate.day
        })
        hideModal();
    }

    function changeBirthDateSubmit() {
        setOldBirthdayDate({
            year: birthdayDate.year,
            month: birthdayDate.month,
            day: birthdayDate.day,
        })
        hideModal();
    }

    function addZero(number) {
        if (number && number.length < 2) {
            return `0${number}`
        }
        return number
    }

    function selectedDate() {
        let year = birthdayDate.year || moment().jYear().toString();
        let month = parseInt(birthdayDate.month)-1 || moment().jMonth();
        let day = birthdayDate.day || moment().jDate().toString();
        let d = moment(year + "/"+ parseInt(month+1) +"/"+day, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
        let date = weekDays[new Date(d).getDay()] + ' ' + day + ' ' + months[month] + ' ' + year;
        return date; 
    }

    function showModal() {
        setChangeModal(true);
        document.querySelector('body').classList.add('modal-open');
    }

    function hideModal() {
        setChangeModal(false);
        document.querySelector('body').classList.remove('modal-open');
    }

    return(
        <MainLayout>
            <section className="page-section mt-8 pt-1">
                <Link href="/profile" passHref>
                    <a className="dark-gray">
                        <span className="fa fa-arrow-right back-arrow-big" />
                        <span className="size-16 font-bold">تاریخ تولد</span>
                    </a>
                </Link>
                <div className="mt-8 divider" />
                <form className='' onSubmit={editInfo}>
                    <div className="mt-8">
                        <div id="time_select" onClick={showModal} className="payment-card-select dark-gray flex justify-center">
                            <div className="font-regular fanum size-18">
                                {(birthdayDate.year && birthdayDate.month && birthdayDate.day) ? birthdayDate.day + " / " + birthdayDate.month + " / " +  birthdayDate.year: "انتخاب روز / ماه / سال"}
                                <span className="far fa-calendar-alt mr-2 size-16" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Button 
                            loading={loading}
                            text="ثبت تاریخ تولد"
                        />
                    </div>
                </form>
                {changeModal && (
                        <>
                        <div className="change-date-modal-container" onClick={changeBirthDateCancel} />
                        <div className="change-date-modal">
                            <div className="text-center font-medium fanum size-14 text-atrcheeBlue mt-2">
                                {selectedDate()}
                            </div>
                            <div className="flex items-center flex-col">
                                <div className="flex justify-between items-center mt-3" style={{maxWidth: "480px", width: "100%"}}>
                                    <div className="scroll-select-container dark-gray size-14 font-regular fanum text-center noselect">
                                        <ScrollPicker 
                                            optionGroups={days}
                                            valueGroups={birthdayDate.day ? birthdayDate.day : addZero(moment().jDate().toString())}
                                            onChange={birthDateChange}
                                            height={87}
                                            itemHeight={29}
                                            name="day"
                                        />
                                    </div>
                                    <div className="scroll-select-container dark-gray size-14 font-regular fanum text-center noselect">
                                        <ScrollPicker 
                                            optionGroups={months}
                                            valueGroups={birthdayDate.month ? months[parseInt(birthdayDate.month)-1] : months[moment().jMonth()]}
                                            onChange={birthDateChange}
                                            height={87}
                                            itemHeight={29}
                                            name="month"
                                        />
                                    </div>
                                    <div className="scroll-select-container dark-gray size-14 font-regular fanum text-center noselect">
                                        <ScrollPicker 
                                            optionGroups={years}
                                            valueGroups={birthdayDate.year ? birthdayDate.year : moment().jYear().toString()}
                                            onChange={birthDateChange}
                                            height={87}
                                            itemHeight={29}
                                            name="year"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 line-divider" />
                            <div className="mt-6 flex justify-end">
                                <div className="time-modal-button-div">
                                    <form onSubmit={changeBirthDateCancel}>
                                        <Button
                                            text="انصراف"
                                            height="28px"
                                            secondaryButton={true}
                                            className="size-14 font-medium"
                                        />
                                    </form>
                                </div>
                                <div className="time-modal-button-div mr-1">
                                    <form onSubmit={changeBirthDateSubmit}>
                                        <Button
                                            text="ثبت زمان"
                                            height="28px"
                                            className="size-14 font-medium white"
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </MainLayout>
    )
}
export default EditBirthdateUser