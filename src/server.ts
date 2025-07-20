/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
let server: Server;
const startServer = async () => {
  console.log(envVars.NODE_ENV)
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log('connected to db')
   server = app.listen(envVars.PORT, () => {
      console.log(`server is listening on  port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error)
  }
};
startServer()


process.on("SIGTERM", () => {
  console.log("🔥SIGTERM SIGNAL RICEVED detected, shutting down...");

  if (server) {
    server.close(() => {
      console.log("🚪 Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


process.on("SIGINT", () => {
  console.log("🔥SIGINT SIGNAL RICEVED detected, shutting down...");

  if (server) {
    server.close(() => {
      console.log("🚪 Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on("unhandledRejection", (error: any) => {
  console.log("🔥 Unhandled Rejection detected, shutting down...");
  console.error(error?.message || error);

  if (server) {
    server.close(() => {
      console.log("🚪 Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});



process.on("uncaughtException", (error: any) => {
  console.log("🔥Uncaught Exception detected, shutting down...");
  console.error(error?.message || error);

  if (server) {
    server.close(() => {
      console.log("🚪 Server closed.");
      process.exit(1);
    });
  } 
  // else {
  //   process.exit(1);
  // }
});

throw new Error(' i forgot to catch this local error')

