import { Router } from 'express';

import DevController from './controllers/DevController';
import LikeController from './controllers/LikeController';
import DislikesController from './controllers/DislikeController';
import TalkController from './controllers/TalkController';
import MessageController from './controllers/MessageController';

const routes = Router();

routes.get('/', (request, response) =>
  response.json({ message: `Hello ${request.query.name}!` }),
);

routes.get('/devs', DevController.index);
routes.get('/devs/:id', DevController.show);
routes.post('/devs', DevController.create);

routes.post('/devs/:devId/likes', LikeController.create);
routes.post('/devs/:devId/dislikes', DislikesController.create);

routes.get('/devs/:id/talks', TalkController.index);

routes.post('/devs/:devId/messages', MessageController.create);
routes.get('/devs/:talkId/messages', MessageController.index);

export default routes;
