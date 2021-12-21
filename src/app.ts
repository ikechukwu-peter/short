import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import path from 'path';
import route from "./routes/url.routes";

const app: Application = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

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
