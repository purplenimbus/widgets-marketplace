import express, { Express } from 'express';
const PORT = (process.env.APP_PORT || 5000);
const app: Express = express();
import { sequelize } from './database/sequelize';
import fs from "fs";
import { errorHandler } from './middleware';
import logger from "morgan";

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

app.use(require('body-parser').json());
app.use(express.json());

sequelize.sync({force: false}).then(() => console.log("Database connected")).catch((err: any) => console.log(err));

fs.readdirSync("./models").map((model) => {
  return require(`./models/${model}`);
});

app.use("/api", require("./routes/registration"));

app.use(errorHandler);  

const server = app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`);
});

process.once("unhandledRejection", (err: any) =>{
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});