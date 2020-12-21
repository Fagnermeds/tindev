import { Request, Response } from 'express';
import Dev from '../models/Dev';
import Talk from '../models/Talk';

export = {
  async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const loggedDev = await Dev.findById(id);

    if (!loggedDev) {
      throw new Error('This user does not authenticate.');
    }

    const talks = await Talk.find({
      _id: { $in: loggedDev.talks },
    })
      .populate('users', ['name', 'user', 'avatar'])
      .populate('last_msg', ['content', 'createdAt'])
      .sort({ last_msg: -1 });

    let indexUser: number;

    const serializedTalks = talks.map(talk => {
      talk.users.forEach((user, index) => {
        if (JSON.stringify(user._id) === JSON.stringify(loggedDev._id)) {
          indexUser = index;
        }
      });

      talk.users.splice(indexUser, 1);

      return talk;
    });

    return response.json(serializedTalks);
  },
};
