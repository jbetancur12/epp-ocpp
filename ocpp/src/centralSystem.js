import WebSocket from 'ws';
import debugFn from 'debug';
import Logger, { LOGGER_URL } from './logger.js';
import { Connection } from './connection.js';
import { DEBUG_LIBNAME, OCPP_PROTOCOL_1_6 } from './constants.js';
import CentralSystemClient from './centralSystemClient.js';

const debug = debugFn(DEBUG_LIBNAME);

export default class CentralSystem {
  constructor(options) {
    this.options = options || {};
    this.clients = [];
    this.logger = new Logger();
  }

  listen(port = 9220, host = null) {
    this.port = port;
    
    const validateConnection = this.options.validateConnection || (() => true);

    const wsOptions = {
      port,
      host,
      handleProtocols: (protocols, req) => {
        let newProtocols;
        if (typeof protocols === 'object') {
          newProtocols = Array.from(protocols);
        } else {
          newProtocols = protocols;
        }
        if (newProtocols.indexOf(OCPP_PROTOCOL_1_6) === -1) {
          return '';
        }
        return OCPP_PROTOCOL_1_6;
      },
      verifyClient: async (info, cb) => {
        if (info.req.url === LOGGER_URL) {
          debug('Logger connected');
          return cb(true);
        }
        const isAccept = await validateConnection(info.req.url);

        this.logger.debug(
          `Request for connect "${info.req.url}" (${
            info.req.headers['sec-websocket-protocol']
          }) - ${isAccept ? 'Valid identifier' : 'Invalid identifier'}`,
        );

        cb(
          isAccept,
          404,
          'Central System does not recognize the charge point identifier in the URL path',
        );
      },
      ...(this.options.wsOptions || {}),
    };

    console.log('%ccentralSystem.js line:59 wsOptions', 'color: #007acc;', wsOptions);
    this.server = new WebSocket.Server(wsOptions);
    console.log('%ccentralSystem.js line:61 this.server', 'color: #007acc;', this.server);
    this.server.on('error', (ws, req) => {
      console.info(ws, req);
    });

    this.server.on('upgrade', (ws, req) => {
      console.info(req);
    });
    this.server.on('connection', (ws, req) => this.onNewConnection(ws, req));
     

    console.log('%ccentralSystem.js line:72 object', 'color: #007acc;', `Listen on ${host || 'default host'}:${port}`);
    debug(`Listen on ${host || 'default host'}:${port}`);
  }

  onNewConnection(socket, req) {
    socket.on('error', (err) => {
      console.info(err, socket.readyState);
    });

    if (req.url === LOGGER_URL) {
      this.logger.addSocket(socket);
      return;
    }

    if (!socket.protocol) {
      // From Spec: If the Central System does not agree to using one of the subprotocols offered by the client,
      // it MUST complete the WebSocket handshake with a response without a Sec-WebSocket-Protocol header and then
      // immediately close the WebSocket connection.
      this.logger.debug(`Close connection due to unsupported protocol`);
      return socket.close();
    }

    const connection = new Connection(socket, req, this.logger);

    const client = new CentralSystemClient(connection);

    connection.onRequest = (command) => this.onRequest(client, command);

    socket.on('close', (err) => {
      const index = this.clients.indexOf(client);
      this.clients.splice(index, 1);
    });
    this.clients.push(client);
  }

  async onRequest(client, command) {
    // implementation
  }
}
