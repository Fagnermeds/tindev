import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import socketio from 'socket.io';

import routes from './routes';

interface IConnectedUsersProps {
  [key: string]: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      io: socketio.Server;
      connectedUsers: IConnectedUsersProps;
    }
  }
}

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const connectedUsers: IConnectedUsersProps = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

mongoose.connect(
  'mongodb+srv://tindev:tindev@cluster0-zbdvm.mongodb.net/tindevapp?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());

app.use(express.json());
app.use(routes);

server.listen(3333, () => {
  console.log('🚀️ Server running...');
});
