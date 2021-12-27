/* eslint-disable */
import axios from "axios";
import { showAlert } from './alert'
let expForm = document.getElementById("expand");
let expandBtn = <HTMLInputElement>document.getElementById("expand-btn");

export const expand = async (url: string) => {
  let hoverColor: string = "#504250";
  let bgExpColor: string = "#342834"
  try {
    let route: string = `/expand?query=${url}`;

    if (expandBtn) {
      let spinner = `<i class="fa fa-spinner fa-spin"></i>`;
      expandBtn.innerHTML = spinner;
      expandBtn.disabled = true;
      expandBtn.style.backgroundColor = hoverColor;
    }

    const res = await axios({
      method: "GET",
      url: route,
    });
    expandBtn.innerHTML = "Expand";
    expandBtn.disabled = false;
    expandBtn.style.backgroundColor = bgExpColor

    if (expForm) {
      console.log(res.data);
      let putResponseToDom = `<div class="expand-url">
                <span class="user-provided">
                  <a href=${url} id="user-provided-url">${url}</a>
                </span>
                <div class="generated">
                  <a href=${res.data}  id="expanded-link" title="Expanded URL for ${url}">${res.data}</a>
                  <span class="tooltip">
                  <button class="expand-copy-btn">
                    Copy
                    <span id="myTooltip" class="tooltiptext expandtip"> Copy to clipboard </span>
                  </button>
                </span>
                </div>                
              </div>`;

      //Check if already in the DOM
      let expandUrlDiv = document.querySelector(".expand-url");
      if (expandUrlDiv) {
        expandUrlDiv.parentNode?.removeChild(expandUrlDiv);
      }
      expForm.insertAdjacentHTML("afterend", putResponseToDom);
      let expanded_url = document.getElementById("expanded-link");
      let expCopyBtn = document.querySelector(".expand-copy-btn");
      let tooltip = document.querySelector(".expandtip");

      if (expanded_url && expCopyBtn && tooltip) {
        expCopyBtn.addEventListener("click", async () => {
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
    expandBtn.innerHTML = "Expand";
    expandBtn.disabled = false;
    expandBtn.style.backgroundColor = bgExpColor
    console.log(err.response.data.message);
    showAlert('error', err.response ? err.response.data.message : "Please check your internet connection");
  }
};
