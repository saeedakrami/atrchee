import React from 'react';
import {store} from "react-notifications-component";


const showNotification = ( message= undefined,title = null,type="danger") => {

        store.addNotification({
            title:  title || 'خطا!',
            message: message === undefined ? "خطایی رخ داده است" :message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ['animate__animated animate__fadeIn'], // `animate.css v4` classes
            animationOut: ['animate__animated animate__fadeOut'],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });

}
export {showNotification}
