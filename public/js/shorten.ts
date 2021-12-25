/* eslint-disable */
import axios from "axios";
let shortenBtn = <HTMLInputElement>document.getElementById("shorten-btn");
let shortForm = document.getElementById("shorten");

export const shorten = async (urlToShorten: string, custom: string = "") => {
  try {
    let route: string =
      custom !== ""
        ? `/shorten?urlToShorten=${urlToShorten}&custom=${custom}`
        : `/shorten?urlToShorten=${urlToShorten}`;

    if (shortenBtn) {
      //set button background to show disabled
      // shortenBtn.setAttribute("id", "is-active");

      let spinner = `<i class="fa fa-spinner fa-spin"></i>`;
      shortenBtn.innerHTML = spinner;

      shortenBtn.disabled = true;
    }

    const res = await axios({
      method: "GET",
      url: route,
    });
    shortenBtn.innerHTML = "Shorten";
    shortenBtn.disabled = false;
    console.log(res.data);
    if (shortForm) {
      console.log(res.data);
      let insertResponseToDom = `<div class="shorten-url">
                <span class="user-provided">
                  <a href=${urlToShorten} id="user-provided-url">${urlToShorten}</a>
                </span>
                <div class="generated">
                  <a href=${res.data}  id="generated-link" title="Shoretned URL for ${urlToShorten}">${res.data}</a>
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
    console.log(err.response.data.message);

    // showAlert('error', err.response.data.message);
  }
};
