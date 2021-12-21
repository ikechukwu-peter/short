import cluster from "cluster";
import { cpus } from "os";
import { connect } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

//initializing app
import app from "./app";

const numWorkers = cpus().length;

if (cluster.isPrimary) {
  console.log("Master cluster setting up " + numWorkers + " workers...");

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log("Worker " + worker.process.pid + " is online");
  });

  cluster.on("exit", function (worker, code, signal) {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code: " +
        code +
        ", and signal: " +
        signal
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  //Handle uncaughtExceptions
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Server shutting down...");
    console.log(err.name, err.message, err.stack);
    process.exit(1);
  });

  //Connecting to mongoose
  async function dbInit(): Promise<void> {
    try {
      await connect(process.env.DATABASE!);
      console.log("Connected to Database successfully");
    } catch (err) {
      console.log("Failed to connect to database " + err);
    }
  }

  //Call DB to start
  dbInit();

  //Setting port
  const port = process.env.PORT || 5000;

  //Listening for request
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });

  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err);
    server.close(() => {
      process.exit(1);
    });
  });

  //For heroku
  process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED. Shuttig down gracefully!!");

    server.close(() => {
      console.log("Process terminated!");
    });
  });
}
