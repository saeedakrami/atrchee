import React from 'react';
import Link from "next/link";

const Menu = () => {
    const pathname = window.location.pathname;
    return (
        <div className="fixed menu-container">
            <Link href={{pathname: '/userAddresses', query: {fromOrders: 'false'}}}>
                <div className={`flex flex-col items-center menu-items ${pathname.includes('userAddresses') && 'this-page'}`}>
                    <div>
                        <span className="fas fa-map-marker-alt size-25" />
                    </div>
                    <div className="font-medium size-14">آدرس‌های من</div>
                </div>
            </Link>
            <Link href="/userOrders">
                <div className={`flex flex-col items-center menu-items ${pathname.includes('userOrders') && 'this-page'}`}>
                    <div>
                        <span className="fas fa-shopping-bag size-25" />
                    </div>
                    <div className="font-medium size-14">لیست سفارشات</div>
                </div>
            </Link>
            <Link href="/profile">
                <div className={`flex flex-col items-center menu-items ${pathname.includes('profile') && 'this-page'}`}>
                    <div>
                        <span className="fas fa-user size-25" />
                    </div>
                    <div className="font-medium size-14">اطلاعات شخصی</div>
                </div>
            </Link>
        </div>
    );
}
 
export default Menu;