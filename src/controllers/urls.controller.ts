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
    const { shortenUrl } = req.params;
    try {
      let response = await urls.urlExpander(shortenUrl);

      res.status(201).send(response);
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ status: "fail", error: err.message });
    }
  }
  async urlForwarder(req: Request, res: Response) {
    //extract shortened link
    // const { url } = req.params;

    // try {
    //   let response = await urls.urlForwarder(url);
    //   res.redirect(response);
    // } catch (err: any) {
    //   console.log(err);
    //   res.status(500).json({ status: "fail", error: err });
    // }

    res.redirect("google.com");
  }

  async urlDoNotExist(req: Request, res: Response) {
    res.status(404).json({
      status: "fail",
      error: `Requested route ${req.originalUrl} does not exist.`,
    });
  }
}

const url = new URLS();

export default url;
