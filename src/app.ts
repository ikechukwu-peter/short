import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import route from "./routes/url.routes";

const app: Application = express();

//Body parser, reading data from req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//compress app
app.use(compression());

//enable CORS
app.use(cors());

//Routing
app.use(route);

export default app;
