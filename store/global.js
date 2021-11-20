
import { store, autoEffect } from '@risingstack/react-easy-state';

const Store = store({

    user: {
        jwt: '',
        admin_jwt: '',
    },
    ui: {
        modalState: '',
    },

    actions: {
        // user
        setJwt: (jwt) => {
            Store.user.jwt = jwt
        },
        setAdminJwt: (jwt) => {
            Store.user.admin_jwt = jwt
        },

        // ui
        setModal: (stat) => Store.ui.modalState = stat,

    }
});

//let localStorageLoaded = false // first time load from local storage other times save to it 

if (typeof window !== 'undefined')
    setTimeout(() => {

        const storage_user = JSON.parse(window.localStorage.getItem('atrchee-user'))
        for (let feild in storage_user)
            if (feild in Store.user)
                Store.user[feild] = storage_user[feild]

        autoEffect(() => {  // handle user store in localStorage
            window.localStorage.setItem('atrchee-user', JSON.stringify(Store.user))
        }, [Store.user])

    }, 1)

const { actions } = Store

export default Store
export { actions }