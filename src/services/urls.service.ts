import request from "request";
import ShortenModel from "../model/shorten.model";
import path from "path";
import { fork } from "child_process";

//URLS class that handles all the url methods
class URLS {
  private relative_filename: string = "../lib/random.ts";
  private fullPath: string = path.resolve(__dirname, this.relative_filename);

  constructor() {}
  async urlShortener(urlToShorten: any) {
    return new Promise((resolve, reject) => {
      let child = fork(this.fullPath);

      child.on("message", async (msg: any) => {
        /**
         * TODO: check for duplicate hash and create another
         */
        // let copy: any = await ShortenModel.findOne({ msg });

        // if (copy) {
        // }

        if (!urlToShorten.startsWith("http"))
          urlToShorten = "https:" + "//" + urlToShorten;

        let urlData = await ShortenModel.create({
          shorturl: msg,
          longurl: urlToShorten,
        });

        console.log(urlData + "I came from here");

        if (urlData.shorturl) {
          //send response
          return resolve(urlData.shorturl);
        } else {
          return reject("Error creating a shortend url");
        }
      });

      child.send("start");
      child.on("close", (code) => {
        console.log(`Child closed with the code ${code}`);
      });
    });
  }

  async urlShortenerCustom(urlToShorten: any, custom: any) {
    try {
      if (!urlToShorten.startsWith("http"))
        urlToShorten = "https:" + "//" + urlToShorten;
      let data = await ShortenModel.findOne({ shorturl: custom });

      if (data === null) {
        let newUrl = await ShortenModel.create({
          shorturl: custom,
          longurl: urlToShorten,
        });
        return Promise.resolve(newUrl.shorturl);
      } else {
        return Promise.reject(`Custom url ${custom} not allowed.`);
      }
    } catch (err: any) {
      return Promise.reject(`Error occured`);
    }
  }

  async urlExpander(expandUrl: any) {
    if (!expandUrl.startsWith("http")) expandUrl = "https:" + "//" + expandUrl;

    return new Promise((resolve, reject) => {
      request(
        {
          url: expandUrl,
          method: "HEAD",
          followAllRedirects: true,
        },
        (err, response, body) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          return resolve(response.request.href);
        }
      );
    });
  }
  async urlForwarder(url: string) {
    try {
      let urlData = await ShortenModel.findOne({ shorturl: url });

      if (urlData !== null) {
        urlData.accessed++;
        urlData.save();
        return Promise.resolve(urlData.longurl);
      } else {
        return Promise.reject("No url found");
      }
    } catch (err: any) {
      console.log(err);
      return Promise.reject(err.message);
    }
  }
}

const urls = new URLS();

export default urls;
