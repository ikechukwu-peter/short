/* eslint-disable */
import axios from 'axios';
// import { showAlert } from './alerts';

export const expand = async (url: string) => {
    try {
        let route: string = `/expand?query=${url}`
        const res = await axios({
            method: 'GET',
            url: route,
        });

        console.log(res)

        //   if (res.data.status === 'success') {
        //   //   showAlert('success', 'Logged in successfully!');
        //     window.setTimeout(() => {
        //       location.assign('/');
        //     }, 1500);
        //   }


    } catch (err: any) {
        console.log(err)
        // showAlert('error', err.response.data.message);
    }
};