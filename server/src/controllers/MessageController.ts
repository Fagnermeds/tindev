import { Request, Response } from 'express';
import Dev from '../models/Dev';
import Message from '../models/Message';
import Talk from '../models/Talk';

export = {
  async create(request: Request, response: Response): Promise<Response> {
    // const { user } = request.headers;
    const { devId } = request.params;
    const { content, author, talk_id } = request.body;

    // const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    // if (!loggedDev) {
    //   return response.status(401).json({ error: 'Verify your credentials' });
    // }

    if (!targetDev) {
      return response.status(400).json({ error: 'This is dev not found' });
    }

    const msg = await Message.create({
      content,
      author,
      talk_id,
    });

    const talk = await Talk.findById(talk_id);

    if (talk) {
      talk.last_msg = msg._id;

      await talk.save();
    }

    const targetSocket = request.connectedUsers[devId];

    request.io.to(targetSocket).emit('message', msg);

    return response.json({});
  },

  async index(request: Request, response: Response): Promise<Response> {
    const { talkId } = request.params;

    const messages = await Message.find().where('talk_id').equals(talkId);

    return response.json(messages);
  },
};
