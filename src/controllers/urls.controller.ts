import { Request, Response } from "express";
import ShortenModel from "../model/shorten.model";
import urls from "../services/urls.service";
import encryption from "../lib/encryption";

class URLS {
  constructor() { }
  async index(req: Request, res: Response) {
    res.render("index", { title: "Nip || Shorten and expand your url." });
  }
  async urlShortener(req: Request, res: Response) {
    //extract url to shorten and custom if any
    const { urlToShorten, custom } = req.query;

    let castUrl: string = (<string>urlToShorten)
 
    try {

      if (urlToShorten === undefined) {
        res.status(400).json({ status: "fail", message: "Empty url not allowed." });
      } else {
        if(castUrl.startsWith(`${req.protocol}://${req.headers.host}`)){
          res.status(403).json({status: "fail", message: "That's a Nip link."})
        }
        else {
          
        if (custom === undefined && urlToShorten !== undefined) {
          console.log(urlToShorten);

          let response = await urls.urlShortener(urlToShorten);

          //form the url to be sent to the client
          let fullURL = `${req.protocol}://${req.headers.host}/${response}`;

          res.status(201).send(fullURL);
        } else {
          let customUrlHash: string = encryption(custom)
          let data = await ShortenModel.findOne({ shorturl: customUrlHash });

          if (data !== null) {
            let errMessage = `Custom url ${custom} already used.`;
            res.status(409).json({ status: "fail", message: errMessage });
          } else {
            let customResp = await urls.urlShortenerCustom(
              urlToShorten,
              custom
            );
            //form the url to be sent to the client
            let customURL = `${req.protocol}://${req.headers.host}/${customResp}`;
            res.status(201).send(customURL);
          }
        }
        }
      }
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ status: "fail", error: err });
    }
  }
  async urlExpander(req: Request, res: Response) {
    //extract user shortened link
    const { query } = req.query;
    try {
      let response = await urls.urlExpander(query);

      res.status(201).send(response);
    } catch (err: any) {
      console.log(err);
      if (err.code === "ENOTFOUND") {
        res
          .status(404)
          .json({ status: "fail", message: "The requested URL was not found" });
      } else {
        res.status(500).json({ status: "fail", message: "Something went wrong" });
      }
    }
  }
  async urlForwarder(req: Request, res: Response) {
    //extract shortened link
    const { urlToForward } = req.params;

    try {
      let response = await urls.urlForwarder(urlToForward);
      res.redirect(response);
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ status: "fail", message: err });
    }
  }

  async urlDoNotExist(req: Request, res: Response) {
    res.status(404).json({
      status: "fail",
      message: `Requested route ${req.originalUrl} does not exist.`,
    });
  }
}

const urlController = new URLS();

export default urlController;
