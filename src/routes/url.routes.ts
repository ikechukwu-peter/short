import { Router } from "express";
import url from "../controllers/urls.controller";

const route = Router();

route.get("/", url.index);
route.get("/shorten/:urlToShorten", url.urlShortener);
route.get("/expand/:shortenUrl", url.urlExpander);
route.get("/:url", url.urlForwarder);
route.get("*", url.urlDoNotExist);

export default route;
