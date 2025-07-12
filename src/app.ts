import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import { pinoLogger } from "@/middlewares/pino-logger";
import env from "./env";
import { errorHandler } from "./middlewares/error-handler.middleware";
import rootRoutes from "./routes/index.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoLogger());
app.use(cors());

app.use(env.BASE_PATH, rootRoutes);
// app.use((req, _res, next) => {
//   console.error(`Content-Length: ${req.headers["content-length"]}`);
//   console.error(
//     `Request Body Size: ${
//       req.body ? Buffer.byteLength(JSON.stringify(req.body)) : 0
//     }`
//   );
//   next();
// });

app.use(errorHandler);

export default app;
