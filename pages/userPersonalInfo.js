import React from 'react'
import MainLayout from "../layouts/mainlayout";
import Link from "next/link";
import ls from 'local-storage'
import Router from 'next/router'

function userPersonalInfo(){

    const user=ls.get('user')

    function loadFullName(){
        let fullname="-"
        if (user && user.gender && (user.first_name || user.last_name )) {
            fullname =`${user.gender==='FEMALE'? 'خانم':'آقای'} 
            ${user.first_name}  ${user.last_name}`
        }
        return fullname
    }

    function onClick(e){
        Router.push('/login')
    }

    return(
        user &&
        <MainLayout>
            <section className="page-section mt-8 pt-1">
                <figcaption className="font-medium">
                    <Link href="/profile" passHref>
                        <a className="size-16 font-bold dark-gray">
                            <span className="fa fa-arrow-right back-arrow-big" />
                            <span>اطلاعات شخصی</span>
                        </a>
                    </Link>
                    <div className="mt-8 divider"></div>
                    <div className="mt-3">
                        <Link href={'/editUserAccount'} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>نام و نام خانوادگی</span>
                                        </div>
                                        <div>
                                            <span>{loadFullName()}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={{pathname: '/editPersonalUser', query: {name: 'identity_number'}}} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>کد ملی</span>
                                        </div>
                                        <div>
                                            <span className="font-regular fanum">{user.identity_number || "-"}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={{pathname: '/editPersonalUser', query: {name: 'cellphone'}}} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>شماره موبایل</span>
                                        </div>
                                        <div>
                                            <span className="font-regular fanum">{user.cellphone || "-"}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={{pathname: '/editPersonalUser', query: {name: 'email'}}} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>ایمیل</span>
                                        </div>
                                        <div>
                                            <span>{user.email || "-"}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={'/editBirthdateUser'} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>تاریخ تولد</span>
                                        </div>
                                        <div>
                                            <span className="font-regular fanum">{user.birth_date || "-"}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={{pathname: '/editPersonalUser', query: {name: 'card_number'}}} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>شماره کارت جهت مرجوعی وجه</span>
                                        </div>
                                        <div>
                                            <span className="font-regular fanum">{user.card_number || "-"}</span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                        <Link href={{pathname: '/editPersonalUser', query: {name: 'password'}}} passHref>
                            <a>
                                <div className="w-full flex personal-info-card justify-between">
                                    <div className="flex flex-col justify-evenly size-12 h-full">
                                        <div>
                                            <span className='font-medium gray'>رمز عبور</span>
                                        </div>
                                        <div>
                                            <span>
                                                {user && user.has_password ?
                                                    `******` :
                                                    'تنظیم رمز ورود'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                <div>
                                    <i className='fa fa-chevron-left dark-gray size-10'/>
                                </div>
                                </div>
                            </a>
                        </Link>
                    </div>
                </figcaption>
            </section>
        </MainLayout>
    )
}
export default userPersonalInfo