import axios from "axios";
import ls from 'local-storage'

export default class Api {
    constructor() {
        this.client = null;
        this.api_url = "https://atrchee.com/api/v1";
    }



    // initialization api
    getHeaders = () => {
        let headers = {
            Accept: "application/json",
        };
        const token = ls.get('admin_token')
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    };

    post = (path,params) => axios.post(
                this.api_url + path,
                params,
                {
                    headers: this.getHeaders()
                }
        )

    put = (path,params) => axios.put(
                this.api_url + path,
                params,
                {
                    headers: this.getHeaders()
                }
        )

    get = (path,params) => axios.get(
                this.api_url + path,
                {
                    params,
                    headers: this.getHeaders()
                }
        )


    //admin
    login = (params) => {
        return this.post('/admin/login', {...params});

    };
    // admin products
    getProducts = (params) => {
        return this.get('/admin/products', params || {});

    };
    // admin order submission
    createOrderLink = (params) => {
        return this.post('/admin/orders', {...params});

    };
}

