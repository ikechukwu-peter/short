/* eslint-disable */
import axios from 'axios';
// import { showAlert } from './alerts';

export const shorten = async (urlToShorten: string,  custom: string = "") => {
  try {   
        let route: string = custom !== "" ? `/shorten?urlToShorten=${urlToShorten}&custom=${custom}` : `/shorten?urlToShorten=${urlToShorten}`
        console.log(route)
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