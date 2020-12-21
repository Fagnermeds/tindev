import { Request, Response } from 'express';
import Dev from '../models/Dev';

export = {
  async create(request: Request, response: Response) {
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

    loggedDev.dislikes.push(targetDev._id);

    loggedDev.save();

    return response.json(loggedDev) ;
  }
}