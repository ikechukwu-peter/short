import { Router } from "express";
import urlController from "../controllers/urls.controller";

const route = Router();

route.get("/", urlController.index);
route.get("/shorten", urlController.urlShortener);
route.get("/expand", urlController.urlExpander);
route.get("/:urlToForward", urlController.urlForwarder);
route.get("*", urlController.urlDoNotExist);

export default route;
