import '../node_modules/semantic-ui-css/components/form.min.css'
import '../node_modules/semantic-ui-css/components/accordion.css'
import '../node_modules/semantic-ui-css/components/dropdown.css'
import '../node_modules/semantic-ui-css/components/menu.css'
// import '../node_modules/semantic-ui-css/components/list.css'
// import '../node_modules/semantic-ui-css/components/search.css'
// import '../node_modules/semantic-ui-css/components/site.css'
import '../components/date-picker-style.css'


import '@fortawesome/fontawesome-free/css/all.min.css';
//import '@fortawesome/fontawesome-free/css/v4-shims.min.css';
import '../sass/app.scss';

import '../node_modules/react-toastify/dist/ReactToastify.css';

import React from "react";

import initMiddleware from '../API/middleware'
import 'react-notifications-component/dist/theme.css'

import ReactNotification from 'react-notifications-component'

if (typeof window !== 'undefined')
    initMiddleware()

export default (function MyApp({Component, pageProps}) {
    const Layout = Component.Layout ? Component.Layout : React.Fragment;


    return (

        <Layout>
            <ReactNotification/>
            {
                <Component {...pageProps} />
            }

        </Layout>
    )
})
