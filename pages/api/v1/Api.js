import axios from "axios";
import ls from 'local-storage'


export default class Api {
    constructor() {
        this.api_url = "https://api.atrchee.com/v1";
    }

    // initialization api
    getHeaders = () => {
        let headers = {
            Accept: "application/json",
        };
        const token = ls.get('token')
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    };

    post = (path,params) => {
        return new Promise((resolve, reject) => {
            axios.post(
                this.api_url + path,
                params,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        })
    }
    put = (path,params) =>{
        return new Promise((resolve, reject) => {
            axios.put(
                this.api_url + path,
                params,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        })
    }
    get = (path,params) =>{
        return new Promise((resolve, reject) => {
            axios.get(
                this.api_url + path,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        })
    }

    // Login
    userExistence = (mobile, params) => {
        return this.get(`/customers/${mobile}/state`, {...params});
    };

    loginWithPassword = (params) => {
        return this.post('/password-login', {...params});

    };

    loginWithOtp = (params) => {
        return this.post('/otp-login', {...params});
    };


    //Password
    passwordRecovery = (params) => {
        return this.put(`/password-recovery`, {...params});
    };


    // Send OTP Code
    sendOtpCode = (params) => {
        return this.post('/otp', {...params});
    }
    sendOtpForChangeMobile = (params) => {
        return this.post('/otp/cellphone-change', {...params});
    }
    getOtpCode = (mobile, params) => {
        return this.get(`/postman/otp/${mobile}`, {...params});
    }


    //CreateAccount
    EditProfile = (params) => {
        return this.put(`/customers`, {...params});
    };


    // Payment
    payment = (params) => {
        return this.post(`/payment/pay`, {...params});
    };

    verifyPayment = (online_payment_code, params) => {
        return this.post(`/payment/verify/${online_payment_code}`, {...params});
    };


    //Address
    storeAddress = (params) => {
        return this.post(`/addresses`, {...params})
    }
    userAddresses = (params) => {
        return this.get(`/addresses`, {...params})
    }
    editAddress = (addressId, params) => {
        return this.put(`/addresses/${addressId}`, {...params})
    }
    getAddress = (addressId,params) => {
        return this.get(`/addresses/${addressId}`, {...params})
    }

    //order
    linkOrderInfo = (orderId, params) => {
        return this.put(`/orders/${orderId}`, {...params})
    }
    getOrders = (orderType, params) => {
        return this.get(`/orders${orderType ? "?customer_side_status=" + orderType : ""}`, {...params})
    }
    getOrder = (orderId,params) => {
        return this.get(`/orders/${orderId}`, {...params})
    }

    getOrderValidity = (orderId,params) => {
        return this.get(`/orders/${orderId}/validity`, {...params})
    }

    //province

    getProvinceCities = (province_id, params) => {
        return this.get(`/province/${province_id}/cities`, {...params})
    }

    getOrdersCount = (params) => {
        return this.get('/orders/count', {...params})
    }

    getPaymentData = (payment_id, params) => {
        return this.get(`/payment/${payment_id}/verification-info`, {...params})
    }

}





// this.client = axios.create({
//     baseURL: this.api_url,
//     timeout: 31000,
//     headers: headers,
// });