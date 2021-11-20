
import axios from 'axios'

import { url } from './const'

import Store from '../store/global'

const getHeaders = () => {
    const headers = {
        Accept: "application/json",
        'Content-Type': "application/json",
    }
    if (Store.user.admin_jwt)
        headers.Authorization = `Bearer ${Store.user.admin_jwt}`
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




// orders

const submitOrder = (body) => post('/admin/orders', body) // create link

const orderList = () => get('/admin/orders')

// login

const adminLogin = (user, pass) => post('/admin/login', { credential: user, password: pass })

// product

const productSearch = (searchTerm) => get('/admin/products?limit=6&phrase=' + searchTerm)

// verify card2card

const verifyCard2card = (payment_code, order_code, card_number) => post('/admin/payment/verify/' + payment_code, { order_code, card_number })


export {
    submitOrder,
    orderList,
    adminLogin,
    productSearch,
    verifyCard2card
}
