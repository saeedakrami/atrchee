import { Modal } from 'react-bootstrap'
import React, { useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import useCountDown from 'react-countdown-hook';
import { toast } from 'react-toastify';
import { PersianToLatin, latinToPersian } from '../etc/stringUtils'

import Store, { actions } from '../store/global'

momentDurationFormatSetup(moment);

import {
    mobileLogin,
    sendToken,
    cheet
} from '../API'

let cnt = 0

export default (function LoginModal({ show, close }) {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('')
    const [code, setCode] = useState('')

    const [vCode_timeLeft, { start }] = useCountDown(0, 1000);



    const step_style = (i, step) => {

        const style = {
            transform: 'translateX(0)',
            transition: 'all ease 0.3s',
            //position: 'absolute',
            //width: '100%',
            height: 0,
        }
        if (step > i)
            style.transform = 'translateX(120%)'
        if (step < i)
            style.transform = 'translateX(-120%)'

        return style
    }



    const closeModal = (modalStatus) => {
        //close()
        cnt = 0
        actions.setModal(modalStatus)

        setTimeout(() => {
            setStep(1)
            setMobile('')
            setCode('')
            setLoading(false)
        }, 500)
        console.log(Store.ui)
    }

    return (


        <Modal show={show} onHide={() => {
            // TODO: problem
            // setTimeout(() => setStep(1), 500)
            // setLoading(false)
        }}>
            {/* <div className=" d-block">
                <button type="button"
                    onClick={() => closeModal('')}
                    className="close-button close">
                    <span>&times;</span>
                </button>
            </div>
             */}
            <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

                <div className="modal-container bg-white w-9/12 md:max-w-sm mx-auto rounded shadow-lg z-50 overflow-y-auto">

                    {(step == 2) && <div className="modal-close absolute bottom-0 left-0 cursor-pointer flex flex-col items-center m-4 text-white text-sm z-50"
                        onClick={() => cheet(PersianToLatin(mobile)).catch(() => '')}>
                        <span> چیت</span>
                    </div>}
                    <div className="modal-content py-4 px-6 ">
                        <div className="flex justify-end pb-3 opacity-75" onClick={() => closeModal('')}>
                            <div className="modal-close cursor-pointer z-50">
                                <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className='login-modal'>
                            <div
                                style={step_style(1, step)}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        let mob = mobile
                                        if ((mob.length == 10) && (mob[0] !== '0'))
                                            mob = '0' + mob
                                        if (mob.length == 11) {
                                            mobileLogin(PersianToLatin(mob)).then((resp) => {
                                                if ((resp?.extra_data?.is_new_code === false) && vCode_timeLeft)
                                                    toast.success('کد قبلی همچنان معتبر است')
                                                else {
                                                    start(2 * 60 * 1000)
                                                }
                                            }).catch((e) => {
                                                console.log('error here 43124')
                                                console.log(e)
                                                setStep(1)
                                            })
                                            setStep(2)
                                        }
                                        else
                                            toast.error('شماره موبایل باید 11 رقم باشد')
                                    }}
                                >
                                    <div className="modal-body mt-3">
                                        <p className='feild-label mb-2'>با شماره موبایل وارد شوید:</p>
                                        <input type="tel" name="mobile" className=' global-input number'
                                            onChange={(e) => setMobile(latinToPersian(e.target.value, false))}
                                            value={mobile}
                                            placeholder='مثال: ۰۹۱۲۳۴۵۶۷۸۹' />
                                    </div>
                                    <button type="button" className="bg-indigo-500 rounded-lg text-white hover:bg-indigo-400  m-3 mx-4 p-2 px-3"
                                        type='submit'
                                    >تایید</button>
                                </form>
                            </div>

                            <div
                                style={step_style(2, step)}
                            >
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    setLoading(true)
                                    if (!loading)
                                        sendToken(PersianToLatin(mobile), PersianToLatin(code)).then((resp) => {
                                            setLoading(false)

                                            if (resp.jwt.length > 10) {

                                                closeModal('')
                                                actions.setJwt(resp.jwt)
                                            }


                                        }).catch(() => {
                                            setLoading(false)
                                            cnt += 1
                                            if (cnt == 3) {
                                                setStep(1)
                                                cnt = 0
                                            }
                                            toast.error('کد وارد شده صحیح نیست')
                                            console.log('err 86123')
                                        })

                                }}>
                                    <div className="modal-body mt-2 ">
                                        <p className='feild-label'>کد تایید پیامک شده:</p>
                                        <input type="tel" name="code" className=' global-input number'
                                            onChange={(e) => setCode(latinToPersian(e.target.value, false))}
                                            value={code}
                                            placeholder='مثال: ۱۲۳۴۵' />

                                        {vCode_timeLeft ?
                                            <div className='pr-2 remaining-time'>
                                                زمان باقی مانده
                                    {' ' + moment.duration(vCode_timeLeft).format('mm:ss')}
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>
                                    <button type="button" className="bg-indigo-500 rounded-lg text-white hover:bg-indigo-400  m-3 mx-4 p-2 px-3"
                                        disabled={loading}
                                        type='submit'

                                    >
                                        {loading ?
                                            <span className="spinner"></span>
                                            :
                                            'تایید'
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>


                        {/* <div className="flex justify-end pt-2">
                            <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">Action</button>
                        </div> */}

                    </div>
                </div>
            </div>

        </Modal >
    );
})