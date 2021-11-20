
import { view, store } from '@risingstack/react-easy-state'

import { actions } from '../store/global'

import { adminLogin } from '../API/admin'

export default view(function AdminLogin() {


    const form = store({

        user: "",
        pass: "",

    })

    return <>

        <div className="w-1/1 justify-center flex pt-10">
            <form className="lg:w-1/2"
                onSubmit={(e) => {
                    e.preventDefault()
                    adminLogin(form.user, form.pass).then(resp => {
                        actions.setAdminJwt(resp.jwt)
                    }).catch((err) => console.log(err, 'here 45465465'))
                }}

            >
                <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
                    نام کاربری / ایمیل
                </label>
                <input id="username" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    value={form.user}
                    onChange={(e) => form.user = e.target.value}
                ></input>

                <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
                    زمر عبور
                </label>
                <input id="password" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="password"
                    value={form.pass}
                    onChange={(e) => form.pass = e.target.value}
                ></input>
                <br />
                <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit' >ورود</button>
            </form>
        </div>
    </>

})
