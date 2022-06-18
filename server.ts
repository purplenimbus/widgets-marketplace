import express, { Express } from 'express';
const PORT = (process.env.APP_PORT || 5000);
const app: Express = express();

app.use(require('body-parser').json());
app.use(express.json());

const server = app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`);
});