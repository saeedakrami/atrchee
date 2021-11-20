import React, {useEffect, useState} from 'react';
import AdminLayout from "../../layouts/adminLayout";
import DatePicker from "../../components/DatePicker";
import Api from "../api/v1/AdminApi";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {showNotification} from '../../components/ErrorHandling'
import {numberWithCommas} from '../../etc/FormatNumber'
import Loading from "../../components/Loading";
function orderSubmission () {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [productSelect, setProductSelect] = useState([])
    const [phrase, setPhrase] = useState('')
    const [link, setLink] = useState(null)

    const api = new Api()

    useEffect(() => {
        showSearchResult()
    }, [phrase]);

    useEffect(() => {
        setData({
            ...data,
            products: orders
        })
    }, [orders]);

    useEffect(() => {
        setProductSelect(productSelect)
        setProducts([])
    }, [orders]);


    function showSearchResult() {
        if (phrase.length > 1) {
            const params = {
                limit: 5,
                offset: 0,
                phrase: phrase
            }
            api.getProducts(params).then((response) => {
                setProducts(response.data.products)
            }).catch((err) => {
                if(err){
                    showNotification(err.response?.data?.user_message)
                }
            })
        } else {
            setProducts([])
        }
    }

    function handleChangeSearch(e) {
        setPhrase(e.target.value)
    }

    function onChange(e) {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                is_free: !!(e.target.name === 'is_free' && e.target.checked)
            })
    }

    function createLink(e) {
        setLoading(true)
        e.preventDefault();
        api.createOrderLink(data).then((response) => {
            if(response){
                setLoading(false)
                let oLink = response.data.link
                let id = oLink.split('/').slice(-1)[0]
                oLink = oLink.split('/').slice(0,-1).join('/') + '.html?id=' + id

                oLink = oLink.split('.com').slice(-1)[0]

                let orderLink = `${window.location.origin}${oLink}`
                setLink(orderLink)
            }
        }).catch((err) => {
            if(err){
                setLoading(false)
                showNotification(err.response?.data?.user_message)
            }

        })
    }

    function deleteOrder(item) {
        const indexOrder = orders.findIndex(product => product.product_id === item.id)
        const indexSelected = productSelect.findIndex(selected => selected.id === item.id)
        if (indexOrder > -1) {
            orders.splice(indexOrder, 1)
            setOrders(orders)
        }
        if (indexSelected > -1) {
            productSelect.splice(indexSelected, 1)
            setProductSelect([...productSelect])
        }
    }

    function changeCountOrder(item, e) {
        let count = e.target.value
        let index = orders.findIndex(product => product.product_id === item.id)
        if (index > -1) {
            orders[index].count = count
            setOrders(orders)
        }
    }

    function changePriceOrder(item, e) {
        let price = e.target.value
        let index = orders.findIndex(product => product.product_id === item.id)
        if (index > -1) {
            orders[index].product_unit_price = price
            setOrders(orders)
        }
    }

    function createProductOrder(product) {
        let itemSelected = {
            "product_id": product.id,
            "product_unit_price": product.price,
            "count": 1
        }
        setOrders([...orders, itemSelected])
    }

    function addSelectedProduct(item) {
        let index = productSelect.findIndex(selected => selected.id === item.id)
        if (index === -1) {
            setProductSelect([...productSelect, item]);
            createProductOrder(item)
        } else {
            setProducts([])
        }
    }


    function onChangeDatePicker(dateTime) {
        setData({
            ...data,
            shipment_date: dateTime.format('jYYYY/jMM/jDD HH:mm:ss'),
        })
    }

    return (
        <AdminLayout>
            <section className="login-section px-3">
                <figcaption className="md:w-full font-medium">
                    <figure className="m-auto">
                        <div className="space-y-4">
                            <blockquote>
                                <h1 className="text-base font-irsans p-4 pb-3 text-atrcheeBlack font-semibold">
                                    ایجاد لینک خرید برای مشتری
                                </h1>
                            </blockquote>
                        </div>
                    </figure>
                </figcaption>
                <div className="text-atrcheeGray">
                    <form className='border border-black py-5'>
                        <div className="bg-white px-3">
                            <div className="-mx-3 md:flex items-center px-3 mb-5">
                                <div className='w-1/2 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='instagramPlatform'>
                                        اینستاگرام
                                    </label>
                                    <input
                                        id="instagramPlatform"
                                        name='social_platform'
                                        type="radio"
                                        className="form-radio text-pink-800"
                                        value='INSTAGRAM'
                                        onChange={onChange}
                                    />
                                </div>
                                <div className='w-1/2 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='whatsappPlatform'>
                                        واتس اپ:
                                    </label>
                                    <input
                                        id="whatsappPlatform"
                                        name='social_platform'
                                        type="radio"
                                        className="form-radio text-pink-800"
                                        value='WHATS_APP'
                                        onChange={onChange}
                                    />
                                </div>

                            </div>
                            <div className="-mx-3 md:flex items-center px-3 mb-2">
                                {
                                    data && data.social_platform==='INSTAGRAM'?
                                       <div className='w-full'>
                                           <label
                                               className="w-3/6 text-atrcheeGray text-xs" htmlFor='customerSocialId'>
                                               آدرس صفحه اینستاگرام:
                                           </label>
                                           <input
                                               className="w-3/6 bg-white-200 text-black float-left border border-atrcheeLightGray text-xs rounded-md px-3 py-1 ml-2 text-left focus:border-0"
                                               id="customerSocialId"
                                               type="text"
                                               placeholder='username'
                                               name='customer_social_id'
                                               onChange={onChange}
                                           />
                                       </div> :
                                        <div className='w-full'>
                                            <label
                                                className="w-3/6 text-atrcheeGray text-xs" htmlFor='customerSocialId'>
                                                شماره همراه مشتری:
                                            </label>
                                            <input
                                                className="w-3/6 bg-white-200 text-black border float-left border-atrcheeLightGray text-xs rounded-md px-3 py-1 ml-2  text-left focus:border-0"
                                                id="customerSocialId"
                                                type="text"
                                                placeholder='09355200255'
                                                name='customer_social_id'
                                                onChange={onChange}
                                            />
                                        </div>

                                }
                                <i className='fa fa-copy text-atrcheeViolet pr-2 text-lg'/>
                            </div>
                            <div className='h-2 border border-t-0 border-r-0 border-l-0 border-black my-3'/>
                            <div className="-mx-3 md:flex items-center px-3 mb-2">
                                <div className='w-1/5 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs">
                                        کرایه:
                                    </label>
                                </div>
                                <div className='w-1/5 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='invoiceINInvoice'>
                                        دارد
                                    </label>
                                    <input
                                        className="form-radio text-pink-800"
                                        id="invoiceINInvoice"
                                        name='shipment_payment_type'
                                        type='radio'
                                        value='INCLUDED_IN_INVOICE'
                                        onChange={onChange}
                                    />
                                </div>

                                <div className='w-2/5 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='paidByCustomer'>
                                        با خود مشتری
                                    </label>
                                    <input
                                        className="form-radio text-pink-800"
                                        id="paidByCustomer"
                                        type='radio'
                                        name='shipment_payment_type'
                                        value='PAID_BY_CUSTOMER_SEPARATELY'
                                        onChange={onChange}
                                    />
                                </div>
                                <div className='w-1/5 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='zeroShipment'>
                                        ندارد
                                    </label>
                                    <input
                                        className="form-radio text-pink-800"
                                        id="zeroShipment"
                                        type='radio'
                                        value='ZERO_SHIPMENT_PRICE'
                                        name='shipment_payment_type'
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="-mx-3 md:flex items-center px-3 mb-2">
                                <label
                                    className="w-2/6 text-atrcheeGray pl-2 text-xs" htmlFor='myDatePicker'>
                                    زمان ارسال:
                                </label>
                                <i className='fa fa-calendar pl-3 text-atrcheeViolet text-lg' />

                                <div
                                    className="w-3/6 bg-white-200 relative text-black border border-atrcheeLightGray text-xs rounded-md px-3 py-1 my-2 focus:border-0">
                                    <DatePicker
                                        id='myDatePicker'
                                        onChange={(value) => {onChangeDatePicker(value)}}
                                    >
                                    </DatePicker>
                                </div>
                            </div>

                            <div className="-mx-3 md:flex items-center px-3 mb-5">

                                <div className='w-2/6 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs">
                                        نوع ارسال:
                                    </label>
                                </div>
                                <div className='w-2/6 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='deliveryShipment'>
                                        پیک
                                    </label>
                                    <input
                                        className="form-radio text-pink-800"
                                        type='radio'
                                        id="deliveryShipment"
                                        name='shipment_type'
                                        value='DELIVERY'
                                        onChange={onChange}
                                    />
                                </div>
                                <div className='w-2/6 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='postShipment'>
                                        پست
                                    </label>
                                    <input
                                        className="form-radio text-pink-800"
                                        id="postShipment"
                                        name='shipment_type'
                                        value='POST'
                                        type='radio'
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="-mx-3 md:flex items-center px-3 mb-2">

                                <div className='w-2/6 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs">
                                        پرداخت:
                                    </label>
                                </div>
                                <div className='w-4/6 flex items-center'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='isFree'>
                                        رایگان
                                    </label>
                                    <input
                                        type='checkbox'
                                        id='isFree'
                                        className="form-checkbox text-pink-800"
                                        name='is_free'
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className='h-2 border border-t-0 border-r-0 border-l-0 border-black my-3'/>
                            <div className="-mx-3 px-3 mb-2 relative">
                                <div className='md:flex items-center'>
                                    <input
                                        className="w-full bg-white-200 text-black border border-atrcheeLightGray text-xs rounded-md px-3 py-1  focus:border-0"
                                        id="searchProduct"
                                        type="text"
                                        placeholder='جستجوی محصول'
                                        onKeyUp={handleChangeSearch}/>
                                </div>
                                <div className="absolute top-50 right-12 shadow-lg z-50 w-5/6">

                                    {products && products.length > 0 &&
                                    products.map((item) => {
                                        return (
                                            <ul
                                                className='max-w-md flex bg-white text-xs border h-50 border-gray border-b-0'
                                                key={item.id}>
                                                <li id={item.id} className='w-full p-2 hover:bg-gray-200 text-xs'
                                                    onClick={() => addSelectedProduct(item)}>
                                                    {item && item.perfume && item.perfume.name || item.id}
                                                </li>
                                            </ul>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            {
                                productSelect && productSelect.length > 0 &&
                                <div className='p-3 shadow-md'>
                                    {
                                        productSelect.map((item) => {
                                            return (
                                                <div key={item.id} className="-mx-3 md:flex items-center p-2 text-xs">
                                                    <div className='w-3/6'>{item.perfume.name}</div>
                                                    <input
                                                        className='w-1/6 border border-atrcheeLightGray text-xs text-center px-2 py-1 m-1'
                                                        defaultValue={1}
                                                        onChange={(e) =>
                                                            changeCountOrder(item,e)}
                                                        type={'number'}
                                                    />
                                                    <input
                                                        className='w-2/6 border text-xs border-gray-500 text-center px-2 py-1 m-1'
                                                        defaultValue={numberWithCommas(item.price)}
                                                        type={'text'}
                                                        onChange={(e)=>{changePriceOrder(item,e)}}

                                                    />
                                                    <a  href='#' type={'button'}
                                                            onClick={() => deleteOrder(item)}>
                                                        <i className='fa fa-trash pr-2 text-atrcheeViolet text-md'/>
                                                    </a>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }

                            <div className='h-2 border border-t-0 border-r-0 border-l-0 border-black my-3'/>
                            <div className="-mx-3 md:flex items-center px-3 mb-2">
                                <div className='w-1/4'>
                                    <label
                                        className="text-atrcheeGray pl-2 text-xs" htmlFor='description'>
                                        توضیحات :
                                    </label>
                                </div>
                                <div className='w-3/4'>
                                  <textarea
                                      className="w-full bg-white-200 text-black border border-gray-500 text-xs rounded-md px-3 py-1  focus:border-0"
                                      id="description"
                                      name="admin_description"
                                      placeholder={'توضیحات خود را اینجا بنویسید...'}
                                      onChange={onChange}/>
                                </div>
                            </div>


                            <div className="-mx-3 md:flex items-center px-3 my-2">
                                <button className="md:w-full bg-atrcheeViolet text-white h-41 font-bold py-2 px-4 h-34 rounded-md"
                                        onClick={createLink}
                                        type={"submit"}
                                        children= {loading ? <Loading loading={loading}/> :'ایجاد لینک خرید'}
                                />
                            </div>
                            {link &&
                            <div id="linkOrderCustomer">
                                <div className="-mx-3 md:flex items-center px-3 my-2">
                                    <a href={link} className='md:w-full p-2 font-bold mx-1 text-xs  text-blue text-left'>
                                        {link}
                                    </a>
                                </div>
                                <div className="-mx-3 md:flex items-center px-3 my-2">
                                    <CopyToClipboard text={link} >
                                        <button onClick={()=>showNotification('لینک سفارش کپی شد','پیام!','success')}
                                                type={'button'}
                                                className='md:w-full bg-gray-100 border border-black text-center  text-black p-2 text-xs'>
                                            کپی کردن لینک
                                            <i className='fa fa-clipboard pr-2 text-atrcheeViolet text-lg '/>
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                            }
                        </div>
                    </form>
                </div>
            </section>
        </AdminLayout>
    )
}

export default orderSubmission
