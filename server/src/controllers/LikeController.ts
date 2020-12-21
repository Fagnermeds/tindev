import { Request, Response } from 'express';
import Dev from '../models/Dev';
import Talk from '../models/Talk';

export = {
  async create(request: Request, response: Response): Promise<Response> {
    const { user } = request.headers;
    const { devId } = request.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return response.status(400).json({ error: 'This is dev not found' });
    }

    if (!loggedDev) {
      return response.status(401).json({ error: 'Verify your credentials.' });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = request.connectedUsers[user as string];
      const targetSocket = request.connectedUsers[devId];

      const talk = await Talk.create({
        users: [{ _id: loggedDev._id }, { _id: targetDev._id }],
      });

      loggedDev.talks.push(talk._id);
      targetDev.talks.push(talk._id);

      await targetDev.save();

      if (loggedSocket) {
        request.io.to(loggedSocket).emit('match', targetDev);
      }

      if (targetSocket) {
        request.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return response.json(loggedDev);
  },
};
