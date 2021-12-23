/* eslint-disable */
import axios from "axios";
let user_url = document.getElementById("user-provided-link");
let generated_url = document.getElementById("generated-link");
let genCopyBtn = document.querySelector(".shorten-copy-btn");
let tooltip = document.querySelector(".shorttip");

export const shorten = async (urlToShorten: string, custom: string = "") => {
  try {
    let route: string =
      custom !== ""
        ? `/shorten?urlToShorten=${urlToShorten}&custom=${custom}`
        : `/shorten?urlToShorten=${urlToShorten}`;
    console.log(route);
    const res = await axios({
      method: "GET",
      url: route,
    });

    console.log(res.data);
    if (user_url && generated_url && genCopyBtn) {
      user_url.innerHTML = urlToShorten;
      generated_url.innerHTML = res.data;
      generated_url.setAttribute("href", `${res.data}`);
      generated_url.setAttribute("title", `Shortened URL for ${urlToShorten}`);
      genCopyBtn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(res.data);
        if (tooltip) {
          tooltip.innerHTML = "Copied";
        }
      });
    }
  } catch (err: any) {
    console.log(err);
    // showAlert('error', err.response.data.message);
  }
};
