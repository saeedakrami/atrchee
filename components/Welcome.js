import React, {useEffect, useState} from 'react'
import ls from "local-storage";
import Router from 'next/router'

const Welcome = () => {

    const [user, setUser] = useState(ls.get('user'));
    
    useEffect(() => {
        setUser(user)
    }, [user])

    function exit(){
        ls.clear();
        Router.push('/login')
    }

    return (
        <>
            <div className="padding-section mt-8">
                { user && user.first_name && user.last_name && Router.pathname !== '/ordersList' &&
                    <div className='flex justify-between pb-5 border-b border-gray-300'>
                        <div>
                            <span className="font-extrabold text-black size-15">
                                {`${user.first_name} ${user.last_name}`}
                            </span>
                        </div>
                        <div>
                            <a href='#' className='size-14 font-bold' onClick={exit}>
                                خروج <span className="fas fa-sign-out" />
                            </a>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
export default Welcome
