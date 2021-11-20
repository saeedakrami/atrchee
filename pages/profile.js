import React from 'react';
import MainLayout from "../layouts/mainlayout";
import ls from 'local-storage'
import Link from 'next/link';
import Menu from '../components/Menu';

function Profile(){

    const user=ls.get('user')

    function loadFullName(){
        let fullname="-"
        if (user && user.gender && (user.first_name || user.last_name )) {
            fullname =`${user.gender==='FEMALE'? 'خانم':'آقای'} 
            ${user.first_name}  ${user.last_name}`
        }
        return fullname
    }

    return (
        <MainLayout logo={true}>
            <section className="page-section pb-32">
                <div className="mt-8">
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
                                        <span className="font-regular fanum">{user && user.identity_number || "-"}</span>
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
                                        <span className="font-regular fanum">{user && user.cellphone || "-"}</span>
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
                                        <span>{user && user.email || "-"}</span>
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
                                        <span className="font-regular fanum">{user && user.birth_date || "-"}</span>
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
                                        <span className="font-regular fanum">{user && user.card_number || "-"}</span>
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
            </section>
            <Menu />
        </MainLayout>

    )
}

export default Profile
