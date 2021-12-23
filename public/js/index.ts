/* eslint-disable */
import '@babel/polyfill';
import { shorten } from './shorten';
import { expand } from './expand';


//DOM ELEMENTS
let shortenForm = document.getElementById("shorten");
let expandForm = document.getElementById("expand");

if (shortenForm !== null) {
    let formElements = shortenForm.getElementsByTagName("input");
    let inputArray = [...formElements];
    let elements = inputArray.map(element => element);
    shortenForm.addEventListener("click", (e) => {
        e.preventDefault();
        let url = elements[0].value && elements[0].value !== "" && elements[0].value !== null ? elements[0].value : "";      
        let custom = elements[1].value && elements[1].value !== "" && elements[1].value !== null ? elements[1].value : "";
        shorten(url, custom)
    })
}

// if (expandForm !== null) {
//     let formElements = expandForm.getElementsByTagName("input");
//     let inputArray = [...formElements];
//     let elements = inputArray.map(element => element);
//     expandForm.addEventListener("click", (e) => {
//         e.preventDefault();
//         let url = elements[0].value && elements[0].value !== "" && elements[0].value !== null ? elements[0].value : "";      
//         expand(url)
//     })
// }




// form.addEventListener("submit", (e) => {
//     e.preventDefault()
//      let brand = arr[1].value && arr[1] !== "" && arr[1].value !== null ? arr[1].value : null;
//      let url = arr[0].value && arr[0].value !== "" && arr[0].value !== null ? arr[0].value : null;
//     let DomElements = {
//         shortenLink: url,
//         branding: brand
//     }
//     console.log(DomElements)


// })