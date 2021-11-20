import React from 'react';
import Link from "next/link";
import MainLayout from "../layouts/mainlayout";

function Home () {
    return (
        <MainLayout>
            <div className="bg-white flex flex-col px-5">
                <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-full px-3 text-md text-medium text-center my-20 mx-5 ">
                        <div className='bg-gradient-to-br from-atrcheeViolet to-violet-900 p-5 rounded-lg'>
                            <Link href={'/login'} passHref>
                                <a className='color-atrcheViolet'>ورود به فروشگاه عطرچی</a>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    )

}

export default Home
