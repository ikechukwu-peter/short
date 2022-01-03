import request from "request";
import path from "path";
import { fork } from "child_process";
import ShortenModel from "../model/shorten.model";
import encryption from "../lib/encryption";

//URLS class that handles all the url methods
class URLS {
  private relative_filename: string = "../lib/random";
  private fullPath: string = path.resolve(__dirname, this.relative_filename);

  constructor() {}
  async urlShortener(urlToShorten: any) {
    console.log(this.relative_filename)
    return new Promise((resolve, reject) => {
      let child = fork(this.fullPath);

      child.on("message", async (msg: any) => {
        if (!urlToShorten.startsWith("http"))
          urlToShorten = "https:" + "//" + urlToShorten;

        let urlHash: string = encryption(msg);
        let hashCheck = await ShortenModel.findOne({ shorturl: urlHash });
        if (hashCheck) {
          return Promise.reject("That is a Nip link.");
        }

        let urlData = await ShortenModel.create({
          shorturl: urlHash,
          longurl: urlToShorten,
        });

        if (urlData) {
          //send response
          return resolve(msg);
        } else {
          return reject("Error creating url");
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
      let urlHash: string = encryption(custom);
      let data = await ShortenModel.findOne({ shorturl: urlHash });

      if (data === null) {
        await ShortenModel.create({
          shorturl: urlHash,
          longurl: urlToShorten,
        });
        return Promise.resolve(custom);
      } else {
        return Promise.reject(`Custom already used.`);
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
      let urlHash: string = encryption(url);
      let urlData = await ShortenModel.findOne({ shorturl: urlHash });

      if (urlData !== null) {
        urlData.accessed++;
        urlData.save();
        return Promise.resolve(urlData.longurl);
      } else {
        return Promise.reject("No uRRRRRRRRRl found");
      }
    } catch (err: any) {
      console.log(err);
      return Promise.reject(err.message);
    }
  }
}

const urls = new URLS();

export default urls;
