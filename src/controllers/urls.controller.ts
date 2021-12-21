import { Request, Response } from "express";
import urls from "../services/urls.service";

class URLS {
  constructor() {}
  async index(req: Request, res: Response) {
    res.send("Hello");
  }
  async urlShortener(req: Request, res: Response) {
    //extract url to shorten
    const { urlToShorten } = req.params;

    try {
      let response = await urls.urlShortener(urlToShorten);
      res.status(201).send(response);
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
      if(err.code === "ENOTFOUND"){
        res.status(404).json({status: "fail", error: "The requested URL was not found"});
      }
      else {
        res.status(500).json({ status: "fail", error: "Something went wrong" });
      }
    }
  }
  async urlForwarder(req: Request, res: Response) {
    //extract shortened link
    const { urlToForward} = req.params;

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
