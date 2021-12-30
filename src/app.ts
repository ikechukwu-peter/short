import express, { Application } from "express";
import path from "path";
// @ts-ignore
import rateLimit from "express-rate-limit";
//@ts-ignore
import helmet from "helmet";
//@ts-ignore
import xssclean from "xss-clean";
import compression from "compression";
import route from "./routes/url.routes";

const app: Application = express();
console.log(process.cwd() + "/public");
console.log(path.join(process.cwd(), "public"));

//setting static files
app.use(express.static("public"));
// view engine setup
app.set("views", "views");
app.set("view engine", "pug");

//Body parser, reading data from req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(xssclean());
//compress app
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
// Routing
app.use(apiLimiter);
app.use(route);

export default app;
