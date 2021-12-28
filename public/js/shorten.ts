/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
let shortenBtn = <HTMLInputElement>document.getElementById("shorten-btn");
let shortForm = document.getElementById("shorten");

export const shorten = async (urlToShorten: string, custom: string = "") => {
  //colors
  let bgColor: string = "#016064";
  let bgHoverColor: string = "#48aaad";
  try {
    let route: string =
      custom !== ""
        ? `/shorten?urlToShorten=${urlToShorten}&custom=${custom}`
        : `/shorten?urlToShorten=${urlToShorten}`;

    if (shortenBtn) {
      let spinner = `<i class="fa fa-spinner fa-spin"></i>`;
      shortenBtn.innerHTML = spinner;
      shortenBtn.disabled = true;
      shortenBtn.style.backgroundColor = bgHoverColor;
    }

    const res = await axios({
      method: "GET",
      url: route,
    });
    shortenBtn.innerHTML = "Shorten";
    shortenBtn.disabled = false;
    shortenBtn.style.backgroundColor = bgColor;

    if (shortForm) {
      console.log(res.data);
      let insertResponseToDom = `<div class="shorten-url">
                <span class="user-provided">
                  <a href=${urlToShorten} target="_blank" id="user-provided-url">${urlToShorten}</a>
                </span>
                <div class="generated">
                  <a href=${res.data}  target="_blank" id="generated-link" title="Shoretned URL for ${urlToShorten}">${res.data}</a>
                  <span class="tooltip">
                  <button class="shorten-copy-btn">
                    Copy
                    <span id="myTooltip" class="tooltiptext shorttip"> Copy to clipboard </span>
                  </button>
                </span>
                </div>                
              </div>`;
      //Check if already in the DOM
      let shortenUrlDiv = document.querySelector(".shorten-url");
      if (shortenUrlDiv) {
        shortenUrlDiv.parentNode?.removeChild(shortenUrlDiv);
      }
      shortForm.insertAdjacentHTML("afterend", insertResponseToDom);
      let generated_url = document.getElementById("generated-link");
      let genCopyBtn = document.querySelector(".shorten-copy-btn");
      let tooltip = document.querySelector(".shorttip");

      if (generated_url && genCopyBtn && tooltip) {
        genCopyBtn.addEventListener("click", async () => {
          await navigator.clipboard.writeText(res.data);
          if (tooltip) {
            tooltip.innerHTML = "Copied";
            setTimeout(() => {
              if (tooltip) {
                tooltip.innerHTML = "Copy to clipboard";
              }
            }, 10000);
          }
        });
      }
    }
  } catch (err: any) {
    shortenBtn.innerHTML = "Shorten";
    shortenBtn.disabled = false;
    shortenBtn.style.backgroundColor = bgColor;
    console.log(err.response.data.message);
    showAlert(
      "error",
      err.response
        ? err.response.data.message
        : "Please check your internet connection"
    );
  }
};
