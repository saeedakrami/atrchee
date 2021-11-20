import axios from 'axios'

import store from '../store/global'
import ls from 'local-storage'
import Router from 'next/router'


function initMiddlewares() {

    // response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        console.log('middleware 1')
        if (response.data.jwt){
            console.log('get a jwt in middlewares ',response.data)
            let jwt = response.data.jwt
            if(response.config.url.search('admin') >= 0){
                if (jwt !== ls.get('admin_token'))
                    ls.set('admin_token', response.data.jwt)
            }else{
                if (jwt !== ls.get('token'))
                    ls.set('token', response.data.jwt)
            }
        }
        return response;
    }, function (error) {
        console.log('middleWare catched an err')


        function logOut() {
            if (error.response.config.url.search('admin') > 0)
            {
                console.log('loging out admin')
                store.actions.setAdminJwt('')
                ls.remove('admin_token')
                Router.push('/admin/login')
            }
            else{
                console.log('loging out user')
                store.actions.setJwt('')
                ls.remove('token')
                ls.remove('user')
                Router.push('/login')
            }
        }

        const errCode = error.response?.data?.error_code

        if (errCode) {
            if (errCode == 100003) { // Your ip is changed. Please log in again
                logOut()
            }
            if (errCode == 100002) { // JWT missing! You are not allowed to access this page without a valid JWT!
                logOut()
            }
            if (errCode == 100004) {
                logOut()
            }
        }

        return Promise.reject(error);
    });


    axios.interceptors.request.use(req => {
    console.log(`${req.method} ${req.url}`);
    // Important: request interceptors **must** return the request.
    return req;
    });

    axios.interceptors.response.use(res => {
    console.log(res.data.json);
    // Important: response interceptors **must** return the response.
    return res;
    });

}



export default initMiddlewares