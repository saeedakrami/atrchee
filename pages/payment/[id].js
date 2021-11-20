import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../layouts/mainlayout';
import Api from '../api/v1/Api'
import ls from 'local-storage'
import {showNotification} from "../../components/ErrorHandling";
import Back from '../../components/Back';
import Router from 'next/router'
import Button from '../../components/Button';
import {numberWithCommas} from "../../etc/FormatNumber";
import {useStateCallback} from '../../etc/myHooks'
import moment from 'moment-jalaali';
import ScrollPicker from '../../components/ScrollPicker';

function Payment() {
    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState(undefined);
    const [orderInfo, setOrderInfo] = useStateCallback({});
    const [data, setData] = useState({});
    const [address, setAddress] = useState(undefined);
    const [addressId, setAddressId] = useState(undefined);
    const [changeModal, setChangeModal] = useState(false);
    const [dateTime, setDateTime] = useState({});
    const [oldDateTime, setOldDateTime] = useState({});
    const [selectDateArray,setSelectDateArray] = useState([]);

    const router = useRouter()
    const id = router.query.id;

    const token = ls.get('token');
    const api = new Api();

    const jalaliMonth = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    const hours=[];
    const minutes=[];
    for(let i=0;i<24;i++) hours.push(addZero(i.toString()));
    for(let i=0;i<60;i++) minutes.push(addZero(i.toString()));

    useEffect(() => {
        setData({oId:id,...data})

        let m = moment();
        let thisDate = {year: m.jYear(), month: m.jMonth(), day: m.jDate(), hour: 0, minute: 0, second: 0};
        let orderDate = {year: m.jYear(), month: m.jMonth(), day: m.jDate(), hour: 0, minute: 0, second: 0}

        setDateTime({...dateTime, year: moment().jYear()});

        if (token && id) {
            api.linkOrderInfo(id, {}).then((response) => {
                setOrderInfo(response.data.order,(orderInfo) => {
                    jalaliMonth.map((month, i) => {
                        if(orderInfo.order_date.indexOf(month) !== -1) {
                            orderDate.month = i;
                        }
                    })
                    orderDate.day = parseInt(orderInfo.order_date.slice(orderInfo.order_date.indexOf(',') + 1, orderInfo.order_date.indexOf(',') + 4));
                        if (thisDate.month === orderDate.month) {
                            if (thisDate.day === orderDate.day) setSelectDateArray([thisDate]);
                            else if (thisDate.day === orderDate.day + 1) setSelectDateArray([orderDate, thisDate])
                        }
                        if (orderInfo?.customer?.addresses && orderInfo.customer.addresses.length>0) {
                            
                            let AddrId = ls.get('orderAddrId')
                            ls.remove('orderAddrId')
                            if (AddrId){
                                setAddress(orderInfo.customer.addresses.find((a)=>a.id == AddrId))
                            }else{
                                setAddress(orderInfo.customer.addresses[0])
                                setAddressId(orderInfo.customer.addresses[0].id)
                            }  
                        }
                })


            }).catch((err) => {
                if(err){
                    showNotification(err.response?.data?.user_message)
                }
            })
        }
    }, [router.query.id]);

    useEffect(() => {
        changeDataPayment()
    }, [paymentType])

    function onChangePayment(e) {
        setPaymentType(e.target.value)
    }

    function orderPayment(e) {
        setLoading(true)
        e.preventDefault();
        if(token){
            ls.set('order_id', orderInfo.id);
            setTimeout(()=>pay(),150)
        }else {
            showNotification('لطفا ابتدا به فروشگاه وارد شوید')
            Router.push('/login')
            setLoading(false)
        }
    }

    const onChange = (e) => {
        if (e.target.value) {
            if (e.target.name === "card_number") {
                e.target.value = e.target.value.slice(0,4);
            }
            setData({
                ...data,
                [e.target.name]: e.target.value,
            })
        }
    }

    function addZero(number) {
        if (number && number.length < 2) {
            return `0${number}`
        }
        return number
    }

    function mergeDateTime() {
        
        if (dateTime.year && dateTime.month && dateTime.day && dateTime.hour && dateTime.minute)
            return `${dateTime.year}/${addZero(dateTime.month)}/${addZero(dateTime.day)} ${addZero(dateTime.hour)}:${addZero(dateTime.minute)}:${addZero(dateTime.second) || '00'}`
        else
            return null
    }

    const pay = ()=>{
        
        let params={
            ...data
        }

        
        if(paymentType === 'card'){
            let d = mergeDateTime();
            if (d === null){
                showNotification('زمان پرداخت را کامل کنید')
                setLoading(false)
                return
            }
            params={
                ...data,
                payment_date: d,
            }
        }
        
        if (!params.customer_description){
            params.customer_description = ''
        }
        api.payment(params).then((response) => { 
            if (response) {

                if (paymentType === 'online') {
                    const bankUrl = response.data.bank_url
                    if (bankUrl) {
                        ls.set('online_pay', true);
                        window.location = bankUrl
                        setLoading(false)
                    }
                } else {

                    Router.push('/backFromPayment/card')
                    setLoading(false)
                }
            }
        }).catch((err) => {
            if(err){
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }
        })
    }

    function changeDataPayment() {
        if (orderInfo && orderInfo.customer) {
            let paymentData = {
                "order_id": orderInfo.id,
                "customer_id": orderInfo.customer.id,
                "address_id":  address ? address.id :addressId,
                "method": paymentType === 'online' ? "ONLINE" : "CARD_TO_CARD",
                "gateway": paymentType === 'online' ? "PAYPING" : undefined,
                "payment_date": paymentType === 'online' ? undefined : getDefaultDateTime(),
            }
            setData({
                ...data,
                ...paymentData
            })
        }

    }

    const backClick = () => {
        ls.remove('addrSelectFor')
        ls.remove("orderAddrId")
        Router.push({pathname: `/orders/${id}`})
    }

    function getDefaultDateTime(){
        let date_time=moment().format('jYYYY/jMM/jDD HH:mm:ss')
        const [date, time] = date_time.split(' ')
        const [year, month,day] = date.split('/')
        const [hour, minute,second] = time.split(':')
        setDateTime({
                year:year, month:null, day:null,
                hour:null, minute:null, second:null
            }
        )
    }

    function dateChange(e) {
        let selected = e.target.value.split('/');
        console.log(selected)
        setDateTime({
            ...dateTime,
            month: selected[0],
            day: selected[1]
        })
    }

    function timesChange(name, value) {
        setDateTime({
            ...dateTime,    
            [name]: value,
        })
    }

    function changeTimeCancel() {
        setDateTime({
            ...dateTime,
            hour: oldDateTime.hour | null,
            minute: oldDateTime.minute | null
        })
        hideModal();
    }

    function changeTime() {
        setOldDateTime({
            ...oldDateTime,
            hour: dateTime.hour,
            minute: dateTime.minute
        })
        hideModal()
    }

    function showModal() {
        setChangeModal(true);
        document.querySelector('body').classList.add('modal-open');
    }

    function hideModal() {
        setChangeModal(false);
        document.querySelector('body').classList.remove('modal-open');
    }

    return (
        <MainLayout>
            <section className="page-section">
                <div className="pt-10">
                    <Back onClick={backClick} />
                </div>
                <div className="mt-8 payment-amount-container">
                    <div className="flex justify-between size-14 font-medium fanum">
                        <div className="mr-2">{`قیمت کالاها (${orderInfo.products_count}عدد)`}</div>
                        <div className="ml-2">{numberWithCommas(orderInfo.order_products_price) + ' تومان'}</div>
                    </div>
                    <div className="flex justify-between size-14 font-medium fanum mt-4">
                        <div className="mr-2">هزینه ارسال</div>
                        <div className="ml-2">{numberWithCommas(orderInfo.shipment && orderInfo.shipment.price) + ' تومان'}</div>
                    </div>
                    {orderInfo.disCount && (
                        <div className="flex justify-between size-14 font-medium fanum mt-4">
                            <div className="mr-2">تخفیف</div>
                            <div className="ml-2">{numberWithCommas(orderInfo.disCount) + ' تومان'}</div>
                        </div>
                    )}
                    <div className="flex justify-between size-15 font-bold text-atrcheeBlue fanum mt-4 total-amount-div">
                        <div>جمع کل</div>
                        <div>{numberWithCommas(orderInfo.total_payment) + ' تومان'}</div>
                    </div>
                </div>
                <div className="mt-16 font-bold dark-gray size-18">
                    <span>انتخاب روش پرداخت</span>
                </div>
                <div className="mt-10 flex">
                    <div>
                        <input 
                            type="radio" 
                            id="online-pay"
                            name="payment-type"
                            value="online"
                            onChange={onChangePayment} 
                            className=" ml-1 input-radio" 
                        />
                    </div>
                    <div>
                        <div className="font-medium size-14">
                            <label htmlFor="online-pay">پرداخت آنلاین (پیشنهاد عطرچی)</label>
                        </div>
                        <div className="size-11 dark-gray">
                            <span>این روش به صورت سریع و آنی، از طریق کلیه‌ی کارت‌های .بانکی عضو شتاب انجام می‌پذیرد .در این روش نیازمند رمز دوم پویا هستید</span>
                        </div>
                    </div>
                </div>
                {paymentType === "online" && (
                    <div className="mt-6">
                        <form onSubmit={orderPayment}>
                            <Button className="font-regular fanum" loading={loading} text={`پرداخت آنلاین ${numberWithCommas(orderInfo.total_payment)} تومان`} />
                        </form>
                    </div>
                )}
                <div className="mt-10 flex">
                    <div>
                        <input 
                            type="radio" 
                            id="card-pay"
                            name="payment-type"
                            value="card"
                            onChange={onChangePayment} 
                            className=" ml-1 input-radio" 
                        />
                    </div>
                    <div>
                        <div className="font-medium size-14">
                            <label htmlFor="card-pay">پرداخت کارت به کارت</label>
                        </div>
                        <div className="size-11 dark-gray">
                            <span>سفارش شما بعد از تایید پرداخت کارت به کارت، نهایی و ثبت خواهد شد.</span>
                        </div>
                    </div>
                </div>
                {paymentType === "card" && (
                    <>
                    <div className="mt-6">
                        <div className="size-11 dark-gray text-center">
                            جهت پرداخت کارت به کارت، ابتدا مبلغ قابل پرداخت را به شماره کارت زیر واریز کرده و رسید واریزی را نزد خود نگه دارید.
                        </div>
                        <div className="mt-10 flex justify-center">
                            <div className="bank-card-container">
                                <img src="/image/ayandeh-logo.PNG" />
                                <div className="text-center font-extrabold fanum size-17 bank-card-number card-number-container">
                                6362-1411-0830-5476
                                </div>
                                <div className="bank-card-bottom px-5">
                                    <div className="w-full flex justify-between items-center h-full white">
                                        <div className="size-13">به نام:</div>
                                        <div className="size-12 font-bold">محمدحسین خرامان</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-1 font-medium size-14">چهار رقم آخر کارت بانکی</div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <input type="number" id="card_number" className="payment-card-input size-14 dark-gray font-regular fanum text-center" name='card_number' onChange={onChange} />
                            </div>
                            <div className="payment-card-disable-input size-12"><span>****</span></div>
                            <div className="payment-card-disable-input size-12"><span>****</span></div>
                            <div className="payment-card-disable-input size-12"><span>****</span></div>
                        </div>
                        <div className="mt-2 dark-gray size-10">چهار رقم آخر کارتی که با آن، پرداخت را انجام داده‌اید، وارد نمایید</div>
                        <div className="mt-8 pt-1 font-medium size-14">تاریخ پرداخت</div>
                        {selectDateArray.map((date,i) => (
                            <div className="mt-4" key={i}>
                                <input type="radio" id={`payment-date-${i}`} name="payment-dete" className="input-radio ml-1" value={date.month + "/" + date.day} onChange={dateChange} />
                                <label className="size-14 font-medium fanum dark-gray" htmlFor={`payment-date-${i}`}>{date.day + " " + jalaliMonth[date.month]}</label>
                            </div>
                        ))}
                        <div className="mt-8 font-medium size-14">زمان پرداخت</div>
                        <div className="mt-4">
                            <div id="time_select" onClick={showModal} className="payment-card-select dark-gray flex justify-center">
                                <div className="font-medium fanum size-14">
                                    {(dateTime.minute && dateTime.hour) ? dateTime.minute + " : " + dateTime.hour : "انتخاب ساعت و دقیقه پرداخت"}
                                    <span className="far fa-clock mr-2 size-16" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 dark-gray size-10">
                        زمان دقیق پرداخت، در رسید برخی از بانک‌ها، نمایش داده‌ نمی‌شود.<br /> لطفا زمان پرداخت خود را به خاطر داشته باشید.تمکیل زمان پرداخت جهت تسریع فرآیند تایید پرداخت، بسیار موثر خواهد بود.
                        </div>
                        <div className="mt-6 pb-8">
                            <form onSubmit={orderPayment}>
                                <Button 
                                    loading={loading}
                                    text="ثبت و ارسال مشخصات"
                                />
                            </form>
                        </div>
                    </div>
                    {changeModal && (
                        <>
                        <div className="change-date-modal-container" onClick={changeTimeCancel} />
                        <div className="change-date-modal">
                            <div className="flex justify-center">
                                <div className="flex justify-between px-6 size-14 font-medium dark-gray" style={{width: "222px"}}>
                                    <div>دقیقه</div>
                                    <div>ساعت</div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex justify-between items-center" style={{width: "222px"}}>
                                    <div className="scroll-select-container dark-gray size-12 font-regular fanum text-center noselect">
                                        <ScrollPicker 
                                            optionGroups={minutes}
                                            valueGroups={dateTime.minute || "00"}
                                            onChange={timesChange}
                                            height={87}
                                            itemHeight={29}
                                            name="minute"
                                        />
                                    </div>
                                    <div className="dark-gray size-16 font-extrabold">:</div>
                                    <div className="scroll-select-container dark-gray size-12 font-regular fanum text-center noselect">
                                        <ScrollPicker 
                                            optionGroups={hours}
                                            valueGroups={dateTime.hour || "00"}
                                            onChange={timesChange}
                                            height={87}
                                            itemHeight={29}
                                            name="hour"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-1 line-divider" />
                            <div className="mt-6 pt-1 flex justify-end">
                                    <div className="time-modal-button-div">
                                        <form onSubmit={changeTimeCancel}>
                                            <Button
                                                text="انصراف"
                                                height="28px"
                                                secondaryButton={true}
                                                className="size-14 font-medium"
                                            />
                                        </form>
                                    </div>
                                    <div className="time-modal-button-div mr-1">
                                    <form onSubmit={changeTime}>
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
                    </>
                )}
            </section>
        </MainLayout>
    );
}
 
export default Payment;