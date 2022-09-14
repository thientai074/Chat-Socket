require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import {env} from "./src/utils/myVariables";

const cookieParser = require("cookie-parser");
import {useRoute} from "./src/routes/AppRoute";

const app = express();

app.use(cookieParser());

const MONGODB = env.MONGODB;
const CLIENT_HOST = env.CLIENT_HOST;

const corsOptions = {
    origin: CLIENT_HOST,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("combined"));

app.use(express.json({limit: "50mb"}));
app.use(
    express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000})
);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB);
    } catch (error) {
        console.log("Ket noi Database that bai !!!");
    }
};
connectDB().then(() => {
    console.log("Ket noi Database thanh cong !!!");
});

const PORT = 8000;

//Use Route
useRoute(app);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
