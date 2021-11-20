import axios from 'axios'

import { url } from './const'

import {

} from './admin'

import Store from '../store/global'



const getHeaders = () => {
    const headers = {
        Accept: "application/json",
        'Content-Type': "application/json",
    }
    if (Store.user.jwt)
        headers.Authorization = `Bearer ${Store.user.jwt}`
    return headers
}

const post = (path, body) =>
    new Promise((resolve, reject) => {
        axios
            .post(
                url + path, body,
                {
                    headers: getHeaders()
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    })

const get = (path) =>
    new Promise((resolve, reject) => {
        axios
            .get(
                url + path,
                {
                    headers: getHeaders()
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    })

const put = (path, body) =>
    new Promise((resolve, reject) => {
        axios
            .put(
                url + path, body,
                {
                    headers: getHeaders()
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    })



// ******************************
//   auth

const mobileLogin = (mobile) => post('/login', { cellphone_number: mobile })

const cheet = (mobile) => get(`/postman/otp/${mobile}`)

const sendToken = (mobile, code) => post('/otp', {
    cellphone_number: mobile,
    otp: code
})



// 

const OrderLink_info = (path) => put(path, {})


const editAddr = (id, { city_id, post_code, address, description }) => put('/addresses/' + id, {
    city_id,
    post_code,
    address,
    description
})

const createAddr = ({ city_id, post_code, address, description }) => post('/addresses', {
    city_id,
    post_code,
    address,
    description
})

//
const pay = (body) => post('/payment/pay', body)



export {

    mobileLogin, //
    cheet,
    sendToken, //
    OrderLink_info,
    editAddr,
    createAddr,
    pay
}




