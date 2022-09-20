import dotenv from "dotenv";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});
//Set up môi trường
export const env = {
    JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY as string,
    JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY as string,
    MONGODB: process.env.MONGODB as string,
    CLIENT_HOST: process.env.CLIENT_HOST as string,
    CHAT_APP: process.env.CHAT_APP as string,
    dbUserName: process.env.dbUserName as string,
    dbPassword: process.env.dbPassword as string,
    dbPort: process.env.dbPort as string,
    dbHostName: process.env.dbHostName as string,
    dbName: process.env.dbName as string,
};

// Message
export const errorUnknown = "Unknown error";

