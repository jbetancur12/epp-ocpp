import config from './config/config.js';
import app from './express.js';
import mongoose from 'mongoose';
import ip from 'ip';
//import WebSocket from "ws";
import { createServer } from './centralSystem.js';

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
process.on('unhandledRejection', function (reason, p) {
  console.log(
    'Possibly Unhandled Rejection at: Promise ',
    p,
    ' reason: ',
    reason,
  );
});

const server = require('http').createServer(app);
const centralSystem = createServer(server);

console.log('%cserver.js line:22 centraSystem', 'color: #007acc;', centralSystem.options.wsOptions);

// const wss = new WebSocket.Server({ server: server });
// export { wss };
// require("./ws");

server.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('Server started on %s.', ip.address(),':',config.port);
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

// import rune from './test'

// rune()

export { centralSystem };
