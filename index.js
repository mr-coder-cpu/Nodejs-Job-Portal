
// API DOcumenATion
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
//package import
import express from "express";
import 'express-async-errors'
import dotenv from "dotenv";
import colors from "colors";
import cors from 'cors'
import morgan from 'morgan'
//security package
import helmet from "helmet";
import xss from 'xss-clean'
import ExpressMongoSanitize from "express-mongo-sanitize";
// import rateLimit from "express-rate-limit";
//files import
import connectDB from "./config/db.js";
//routes import
import testroutes from "./routes/testroutes.js";
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from "./middlewares/errorMiddleware.js";
import jobsRoutes from "./routes/jobsRoutes.js"
import userRoutes from './routes/userRoutes.js';


//dotenv config

dotenv.config();

//mongodb connection
connectDB();

// Swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        // url: "http://localhost:8080"
        url: "https://nodejs-job-portal-47n9.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);


//rest object 

const app = express()

//middleware
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"))

//rout

app.use("/api/v1/test", testroutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middleware
app.use(errorMiddleware);

//port
const PORT = process.env.PORT || 8080

//listen 

app.listen(PORT, () => {

  console.log(`Node Server Running in ${process.env.DEV_MODE} mode on port  ${PORT}`.bgCyan.white);

})
