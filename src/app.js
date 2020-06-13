import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import dbConfig from './config/database';

// TODO - Separar em outro arquivo
mongoose.connect(dbConfig.conn, dbConfig.options)
  .then(() => console.log('> Successfully connected to DB'))
  .catch(err => console.log(err));

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;