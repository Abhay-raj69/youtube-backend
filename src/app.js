import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// limit of the data we will accept
app.use(express.json({ limit: "16kb" }));

// data from url live % + between any url
app.use(express.urlencoded({ extended: true ,limit:"16kb"}));

// a public folder that will be used for storing photos,pdf etc
app.use(express.static("public"))

app.use(cookieParser())
 

export { app };
