import React, { useEffect, useState } from 'react'
import Welcome from './Welcome'

import ls from "local-storage";
import Router from 'next/router'
const header = (props) => {
    const [user, setUser] = useState(ls.get("user"));
    const [mobile, setMobile] = useState(ls.get("mobile"));

    useEffect(() => {
        setUser(user)
    }, [user])

    useEffect(() => {
        setMobile(mobile)
    }, [mobile])
    return (
        <section className="header flex">
            <figure className="w-full">
                {props.logo && (
                    <div className="mt-8">
                        <span className="block mx-auto atrchee-logo profile-logo" />
                    </div>
                )}
                {
                    (Router.pathname === '/profile' || Router.pathname === '/backFromPayment' || Router.pathname === '/orders' || Router.pathname === '/userAddresses' || Router.pathname === '/userOrders' || Router.pathname === '/ordersList') &&
                    <Welcome />
                }

            </figure>
        </section>
    )

}

export default header
