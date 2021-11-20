import React, {useState} from 'react';
import Api from '../../pages/api/v1/AdminApi';
import Router from 'next/router'
import ls from 'local-storage'
import AdminLayout from "../../layouts/adminLayout";
import Loading from "../../components/Loading";

function Login()  {

    const [validation, setValidate] = useState(undefined);
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);

    const onChange = (e) => {
        if (e.target.value) {
            setData({
                ...data,
                [e.target.name]: e.target.value,

            })
            setValidate(true)
        } else {
            setValidate(false)
            setMessage('نام کاربری و رمز ورود خود را وارد نمایید')
        }
    }

    const login = (e) => {
        setLoading(true)
        e.preventDefault();
        const adminApi = new Api();
        adminApi.login(data)
            .then((response) => {
                if (response.data.jwt) {
                    ls.set('admin_token', response.data.jwt)
                    Router.push('/admin/orderSubmission')
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                setValidate(false)
                setMessage('نام کاربری یا رمز ورود اشتباه است')
                console.log(err);
            });
    }

    return (
        <AdminLayout>
            <section className="login-section flex px-3">
                <figcaption className="md:w-full font-medium">
                    <figure className="m-auto">
                        <div className="space-y-4">
                            <blockquote>
                                <h1 className="text-base font-irsans p-4 pb-3 text-atrcheeBlack font-semibold">
                                    ورود مدیر عطرچی
                                </h1>
                            </blockquote>
                        </div>
                    </figure>
                    <div className="text-atrcheeGray">
                        <form className='flex'>
                            <div className="bg-white flex flex-col px-5">
                                <div className="-mx-3 md:flex mb-2">
                                    <div className="md:w-full px-3">
                                        <label
                                            className="text-atrcheeGray text-xs mb-4"
                                            form="mobile">
                                            نام کاربری و رمز ورود خود را وارد نمایید:
                                        </label>
                                        <input
                                            className="w-full bg-white-200 h-39 text-black border border-atrcheeLightGray text-sm rounded-md px-3 py-2 mt-5 focus:border-0"
                                            id="userName"
                                            type="text"
                                            name='credential'
                                            placeholder="نام کاربری"
                                            onChange={onChange}
                                            style={validation === false ? {borderColor: 'red'} : null}
                                        />
                                        <input
                                            className="w-full bg-white-200 h-39 text-black border border-atrcheeLightGray text-sm rounded-md px-3 py-2 mt-5 focus:border-0"
                                            id="password"
                                            type="password"
                                            name='password'
                                            placeholder="رمز عبور"
                                            onChange={onChange}
                                            style={validation === false ? {borderColor: 'red'} : null}
                                        />
                                        {
                                            validation === false && message !== undefined &&
                                            <div
                                                className='text-atrcheeRed w-full text-red-500 text-xs'>{message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="-mx-3 md:flex my-2">
                                    <div className="md:w-full px-3">
                                        <button disabled={!validation}
                                                style={!validation ? {opacity: '0.8', cursor: 'not-allowed'} : null}
                                                className="md:w-full bg-atrcheeViolet text-white h-41 font-bold py-2 px-4 rounded-md mt-2"
                                                onClick={login}
                                                type={"submit"}
                                                children= {loading ? <Loading loading={loading}/> :'ورود'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </figcaption>
            </section>
        </AdminLayout>

    )
}

export default Login
