import express, { Express } from 'express';
const PORT = (process.env.APP_PORT || 5000);
const app: Express = express();
import { sequelize } from './database/sequelize';
import fs from "fs";
import { errorHandler } from './middleware';

app.use(require('body-parser').json());
app.use(express.json());

sequelize.sync({force: false}).then(() => console.log("DB connected...")).catch((err: any) => console.log(err, "===DB ERROR==="));

fs.readdirSync("./models").map((model) => {
  return require(`./models/${model}`);
});

app.use(errorHandler);  

const server = app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`);
});

process.once("unhandledRejection", () =>{
  server.close(() => process.exit(1));
});