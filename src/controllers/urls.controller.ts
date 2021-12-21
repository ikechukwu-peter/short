import { Request, Response } from "express";
import path from 'path'
import ShortenModel from "../model/shorten.model";
import urls from "../services/urls.service";


class URLS {
  constructor() { }
  async index(req: Request, res: Response) {
   res.render("index", {title: "Nip || shorten and expand your url."})
    
  }
  async urlShortener(req: Request, res: Response) {
    //extract url to shorten and custom if any
    const { urlToShorten, custom } = req.query;
    console.log(urlToShorten, custom)
    try {

      if (!custom) {
        let response = await urls.urlShortener(urlToShorten);
        res.status(201).send(response);
      }

      let data = await ShortenModel.findOne({ shorturl: custom });

      if (data !== null) {
        res.status(403).send(`Custom url ${custom} already used.`)
      }
      else {
        let customResp = await urls.urlShortenerCustom(urlToShorten, custom);
        res.status(201).send(customResp);
      }

    } catch (err: any) {
      console.log(err)
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
        res.status(404).json({ status: "fail", error: "The requested URL was not found" });
      }
      else {
        res.status(500).json({ status: "fail", error: "Something went wrong" });
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
      res.status(500).json({ status: "fail", error: err });
    }

  }

  async urlDoNotExist(req: Request, res: Response) {
    res.status(404).json({
      status: "fail",
      error: `Requested route ${req.originalUrl} does not exist.`,
    });
  }
}

const urlController = new URLS();

export default urlController;
