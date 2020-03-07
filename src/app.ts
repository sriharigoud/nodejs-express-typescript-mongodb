import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import {loggerMiddleware} from './middleware/logger.middleware'
import {errorMiddlware} from './middleware/error.middleware';


class App {
    public app: express.Application;
    public port: number;
   
    constructor(controllers, port) {
      this.app = express();
      this.port = port;
      this.connectToTheDatabase();  
      this.initializeMiddlewares();
      this.initializeControllers(controllers);
    }
   
    private initializeMiddlewares() {
      this.app.use(bodyParser.json());
      this.app.use(loggerMiddleware);
      this.app.use(errorMiddlware)
    }
   
    private initializeControllers(controllers) {
      controllers.forEach((controller) => {
        this.app.use('/', controller.router);
      });
    }
    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;
        
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, { useNewUrlParser: true, useUnifiedTopology: true } );
        mongoose.connection.on('error', err => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(-1); // eslint-disable-line no-process-exit
        });
    }
    public listen() {
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
      });
    }
  }
   
  export default App;