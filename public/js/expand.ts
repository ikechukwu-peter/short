/* eslint-disable */
import axios from "axios";
import { shorten } from "./shorten";
let user_url = document.getElementById("user-provided-url");
let expanded_url = document.getElementById("expanded-link");
let expCopyBtn = document.querySelector(".expand-copy-btn");
let tooltip = document.querySelector(".expandtip");
let shortenBtn = <HTMLInputElement>document.getElementById("shorten-btn");

export const expand = async (url: string) => {
  try {
    let route: string = `/expand?query=${url}`;

    console.log(route);
    let loading: boolean = false;

    const res = await axios({
      method: "GET",
      url: route,
    });
    loading = true;
    if (shortenBtn && loading) {
      shortenBtn.innerHTML = "Loading...";
      shortenBtn.disabled = true;
    }

    if (res.data) {
      loading = false;
      shortenBtn.innerHTML = "Shorten";
      shortenBtn.disabled = false;

      if (res.data) {
      }

      console.log(res.data);
      if (user_url && expanded_url && expCopyBtn) {
        user_url.innerHTML = url;
        expanded_url.innerHTML = res.data;
        expanded_url.setAttribute("href", `${res.data}`);
        expanded_url.setAttribute("title", `Expanded URL for ${url}`);
        expCopyBtn.addEventListener("click", async () => {
          await navigator.clipboard.writeText(res.data);

          if (tooltip) {
            tooltip.innerHTML = "Copied";
          }
        });
      }
    }
  } catch (err: any) {
    console.log(err);
    // showAlert('error', err.response.data.message);
  }
};
