import { wss } from './server.js';
import { messageController } from './controllers/message.controller.js';

const CLIENTS = {};

wss.on('connection', async (socket, req) => {
  let temp_var = req.url;
  let originArray = temp_var.split('/');
  let cp_id = originArray[originArray.length - 1];
  CLIENTS[cp_id] = socket;
  socket.on('message', async (message) => {
    const msgParsed = JSON.parse(message);
    messageController(wss, socket, message, req.url, CLIENTS);
  });
});

export default wss;
