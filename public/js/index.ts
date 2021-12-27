/* eslint-disable */
import "@babel/polyfill";
import { shorten } from "./shorten";
import { expand } from "./expand";
import { showAlert } from './alert'
import { isURL } from './checkURL'

//DOM ELEMENTS
let shortenForm = document.getElementById("shorten");
let expandForm = document.getElementById("expand");

if (shortenForm) {
  let formElements = shortenForm.getElementsByTagName("input");
  let inputArray = [...formElements];
  let elements = inputArray.map((element) => element);
  shortenForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let url =
      elements[0].value &&
        elements[0].value !== "" &&
        elements[0].value !== null
        ? elements[0].value
        : "";

    if (!isURL(url)) {
      showAlert("error", "Invalid URL")
    }
    else {
      let custom =
        elements[1].value &&
          elements[1].value !== "" &&
          elements[1].value !== null
          ? elements[1].value
          : "";

      if (url && url !== "") {
        shorten(url, custom);
      } else {
        showAlert("error", "Please type your url")
        console.log(`Empty url not allowed `);
      }
    }
  });
}

if (expandForm) {
  let formElements = expandForm.getElementsByTagName("input");
  let inputArray = [...formElements];
  let elements = inputArray.map((element) => element);

  expandForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let url: string =
      elements[0].value &&
        elements[0].value !== "" &&
        elements[0].value !== null
        ? elements[0].value
        : "";

    if (!isURL(url)) {
      showAlert("error", "Invalid URL")
    } else {
      if (url && url !== "") {
        expand(url);
      } else {
        showAlert("error", "Please type your url")
        console.log(`Empty url not allowed `);
      }
    } 
  });
}
